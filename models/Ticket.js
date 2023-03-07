import { Prijs } from "./Prijs";

export class Ticket {
  constructor({ message = null, aantal = 0, aantalBetaald = 0, aantalTekoop = 0, prijs } = {}) {
    this.message = message;
    this.aantal = +aantal;
    this.aantalBetaald = aantalBetaald;
    this.aantalTekoop = aantalTekoop;
    this.prijs = new Prijs(prijs);
  }

  get betaald() {
    return this.aantalBetaald * this.prijs.prijs;
  }

  get tebetalen() {
    return this.prijs.prijs * +this.aantal - +this.betaald;
  }

  get newAantal() {
    return Math.max(this.aantal - this.aantalTekoop, 0);
  }

  set newAantal(value) {
    if (this.aantalTekoop) {
      this.aantalTekoop -= Math.min(value, this.aantalTekoop);
    }
    this.aantal = value + this.aantalTekoop;
  }

  toString() {
    const aantal = +this.aantal;
    const totaal = aantal * this.prijs.prijs;

    let retval = `${aantal} x ${this.prijs}: €${totaal.toFixed(2)}`;
    if (this.aantalTekoop) {
      retval += ` waarvan ${this.aantalTekoop} te koop`;
    }
    if (this.aantalTerugbetalen) {
      retval += ` ${this.aantalTekoop ? "en" : "waarvan"} ${
        this.aantalTerugbetalen
      } wacht op terugbetaling`;
    }
    return retval;
  }

  serialize() {
    return {
      prijs: { id: this.prijs.id },
      aantal: this.aantal,
    };
  }
}
