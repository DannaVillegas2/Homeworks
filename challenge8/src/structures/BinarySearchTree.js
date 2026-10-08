class Node {
  constructor(value) {
    this.value = value
    this.left = null
    this.right = null
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null
  }

  insert(value) {
    const newNode = new Node(value)

    if (this.root === null) {
      this.root = newNode
      return
    }

    let current = this.root

    while (true) {
      if (value === current.value) {
        return
      }

      if (value < current.value) {
        if (current.left === null) {
          current.left = newNode
          return
        }

        current = current.left
      } else {
        if (current.right === null) {
          current.right = newNode
          return
        }

        current = current.right
      }
    }
  }

  contains(value) {
    let current = this.root

    while (current !== null) {
      if (value === current.value) {
        return true
      }

      if (value < current.value) {
        current = current.left
      } else {
        current = current.right
      }
    }

    return false
  }

  inOrder() {
    const result = []

    const traverse = (node) => {
      if (node === null) return

      traverse(node.left)
      result.push(node.value)
      traverse(node.right)
    }

    traverse(this.root)

    return result
  }

  preOrder() {
    const result = []

    const traverse = (node) => {
      if (node === null) return

      result.push(node.value)
      traverse(node.left)
      traverse(node.right)
    }

    traverse(this.root)

    return result
  }

  postOrder() {
    const result = []

    const traverse = (node) => {
      if (node === null) return

      traverse(node.left)
      traverse(node.right)
      result.push(node.value)
    }

    traverse(this.root)

    return result
  }

  toD3Data() {
    const convertNode = (node, side = null) => {
      if (node === null) return null

      const children = []

      if (node.left) {
        children.push(convertNode(node.left, 'Izquierda'))
      }

      if (node.right) {
        children.push(convertNode(node.right, 'Derecha'))
      }

      const d3Node = {
        name: String(node.value),
      }

      if (side) {
        d3Node.attributes = {
          lado: side,
        }
      }

      if (children.length > 0) {
        d3Node.children = children
      }

      return d3Node
    }

    return this.root ? convertNode(this.root) : null
  }
}

export default BinarySearchTree