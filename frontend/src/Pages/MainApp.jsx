import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import LogoutButton from "../Components/LogoutButton";

function MainApp() {
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedDueDate, setSelectedDueDate] = useState("");
  const [value, setValue] = useState("");
  const [newEditingTask, setNewEditingTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [newDueDate, setNewDueDate] = useState("");

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
      fetchTasks(storedUserId);
    }
  }, []);

  const fetchTasks = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3001/tasks/${userId}`);
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
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async () => {
    try {
      if (newTask === "" || dueDate === "") {
        alert("Empty Title or Date");
      } else {
        await axios.post("http://localhost:3001/tasks", {
          task_name: newTask,
          due_date: dueDate,
          user_id: userId,
        });
        setNewTask("");
        setDueDate("");
        fetchTasks(userId);
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const deleteTask = async (taskId, userId) => {
    try {
      await axios.delete(`http://localhost:3001/tasks/${userId}/${taskId}`);
      fetchTasks(userId);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const dueToday = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/tasks/${userId}/due-today`
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
      setValue("");
    } catch (error) {
      console.error("Error fetching tasks due today:", error);
    }
  };

  const editTask = (taskId) => {
    setEditingTaskId(taskId);
  };

  const saveEditedTaskName = async (userId, taskId, newTaskName) => {
    try {
      await axios.put(`http://localhost:3001/tasks/${userId}/${taskId}`, {
        task_name: newTaskName,
      });
      setEditingTaskId(null);
      fetchTasks(userId);
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  const saveEditedTaskDate = async (userId, taskId, newDueDate) => {
    try {
      await axios.put(
        `http://localhost:3001/tasks/${userId}/${taskId}/due-date`,
        {
          due_date: newDueDate,
        }
      );
      setEditingTaskId(null);
      fetchTasks(userId);
    } catch (error) {
      console.error("Error editing task due date:", error);
    }
  };

  const dueOnDate = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/tasks/${userId}/due-date/${selectedDueDate}`
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
      setSelectedDueDate("");
    } catch (error) {
      console.error("Error fetching tasks by due date:", error);
    }
  };

  const search = async (userId, value) => {
    if (value === "") {
      alert("Empty Search Query");
    } else {
      try {
        const response = await axios.get(
          `http://localhost:3001/tasks/${userId}/${value}`
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
        setValue("");
      } catch (error) {
        console.error("Error fetching tasks by due date:", error);
      }
    }
  };

  return (
    <>
      <header>
        <span>ToDos List</span>
        <LogoutButton />
      </header>
      <div className='searchArea'>
        <input
          type='text'
          placeholder='Search Tasks'
          className='search'
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button onClick={() => search(userId, value)}>Search</button>
      </div>
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

      {tasks.length === 0 ? (
        <h2>No Task Due</h2>
      ) : (
        <>
          <div className='tasks-buttons'>
            <button onClick={() => fetchTasks(userId)} className='add-button'>
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
                <tr key={task.id}>
                  <td>
                    {editingTaskId === task.id ? (
                      <input
                        type='text'
                        value={newEditingTask}
                        onChange={(e) => setNewEditingTask(e.target.value)}
                      />
                    ) : (
                      task.task_name
                    )}
                  </td>
                  <td>
                    {editingTaskId === task.id ? (
                      <input
                        type='date'
                        value={newDueDate}
                        onChange={(e) => setNewDueDate(e.target.value)}
                      />
                    ) : (
                      task.due_date
                    )}
                  </td>
                  <td>
                    {editingTaskId === task.id ? (
                      <>
                        <button
                          onClick={() =>
                            saveEditedTaskName(userId, task.id, newEditingTask)
                          }
                          className='edit-button'
                        >
                          Save Name
                        </button>
                        <button
                          onClick={() =>
                            saveEditedTaskDate(userId, task.id, newDueDate)
                          }
                          className='edit-button'
                        >
                          Save Date
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => editTask(task.id)}
                          className='edit-button'
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTask(task.id, task.user_id)}
                          className='delete-button'
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
}

export default MainApp;
