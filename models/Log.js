export class Log {
  constructor({ id, message, created_at }) {
    this.id = id;
    this.message = message;
    this.created_at = new Date(created_at)
  }

  toString() {
    return `${this.created_at} ${this.message})`
  }
}
