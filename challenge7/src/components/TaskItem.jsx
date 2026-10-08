import { useState } from "react";
import {
  Button,
  Form,
  ListGroup,
} from "react-bootstrap";
import useTasks from "../hooks/useTasks";

const TaskItem = ({ task }) => {
  const {
    deleteTask,
    toggleTask,
    editTask,
  } = useTasks();

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const handleSave = () => {
    const cleanTitle = editedTitle.trim();

    if (!cleanTitle) {
      return;
    }

    editTask(task.id, cleanTitle);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(task.title);
    setIsEditing(false);
  };

  return (
    <ListGroup.Item className="task-item">
      <div className="d-flex align-items-center gap-3">
        <Form.Check
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleTask(task.id)}
        />

        {isEditing ? (
          <Form.Control
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
        ) : (
          <span
            className={
              task.completed
                ? "task-title task-completed"
                : "task-title"
            }
          >
            {task.title}
          </span>
        )}

        <div className="ms-auto d-flex gap-2">
          {isEditing ? (
            <>
              <Button
                size="sm"
                variant="success"
                onClick={handleSave}
              >
                Guardar
              </Button>

              <Button
                size="sm"
                variant="secondary"
                onClick={handleCancel}
              >
                Cancelar
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="warning"
                onClick={() => setIsEditing(true)}
              >
                Editar
              </Button>

              <Button
                size="sm"
                variant="danger"
                onClick={() => deleteTask(task.id)}
              >
                Eliminar
              </Button>
            </>
          )}
        </div>
      </div>
    </ListGroup.Item>
  );
};

export default TaskItem;