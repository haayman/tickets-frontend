import { Model } from '@vuex-orm/core'

export class Log extends Model {
  static entity = 'log'

  static fields() {
    return {
      id: this.attr(null),
      message: this.string(''),
      createdAt: this.date(null)
    }
  }

  toString() {
    return `${this.createdAt} ${this.message})`
  }
}
