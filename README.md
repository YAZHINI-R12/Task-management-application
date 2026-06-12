# Task Management Application

This is a beginner full-stack task management project.

## Features

- User registration
- User login
- Add tasks
- View tasks
- Mark tasks as completed
- Delete tasks
- Filter all, pending, and completed tasks
- Responsive design for desktop and mobile

## Technologies Used

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js and Express.js
- Database: JSON files for beginner-friendly storage

## How to Run

1. Install Node.js from https://nodejs.org/
2. Open this project folder in VS Code.
3. Open the terminal.
4. Run:

```bash
npm install
```

5. Start the app:

```bash
npm start
```

6. Open this in your browser:

```text
http://localhost:4000
```

## Demo Login

```text
Email: student@example.com
Password: 123456
```

## File Explanation

```text
server.js
```

This is the backend. It handles login, register, create task, update task, and delete task.

```text
public/index.html
```

This is the main page structure.

```text
public/style.css
```

This controls the design and responsive layout.

```text
public/script.js
```

This connects the frontend to the backend APIs.

```text
data/users.json
```

This stores user account data.

```text
data/tasks.json
```

This stores task data.

## API Routes

```text
POST /api/register
POST /api/login
GET /api/tasks?userId=USER_ID
POST /api/tasks
PUT /api/tasks/:id
DELETE /api/tasks/:id
```

## Note

This project stores passwords as plain text only because it is a beginner learning project.
In a real project, passwords must be hashed using a package like bcrypt.
