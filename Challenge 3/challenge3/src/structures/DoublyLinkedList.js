export class PageNode {
  constructor(page) {
    this.page = page;
    this.prev = null;
    this.next = null;
  }
}

export class BrowserHistoryList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.current = null;
    this.length = 0;
  }

  addPage(page) {
    const newNode = new PageNode(page);

    if (this.head === null) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    }

    this.current = newNode;
    this.length++;
  }

  getCurrent() {
    return this.current ? this.current.page : null;
  }

  goBack() {
    if (this.current && this.current.prev) {
      this.current = this.current.prev;
    }

    return this.getCurrent();
  }

  goForward() {
    if (this.current && this.current.next) {
      this.current = this.current.next;
    }

    return this.getCurrent();
  }

  canGoBack() {
    return this.current !== null && this.current.prev !== null;
  }

  canGoForward() {
    return this.current !== null && this.current.next !== null;
  }

  getAll() {
    const pages = [];
    let currentNode = this.head;

    while (currentNode !== null) {
      pages.push(currentNode.page);
      currentNode = currentNode.next;
    }

    return pages;
  }
}