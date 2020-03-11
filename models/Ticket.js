import { Model } from '@vuex-orm/core'
import { Prijs } from './Prijs'

export class Ticket extends Model {
  static entity = 'ticket'

  static fields() {
    return {
      message: this.string(''),
      aantal: this.number(0),
      aantalBetaald: this.number(0),
      aantalTekoop: this.number(0),
      prijs: this.hasOne(Prijs)
    }
  }

  get betaald() {
    return this.aantalBetaald * this.prijs.prijs
  }

  get tebetalen() {
    return this.prijs.prijs * +this.aantal - +this.betaald
  }

  get newAantal() {
    return Math.max(this.aantal - this.aantalTekoop, 0)
  }

  set newAantal(value) {
    if (this.aantalTekoop) {
      this.aantalTekoop -= Math.min(value, this.aantalTekoop)
    }
    this.aantal = value + this.aantalTekoop
  }
}
