# Task Manager Backend (Node.js + MongoDB)

A clean, production-ready REST API for a Task Manager application.

## Features

- **Full CRUD**: Create, Read, Update, and Delete tasks.
- **Error Handling**: Consistent JSON error responses.
- **Clean Structure**: Separated Routes, Controllers, and Models.

## API Endpoints

| Method   | Endpoint     | Description                                      |
| :------- | :----------- | :----------------------------------------------- |
| `GET`    | `/tasks`     | Fetch all tasks                                  |
| `POST`   | `/tasks`     | Create a new task (req body: `{ title }`)        |
| `PATCH`  | `/tasks/:id` | Update a task (req body: `{ title, completed }`) |
| `DELETE` | `/tasks/:id` | Delete a task                                    |

## Setup Instructions

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env` file in the root (a template is provided):

   ```
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/task_manager
   ```

3. **Run the Server**:

   ```bash
   # Development (with nodemon)
   npm run dev

   # Production
   npm start
   ```

## Project Structure

```text
backend/
├── controllers/   # Request handlers & Business logic
├── models/        # Mongoose schemas
├── routes/        # API route definitions
├── index.js       # Entry point & DB connection
└── .env           # Configuration secrets
```
