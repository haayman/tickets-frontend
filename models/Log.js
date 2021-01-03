export class Log {
  constructor({ id, message, createdAt }) {
    this.id = id;
    this.message = message;
    this.createdAt = new Date(createdAt)
  }

  toString() {
    return `${this.createdAt} ${this.message})`
  }
}
