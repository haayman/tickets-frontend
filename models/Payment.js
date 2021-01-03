export class Payment {
  constructor({ id, message, amount, createdAt, paidAt, failedAt, refunds } = {}) {
    this.id = id;
    this.message = message;
    this.amount = + amount;
    this.createdAt = createdAt ? new Date(createdAt) : null;
    this.paidAt = paidAt ? new Date(paidAt) : null;
    this.failedAt = failedAt ? new Date(failedAt) : null;
    this.refunds = refunds || []
  }
}
