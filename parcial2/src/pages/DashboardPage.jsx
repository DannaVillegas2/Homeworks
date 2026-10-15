import { useEffect, useMemo, useState } from "react";

import TreeNodeView from "../components/TreeNodeView";
import { useAuth } from "../hooks/useAuth";
import {
  createTreeNode,
  subscribeToTreeNodes,
} from "../services/treeService";
import { NaryTree } from "../structures/NaryTree";

function DashboardPage() {
  const { user, logout } = useAuth();

  const [tree, setTree] = useState(() => new NaryTree());

  const [selectedId, setSelectedId] = useState("root");

  const [name, setName] = useState("");
  const [type, setType] = useState("folder");

  const [loadingTree, setLoadingTree] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToTreeNodes(
      (nodes) => {
        const newTree = NaryTree.fromFlatNodes(nodes);

        setTree(newTree);

        setSelectedId((currentSelectedId) => {
          const selectedNode = newTree.findNode(currentSelectedId);

          if (!selectedNode || selectedNode.type !== "folder") {
            return "root";
          }

          return currentSelectedId;
        });

        setLoadingTree(false);
      },
      () => {
        setError(
          "No fue posible consultar la información de Firestore."
        );
        setLoadingTree(false);
      }
    );

    return unsubscribe;
  }, []);

  const selectedFolder = useMemo(() => {
    return tree.findNode(selectedId) ?? tree.root;
  }, [tree, selectedId]);

  const totalNodes = useMemo(() => {
    const countNodes = (node) => {
      return (
        (node.id === "root" ? 0 : 1) +
        node.children.reduce(
          (total, child) => total + countNodes(child),
          0
        )
      );
    };

    return countNodes(tree.root);
  }, [tree]);

  const handleCreate = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanName = name.trim();

    if (!cleanName) {
      setError("Escribe un nombre para el elemento.");
      return;
    }

    if (!selectedFolder || selectedFolder.type !== "folder") {
      setError("Debes seleccionar una carpeta válida.");
      return;
    }

    try {
      setSaving(true);

      await createTreeNode({
        name: cleanName,
        type,
        parentId: selectedFolder.id,
        createdBy: user.email,
      });

      setName("");

      setSuccess(
        type === "folder"
          ? "Carpeta creada correctamente."
          : "Archivo creado correctamente."
      );
    } catch (creationError) {
      setError(
        creationError.message ||
          "No fue posible crear el elemento."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      setError("No fue posible cerrar la sesión.");
    }
  };

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div className="brand">
          <div className="brand-icon">FS</div>

          <div>
            <h1>File Structure</h1>
            <p>Administrador de archivos con árbol N-ario</p>
          </div>
        </div>

        <div className="user-area">
          <div className="user-data">
            <span className="user-label">
              Sesión iniciada
            </span>

            <strong>{user?.email}</strong>
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <section className="dashboard-content">
        <aside className="sidebar">
          <div className="sidebar-header">
            <div>
              <span className="section-overline">
                EXPLORADOR
              </span>

              <h2>Mi estructura</h2>
            </div>

            <span className="counter">{totalNodes}</span>
          </div>

          <p className="sidebar-description">
            Selecciona una carpeta para agregar elementos
            dentro de ella.
          </p>

          <div className="tree-container">
            {loadingTree ? (
              <div className="tree-empty">
                Cargando estructura...
              </div>
            ) : (
              <TreeNodeView
                node={tree.root}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            )}
          </div>
        </aside>

        <section className="workspace">
          <div className="workspace-header">
            <div>
              <span className="section-overline">
                CARPETA SELECCIONADA
              </span>

              <h2>{selectedFolder?.name}</h2>

              <p>
                Los nuevos elementos se guardarán dentro
                de esta carpeta.
              </p>
            </div>

            <div className="folder-badge">
              Carpeta
            </div>
          </div>

          <div className="workspace-grid">
            <section className="create-card">
              <span className="section-overline">
                NUEVO ELEMENTO
              </span>

              <h3>Crear archivo o carpeta</h3>

              <form
                className="create-form"
                onSubmit={handleCreate}
              >
                <label>
                  Nombre

                  <input
                    type="text"
                    placeholder="Ej: Documentos"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    maxLength={60}
                  />
                </label>

                <div className="type-selector">
                  <button
                    type="button"
                    className={`type-option ${
                      type === "folder"
                        ? "type-option-selected"
                        : ""
                    }`}
                    onClick={() => setType("folder")}
                  >
                    <span className="type-icon">📁</span>

                    <span>
                      <strong>Carpeta</strong>
                      <small>Puede tener hijos</small>
                    </span>
                  </button>

                  <button
                    type="button"
                    className={`type-option ${
                      type === "file"
                        ? "type-option-selected"
                        : ""
                    }`}
                    onClick={() => setType("file")}
                  >
                    <span className="type-icon">📄</span>

                    <span>
                      <strong>Archivo</strong>
                      <small>No puede tener hijos</small>
                    </span>
                  </button>
                </div>

                {error && (
                  <div className="alert alert-error">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="alert alert-success">
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  className="primary-button"
                  disabled={saving}
                >
                  {saving
                    ? "Guardando..."
                    : `Crear ${
                        type === "folder"
                          ? "carpeta"
                          : "archivo"
                      }`}
                </button>
              </form>
            </section>

            <section className="info-card">
              <span className="section-overline">
                INFORMACIÓN
              </span>

              <h3>Reglas de la estructura</h3>

              <div className="rule">
                <div className="rule-number">01</div>

                <div>
                  <strong>Árbol N-ario</strong>

                  <p>
                    Cada carpeta puede almacenar una cantidad
                    variable de hijos.
                  </p>
                </div>
              </div>

              <div className="rule">
                <div className="rule-number">02</div>

                <div>
                  <strong>Restricción de archivos</strong>

                  <p>
                    Los archivos son nodos hoja y nunca pueden
                    contener otros nodos.
                  </p>
                </div>
              </div>

              <div className="rule">
                <div className="rule-number">03</div>

                <div>
                  <strong>Persistencia</strong>

                  <p>
                    Cada nodo se almacena en Firestore junto
                    con su relación jerárquica.
                  </p>
                </div>
              </div>

              <div className="rule">
                <div className="rule-number">04</div>

                <div>
                  <strong>Autor identificado</strong>

                  <p>
                    Cada elemento registra el correo del usuario
                    que lo creó.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </section>
      </section>
    </main>
  );
}

export default DashboardPage;