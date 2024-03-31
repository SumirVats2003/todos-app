import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function MainApp() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedDueDate, setSelectedDueDate] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await axios.get("http://localhost:3001/tasks");
    const formattedTasks = response.data.map((task) => {
      return {
        ...task,
        due_date: new Date(task.due_date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      };
    });
    setTasks(formattedTasks);
  };

  const addTask = async () => {
    await axios.post("http://localhost:3001/tasks", {
      task_name: newTask,
      due_date: dueDate,
    });
    setNewTask("");
    setDueDate("");
    fetchTasks();
  };

  const deleteTask = async (taskId) => {
    await axios.delete(`http://localhost:3001/tasks/${taskId}`);
    fetchTasks();
  };

  const dueToday = async () => {
    try {
      const response = await axios.get("http://localhost:3001/tasks/due-today");
      const formattedTasks = response.data.map((task) => {
        return {
          ...task,
          due_date: new Date(task.due_date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
        };
      });
      setTasks(formattedTasks);
    } catch (error) {
      console.error("Error fetching tasks due today:", error);
    }
  };

  const dueOnDate = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/tasks/due-date/${selectedDueDate}`
      );
      const formattedTasks = response.data.map((task) => {
        return {
          ...task,
          due_date: new Date(task.due_date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
        };
      });
      setTasks(formattedTasks);
    } catch (error) {
      console.error("Error fetching tasks by due date:", error);
    }
  };

  return (
    <>
      <div className='form-container'>
        <input
          type='text'
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder='Enter task'
          className='input-text'
        />
        <input
          type='date'
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className='input-date'
        />
        <button onClick={addTask} className='add-button'>
          Add Task
        </button>
      </div>
      <div className='tasks-buttons'>
        <button onClick={fetchTasks} className='add-button'>
          All Tasks
        </button>
        <button onClick={dueToday} className='add-button'>
          Due Today
        </button>
        <div>
          <input
            type='date'
            value={selectedDueDate}
            onChange={(e) => setSelectedDueDate(e.target.value)}
            className='input-date'
          />
          <button onClick={dueOnDate} className='add-button'>
            Select by due date
          </button>
        </div>
      </div>
      <table className='tasks-table'>
        <thead>
          <tr>
            <th className='table-header'>Task Name</th>
            <th className='table-header'>Due Date</th>
            <th className='table-header'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.task_id}>
              <td>{task.task_name}</td>
              <td>{task.due_date}</td>
              <td>
                <button
                  onClick={() => deleteTask(task.task_id)}
                  className='delete-button'
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default MainApp;
