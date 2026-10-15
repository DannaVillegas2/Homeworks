export class NaryNode {
  constructor({
    id,
    name,
    type,
    parentId = null,
    createdBy = "",
    createdAt = null,
  }) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.parentId = parentId;
    this.createdBy = createdBy;
    this.createdAt = createdAt;

    this.children = [];
  }

  isFolder() {
    return this.type === "folder";
  }

  isFile() {
    return this.type === "file";
  }

  addChild(node) {
    if (this.isFile()) {
      throw new Error("Un archivo no puede tener hijos.");
    }

    this.children.push(node);
  }
}

export class NaryTree {
  constructor() {
    this.root = new NaryNode({
      id: "root",
      name: "Mis archivos",
      type: "folder",
      parentId: null,
      createdBy: "system",
    });
  }

  findNode(id, currentNode = this.root) {
    if (currentNode.id === id) {
      return currentNode;
    }

    for (const child of currentNode.children) {
      const foundNode = this.findNode(id, child);

      if (foundNode) {
        return foundNode;
      }
    }

    return null;
  }

  addNode(parentId, node) {
    const parent = this.findNode(parentId);

    if (!parent) {
      throw new Error("La carpeta padre no existe.");
    }

    if (parent.isFile()) {
      throw new Error(
        "No se pueden agregar elementos dentro de un archivo."
      );
    }

    parent.addChild(node);
  }

  buildFromFlatNodes(nodes) {
    this.root.children = [];

    const nodeMap = new Map();

    nodes.forEach((nodeData) => {
      const node = new NaryNode(nodeData);

      nodeMap.set(node.id, node);
    });

    nodes.forEach((nodeData) => {
      const currentNode = nodeMap.get(nodeData.id);

      if (nodeData.parentId === "root" || !nodeData.parentId) {
        this.root.addChild(currentNode);
        return;
      }

      const parent = nodeMap.get(nodeData.parentId);

      if (!parent) {
        return;
      }

      if (parent.isFolder()) {
        parent.addChild(currentNode);
      }
    });

    return this;
  }

  static fromFlatNodes(nodes) {
    const tree = new NaryTree();

    return tree.buildFromFlatNodes(nodes);
  }
}