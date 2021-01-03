import { Prijs } from './Prijs'

export class Ticket {
  constructor({ message, aantal, aantalBetaald, aantalTekoop, prijs } = {}) {
    this.message = message;
    this.aantal = +aantal;
    this.aantalBetaald = aantalBetaald;
    this.aantalTekoop = aantalTekoop;
    this.prijs = prijs;

    this._prijs = null;
  }

  get prijs() {
    return this._prijs;
  }
  set prijs(prijs) {
    this._prijs = new Prijs(prijs);
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
