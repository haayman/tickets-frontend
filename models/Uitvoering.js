import formatter from 'date-fns/format'
import nl from 'date-fns/locale/nl'

export class Uitvoering {
  constructor({ id, aanvang, deur_open, extra_text, aantal_plaatsen, vrije_plaatsen, gereserveerd } = {}) {
    this.id = id;
    this.aanvang = aanvang ? new Date(aanvang) : new Date();
    this.deur_open = deur_open ? new Date(deur_open) : new Date();
    this.extra_text = extra_text || "";
    this.aantal_plaatsen = +aantal_plaatsen || 0;
    this.vrije_plaatsen = +vrije_plaatsen || 0;
    this.gereserveerd = +gereserveerd;
  }

  get verkoopbaar() {
    return this.aanvang > new Date()
  }

  toString() {
    return `${formatter(this.aanvang, 'PPPPp', {
      locale: nl
    })} ${this.extra_text} `
  }

  serialize() {
    return {
      id: this.id,
      aanvang: this.aanvang,
      deur_open: this.deur_open,
      aantal_plaatsen: this.aantal_plaatsen,
      extra_text: this.extra_text
    }
  }
}
