import {
  Button,
  Card,
  Container,
  Navbar,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import useTasks from "../hooks/useTasks";

import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

const TasksPage = () => {
  const { user, logout } = useAuth();
  const { tasks } = useTasks();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand>
            Challenge 7 - Tareas
          </Navbar.Brand>

          <div className="d-flex align-items-center gap-3">
            <span className="text-white">
              {user?.email}
            </span>

            <Button
              variant="outline-light"
              onClick={handleLogout}
            >
              Cerrar sesión
            </Button>
          </div>
        </Container>
      </Navbar>

      <Container className="tasks-container">
        <Card className="shadow">
          <Card.Body>
            <h1 className="mb-2">Mis tareas</h1>

            <p className="text-muted">
              Bienvenido, {user?.email}
            </p>

            <div className="task-summary mb-4">
              <span>
                Total: <strong>{tasks.length}</strong>
              </span>

              <span>
                Completadas:{" "}
                <strong>{completedTasks}</strong>
              </span>

              <span>
                Pendientes:{" "}
                <strong>
                  {tasks.length - completedTasks}
                </strong>
              </span>
            </div>

            <TaskForm />

            <TaskList />
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default TasksPage;