import { Model } from '@vuex-orm/core'

export class Prijs extends Model {
  static entity = 'prijs'

  static fields() {
    return {
      id: this.attr(null),
      description: this.string(''),
      prijs: this.number(0)
    }
  }
}
