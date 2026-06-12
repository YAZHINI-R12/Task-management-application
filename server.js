const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 4000;
const USERS_FILE = path.join(__dirname, "data", "users.json");
const TASKS_FILE = path.join(__dirname, "data", "tasks.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

app.post("/api/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Please fill all fields." });
  }

  const users = readJson(USERS_FILE);
  const userExists = users.some((user) => user.email === email);

  if (userExists) {
    return res.status(409).json({ error: "This email is already registered." });
  }

  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password
  };

  users.push(newUser);
  writeJson(USERS_FILE, users);

  res.status(201).json({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email
  });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const users = readJson(USERS_FILE);
  const user = users.find((item) => item.email === email && item.password === password);

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email
  });
});

app.get("/api/tasks", (req, res) => {
  const { userId } = req.query;
  const tasks = readJson(TASKS_FILE);
  const userTasks = tasks.filter((task) => task.userId === userId);

  res.json(userTasks);
});

app.post("/api/tasks", (req, res) => {
  const { userId, title, dueDate, priority } = req.body;

  if (!userId || !title || !dueDate) {
    return res.status(400).json({ error: "Title and due date are required." });
  }

  const tasks = readJson(TASKS_FILE);
  const newTask = {
    id: Date.now().toString(),
    userId,
    title,
    dueDate,
    priority: priority || "Medium",
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);
  writeJson(TASKS_FILE, tasks);
  res.status(201).json(newTask);
});

app.put("/api/tasks/:id", (req, res) => {
  const tasks = readJson(TASKS_FILE);
  const taskIndex = tasks.findIndex((task) => task.id === req.params.id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found." });
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...req.body
  };

  writeJson(TASKS_FILE, tasks);
  res.json(tasks[taskIndex]);
});

app.delete("/api/tasks/:id", (req, res) => {
  const tasks = readJson(TASKS_FILE);
  const updatedTasks = tasks.filter((task) => task.id !== req.params.id);

  if (tasks.length === updatedTasks.length) {
    return res.status(404).json({ error: "Task not found." });
  }

  writeJson(TASKS_FILE, updatedTasks);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Task Manager running at http://localhost:${PORT}`);
});
