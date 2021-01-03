import formatter from 'date-fns/format'
import nl from 'date-fns/locale/nl'

export class Uitvoering {
  constructor({ id, aanvang, deur_open, extra_text, aantal_plaatsen, vrije_plaatsen, aantalGereserveerd } = {}) {
    this.id = id;
    this.aanvang = aanvang ? new Date(aanvang) : new Date();
    this.deur_open = deur_open ? new Date(deur_open) : new Date();
    this.extra_text = extra_text || "";
    this.aantal_plaatsen = +aantal_plaatsen || 0;
    this.vrije_plaatsen = +vrije_plaatsen || 0;
    this.aantalGereserveerd = +aantalGereserveerd;
  }

  vrijePlaatsen() {
    return this.vrije_plaatsen + (this.aantalGereserveerd || 0)
  }

  get verkoopbaar() {
    return this.aanvang > new Date()
  }

  toString() {
    //return `'${this.voorstelling.title}' ${formatter(this.aanvang, "dddd D MMMM H:mm", { locale: nl })} ${this.extra_text} `;
    return `${formatter(this.aanvang, 'EEEE d MMMM HH:mm', {
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
