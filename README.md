# full-stack-project

A full stack TypeScript solo project.

# CFA Quiz Web App

This is a full-stack web application designed to help users prepare for the CFA exam. Users can log in, answer multiple-choice questions, and track their progress. Incorrectly answered questions are saved and can be reviewed later.

## Features

- 🔐 User authentication with JWT and cookies
- 📋 Topic-based multiple choice questions
- ✅ Answer evaluation with backend validation
- 📊 Record of all submitted answers
- ❌ Dedicated page for reviewing incorrect answers
- 📚 Organized by CFA topics and Learning Outcome Statements (LOS)
- 🧠 Explanation display after each question

## Tech Stack

### Frontend

- **React** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Fetch API** with `credentials: 'include'` for cookie-based auth

### Backend

- **Node.js + Express**
- **Sequelize** ORM with PostgreSQL
- **JWT Authentication** (stored in HTTP-only cookies)
- **RESTful API endpoints**

## Key Endpoints

| Method | Endpoint        | Description                         |
|--------|------------------|-------------------------------------|
| POST   | `/api/login`     | Login user, return JWT token        |
| POST   | `/api/answer`    | Submit an answer                    |
| GET    | `/api/questions` | Fetch questions by topic/LOS        |
| GET    | `/api/wrong`     | Fetch user's incorrect answers      |

## Database Schema (simplified)

### Users

| Column   | Type    |
|----------|---------|
| userid   | INTEGER |
| username | STRING  |
| password | STRING (hashed) |

### Questions

| Column     | Type    |
|------------|---------|
| questionid | INTEGER |
| topic      | STRING  |
| los        | STRING  |
| question   | TEXT    |
| answer     | STRING  |
| options    | JSON    |

### Answers

| Column        | Type    |
|---------------|---------|
| answerid      | INTEGER |
| userid        | INTEGER |
| questionid    | INTEGER |
| selectedAnswer| STRING  |
| isCorrect     | BOOLEAN |
| createdAt     | DATE    |

## Getting Started

1. **Clone the repo**

```bash
git clone https://github.com/yourusername/cfa-quiz-app.git
cd cfa-quiz-app
