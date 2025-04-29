/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import { ClientError, errorMiddleware } from './lib/index.js';

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

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

      // 使用 SQL 查询，根据 topic 和 questionNumber 查找问题
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
