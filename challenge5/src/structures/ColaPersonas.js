class ColaPersonas {
  constructor(personas = []) {
    this.items = [...personas];
    this.ordenarPorLlegada();
  }

  enqueue(persona) {
    this.items.push(persona);
    this.ordenarPorLlegada();
  }

  dequeue() {
    if (this.isEmpty()) {
      return null;
    }

    return this.items.shift();
  }

  front() {
    if (this.isEmpty()) {
      return null;
    }

    return this.items[0];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  getItems() {
    return [...this.items];
  }

  ordenarPorLlegada() {
    this.items.sort(
      (a, b) => new Date(a.fechaLlegada) - new Date(b.fechaLlegada)
    );
  }
}

export default ColaPersonas;