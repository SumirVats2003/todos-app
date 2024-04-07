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

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  const query = `INSERT INTO users (username, password) VALUES (?, ?)`;
  db.query(query, [username, password], (err, result) => {
    if (err) {
      console.error("Error registering user:", err);
      res
        .status(500)
        .json({ error: "An error occurred while registering user" });
    } else {
      res.status(200).json({ message: "User registered successfully" });
    }
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
  db.query(query, [username, password], (err, result) => {
    if (err) {
      console.error("Error logging in:", err);
      res.status(500).json({ error: "An error occurred while logging in" });
    } else {
      if (result.length > 0) {
        res
          .status(200)
          .json({ message: "Login successful", userId: result[0].id });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    }
  });
});

app.get("/tasks/:userId", (req, res) => {
  const { userId } = req.params;
  const query = `SELECT * FROM tasks WHERE user_id = ?`;
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Error fetching tasks:", err);
      res.status(500).json({ error: "An error occurred while fetching tasks" });
    } else {
      res.status(200).json(result);
    }
  });
});

app.post("/tasks", (req, res) => {
  const { task_name, due_date, user_id } = req.body;
  const query = `INSERT INTO tasks (task_name, due_date, user_id) VALUES (?, ?, ?)`;
  db.query(query, [task_name, due_date, user_id], (err, result) => {
    if (err) {
      console.error("Error adding task:", err);
      res.status(500).json({ error: "An error occurred while adding task" });
    } else {
      res.status(200).json({ message: "Task added successfully" });
    }
  });
});

app.get("/tasks/:userId/due-today", (req, res) => {
  const { userId } = req.params;
  const today = new Date().toISOString().split("T")[0];
  const query = `SELECT * FROM tasks WHERE due_date = ? AND user_id = ?`;
  db.query(query, [today, userId], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.get("/tasks/:userId/due-date/:date", (req, res) => {
  const { userId, date } = req.params;
  const query = `SELECT * FROM tasks WHERE due_date = ? AND user_id = ?`;
  db.query(query, [date, userId], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.delete("/tasks/:userId/:taskId", (req, res) => {
  const { userId, taskId } = req.params;
  const query = `DELETE FROM tasks WHERE task_id = ? AND user_id = ?`;
  db.query(query, [taskId, userId], (err, result) => {
    if (err) {
      console.error("Error deleting task:", err);
      res.status(500).json({ error: "An error occurred while deleting task" });
    } else {
      res.status(200).json({ message: "Task deleted successfully" });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
