export class Payment {
  constructor(params = {}) {
    for (const key in params) {
      this[key] = params[key];
    }
    this.amount = +this.amount;
    this.amountRefunded = +this.amountRefunded;
    this.isPaid = !!this.isPaid;
    this.refundable = !!this.refundable;
    this.createdAt = this.createdAt ? new Date(this.createdAt) : null;
    this.paidAt = this.paidAt ? new Date(this.paidAt) : null;
    this.failedAt = this.failedAt ? new Date(this.failedAt) : null;
    this.refunds = this.refunds || []
  }
}
