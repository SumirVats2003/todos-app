import express from "express";
import mysql from "mysql";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "todos-app",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database");
});

app.post("/tasks", (req, res) => {
  const { task_name, due_date } = req.body;
  const query = `INSERT INTO tasks (task_name, due_date) VALUES (?, ?)`;
  db.query(query, [task_name, due_date], (err, result) => {
    if (err) throw err;
    res.send("Task created successfully");
  });
});

app.get("/tasks", (req, res) => {
  const query = `SELECT * FROM tasks`;
  db.query(query, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.get("/tasks/due-today", (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  const query = `SELECT * FROM tasks WHERE due_date = ?`;
  db.query(query, [today], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.get("/tasks/due-date/:date", (req, res) => {
  const { date } = req.params;
  const query = `SELECT * FROM tasks WHERE due_date = ?`;
  db.query(query, [date], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.delete("/tasks/:task", (req, res) => {
  const { task } = req.params;
  const query = `DELETE FROM tasks WHERE task_id = ${task}`;
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error deleting task:", err);
      res
        .status(500)
        .json({ error: "An error occurred while deleting the task" });
    } else {
      res.json({ message: "Task deleted successfully" });
    }
  });
});

const users = [
  { username: "user1", password: "password1", id: 1 },
  { username: "user2", password: "password2", id: 2 },
];

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    // In a real application, you'd generate and send a JWT token here
    res.json({ token: "dummytoken" });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
