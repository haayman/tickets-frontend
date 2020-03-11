import { Model } from '@vuex-orm/core'

export class Payment extends Model {
  static entity = 'payment'

  static fields() {
    return {
      id: this.attr(null),
      message: this.string(''),
      amount: this.number(0),
      createdAt: this.date(null),
      paidAt: this.date(null),
      failedAt: this.date(null),
      refunds: null
    }
  }
}
