import { Model } from '@vuex-orm/core'
import formatter from 'date-fns/format'
import nl from 'date-fns/locale/nl'

export class Uitvoering extends Model {
  static entity = 'uitvoering'

  static fields() {
    return {
      id: this.attr(null),
      aanvang: this.date(null),
      deur_open: this.date(null),
      extra_text: this.string('').nullable(),
      aantal_plaatsen: this.number(null)
    }
  }

  vrijePlaatsen() {
    return this.vrije_plaatsen + (this.aantalGereserveerd || 0)
  }

  get verkoopbaar() {
    return this.aanvang > today
  }

  toString() {
    //return `'${this.voorstelling.title}' ${formatter(this.aanvang, "dddd D MMMM H:mm", { locale: nl })} ${this.extra_text} `;
    return `${formatter(this.aanvang, 'EEEE d MMMM HH:mm', {
      locale: nl
    })} ${this.extra_text} `
  }
}
