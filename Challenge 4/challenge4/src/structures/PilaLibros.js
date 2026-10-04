class PilaLibros {
  constructor() {
    this.libros = [];
  }

  push(libro) {
    this.libros.push(libro);
  }

  pop() {
    if (this.isEmpty()) {
      return null;
    }

    return this.libros.pop();
  }

  peek() {
    if (this.isEmpty()) {
      return null;
    }

    return this.libros[this.libros.length - 1];
  }

  isEmpty() {
    return this.libros.length === 0;
  }

  size() {
    return this.libros.length;
  }

  getLibros() {
    return [...this.libros].reverse();
  }
}

export default PilaLibros;