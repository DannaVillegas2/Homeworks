import { createContext, useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (user) {
      const savedTasks = localStorage.getItem(`tasks-${user.uid}`);

      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      } else {
        setTasks([]);
      }
    } else {
      setTasks([]);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        `tasks-${user.uid}`,
        JSON.stringify(tasks)
      );
    }
  }, [tasks, user]);

  const addTask = (title) => {
    const newTask = {
      id: Date.now(),
      title,
      completed: false,
    };

    setTasks((prevTasks) => [
      ...prevTasks,
      newTask,
    ]);
  };

  const deleteTask = (id) => {
    setTasks((prevTasks) =>
      prevTasks.filter((task) => task.id !== id)
    );
  };

  const toggleTask = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
            }
          : task
      )
    );
  };

  const editTask = (id, newTitle) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              title: newTitle,
            }
          : task
      )
    );
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        deleteTask,
        toggleTask,
        editTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};