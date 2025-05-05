/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import pg from 'pg';
import argon2 from 'argon2';
import express from 'express';
import jwt from 'jsonwebtoken';
import { ClientError, errorMiddleware, authMiddleware } from './lib/index.js';

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const hashKey = process.env.TOKEN_SECRET;
if (!hashKey) throw new Error('TOKEN_SECRET not found in .env');

const app = express();

// Create paths for static directories
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());

// 。。。。。写在这 用这种形式
// app.get('/api/hello', (req, res) => {
//   res.json({ message: 'Hello, World!' });
// });
// GET /api/questions
app.get('/api/questions', async (req, res, next) => {
  try {
    const sql = `
      SELECT *
      FROM "questions"
      ORDER BY "questionNumber";
    `;
    const result = await db.query(sql);
    const questions = result.rows;
    res.json(questions);
  } catch (err) {
    next(err);
  }
});
app.get('/api/questions/:questionNumber', async (req, res, next) => {
  try {
    const { questionNumber } = req.params;
    const sql = `
      SELECT *
      FROM questions
      WHERE "questionNumber" = $1
    `;
    const params = [questionNumber];
    const result = await db.query(sql, params);
    const question = result.rows[0];
    if (!question) {
      throw new ClientError(
        404,
        `Question with number ${questionNumber} not found`
      );
    }
    res.json(question);
  } catch (err) {
    next(err);
  }
});

app.get(
  '/api/questions/topic/:topicName/:questionNumber',
  async (req, res, next) => {
    try {
      const { topicName, questionNumber } = req.params;
      const sql = `
      SELECT *
      FROM questions
      WHERE "topic" = $1 AND "questionNumber" = $2
    `;
      const params = [topicName, questionNumber];
      const result = await db.query(sql, params);
      const question = result.rows[0]; // 获取第一个匹配的题目
      if (!question) {
        throw new ClientError(
          404,
          `Question with topic '${topicName}' and number ${questionNumber} not found.`
        );
      }

      res.json(question); // 返回问题数据
    } catch (err) {
      next(err); // 错误处理
    }
  }
);
app.get('/api/reviews/:topic', authMiddleware, async (req, res, next) => {
  try {
    const { userid } = req.user;

    const topic = req.params.topic;

    const result = await db.query(
      `
       SELECT q."questionid", q."los", q."explanation", q."topic", ur."addedAt" AS "created_at"
  FROM "userReviews" ur
  JOIN "questions" q ON ur."questionid" = q."questionid"
  WHERE ur."userid" = $1 AND q."topic" = $2
  ORDER BY ur."addedAt" DESC
      `,
      [userid, topic]
    );

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

/** ---------------------- 注册和登录 ---------------------- **/

app.post('/api/auth/sign-up', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      throw new ClientError(400, 'required fields not completed');
    }
    const hashedPassword = await argon2.hash(password);
    const sql = `
   insert into "users" ("username", "email", "passwordHash")
      values ($1, $2, $3)
      returning "userid", "username", "email", "createdAt"
    `;
    const params = [username, email, hashedPassword];
    const result = await db.query(sql, params);
    const user = result.rows[0];
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

app.post('/api/auth/sign-in', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ClientError(401, 'invalid login');
    }
    const sql = `
    select "userid",
           "passwordHash"
      from "users"
     where "username" = $1
  `;
    const params = [username];
    const result = await db.query(sql, params);
    const [user] = result.rows;
    if (!user) {
      throw new ClientError(401, 'invalid login');
    }
    const { userid, passwordHash } = user;
    if (!(await argon2.verify(passwordHash, password))) {
      throw new ClientError(401, 'invalid login');
    }
    const payload = { userid, username };
    const token = jwt.sign(payload, hashKey);
    res.json({ token, user: payload });
  } catch (err) {
    next(err);
  }
});

/** ---------------------- 添加 Review 题目 ---------------------- **/

app.post('/api/review', authMiddleware, async (req, res, next) => {
  try {
    const { userid } = req.user;
    console.log('req.user =', req.user);

    const { questionid } = req.body;

    if (!questionid) {
      throw new ClientError(400, 'questionid is required');
    }

    const result = await db.query(
      `
      INSERT INTO "userReviews" ("userid", "questionid", "addedAt")
      VALUES($1, $2, NOW());
      RETURNING *;
      `,
      [userid, questionid]
    );

    res.status(201).json(result.rows[0] || { message: 'Already added' });
  } catch (err) {
    next(err);
  }
});

/** ---------------------- 原有的 questions 接口保留不动 ---------------------- **/

/*
 * Handles paths that aren't handled by any other route handler.
 * It responds with `index.html` to support page refreshes with React Router.
 * This must be the _last_ route, just before errorMiddleware.
 */
app.get('*', (req, res) => res.sendFile(`${reactStaticDir}/index.html`));

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log('Listening on port', process.env.PORT);
});
