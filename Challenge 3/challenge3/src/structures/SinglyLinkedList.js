export class SongNode {
  constructor(song) {
    this.song = song;
    this.next = null;
  }
}

export class SongLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.current = null;
    this.length = 0;
  }

  add(song) {
    const newNode = new SongNode(song);

    if (this.head === null) {
      this.head = newNode;
      this.tail = newNode;
      this.current = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }

    this.length++;
  }

  getCurrent() {
    return this.current ? this.current.song : null;
  }

  next() {
    if (this.current && this.current.next) {
      this.current = this.current.next;
    }

    return this.getCurrent();
  }

  restart() {
    this.current = this.head;
    return this.getCurrent();
  }

  hasNext() {
    return this.current !== null && this.current.next !== null;
  }

  getAll() {
    const songs = [];
    let currentNode = this.head;

    while (currentNode !== null) {
      songs.push(currentNode.song);
      currentNode = currentNode.next;
    }

    return songs;
  }
}