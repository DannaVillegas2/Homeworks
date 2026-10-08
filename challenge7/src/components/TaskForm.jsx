import { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import useTasks from "../hooks/useTasks";

const TaskForm = () => {
  const { addTask } = useTasks();
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanTitle = title.trim();

    if (!cleanTitle) {
      return;
    }

    addTask(cleanTitle);
    setTitle("");
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Escribe una nueva tarea..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Button type="submit" variant="primary">
          Agregar tarea
        </Button>
      </InputGroup>
    </Form>
  );
};

export default TaskForm;