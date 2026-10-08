import { Alert, ListGroup } from "react-bootstrap";
import useTasks from "../hooks/useTasks";
import TaskItem from "./TaskItem";

const TaskList = () => {
  const { tasks } = useTasks();

  if (tasks.length === 0) {
    return (
      <Alert variant="info">
        Todavía no tienes tareas. Agrega la primera.
      </Alert>
    );
  }

  return (
    <ListGroup>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
        />
      ))}
    </ListGroup>
  );
};

export default TaskList;