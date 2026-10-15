import { useState } from "react";

function TreeNodeView({
  node,
  selectedId,
  onSelect,
  level = 0,
}) {
  const [expanded, setExpanded] = useState(true);

  const isFolder = node.type === "folder";
  const isRoot = node.id === "root";
  const isSelected = selectedId === node.id;

  const handleNodeClick = () => {
    if (!isFolder) {
      return;
    }

    onSelect(node.id);
  };

  return (
    <div className="tree-node">
      <div
        className={`tree-row ${
          isSelected ? "tree-row-selected" : ""
        }`}
        style={{
          paddingLeft: `${level * 22 + 12}px`,
        }}
      >
        {isFolder ? (
          <button
            type="button"
            className="expand-button"
            onClick={() =>
              setExpanded((value) => !value)
            }
            aria-label={
              expanded
                ? "Contraer carpeta"
                : "Expandir carpeta"
            }
          >
            {expanded ? "▼" : "▶"}
          </button>
        ) : (
          <span className="expand-placeholder"></span>
        )}

        <button
          type="button"
          className="node-main-button"
          onClick={handleNodeClick}
          disabled={!isFolder}
        >
          <span className="node-icon">
            {isFolder ? "📁" : "📄"}
          </span>

          <span className="node-information">
            <span className="node-name">
              {node.name}
            </span>

            {!isRoot && (
              <span className="node-owner">
                Creado por: {node.createdBy}
              </span>
            )}
          </span>
        </button>

        {!isRoot && (
          <span
            className={
              isFolder
                ? "node-type node-type-folder"
                : "node-type node-type-file"
            }
          >
            {isFolder ? "Carpeta" : "Archivo"}
          </span>
        )}
      </div>

      {isFolder &&
        expanded &&
        node.children.length > 0 && (
          <div>
            {node.children.map((child) => (
              <TreeNodeView
                key={child.id}
                node={child}
                selectedId={selectedId}
                onSelect={onSelect}
                level={level + 1}
              />
            ))}
          </div>
        )}
    </div>
  );
}

export default TreeNodeView;