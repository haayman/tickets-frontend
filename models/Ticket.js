import { Prijs } from './Prijs'

export class Ticket {
  constructor({ message = null, aantal = 0, aantalBetaald = 0, aantalTekoop = 0, prijs } = {}) {
    this._prijs = null;

    this.message = message;
    this.aantal = +aantal;
    this.aantalBetaald = aantalBetaald;
    this.aantalTekoop = aantalTekoop;
    this.prijs = prijs;

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

  serialize() {
    return {
      prijs: { id: this.prijs.id },
      aantal: this.aantal
    }
  }
}
