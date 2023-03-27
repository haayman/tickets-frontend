/* eslint-disable camelcase */
import { format } from "date-fns";
// eslint-disable-next-line import/no-duplicates
import nl from "date-fns/locale/nl";
import { IVoorstelling, Voorstelling } from "./Voorstelling";

export type IUitvoering = {
  id?: number;
  aanvang?: string | Date;
  deur_open?: string | Date;
  extra_text?: string;
  aantal_plaatsen?: string | number;
  vrije_plaatsen?: string | number;
  gereserveerd?: string | number;
  wachtlijst?: string | number;
  te_koop?: string | number;
  voorstelling?: number | IVoorstelling | Voorstelling;
};

export class Uitvoering {
  id?: number;
  aanvang: Date;
  deur_open: Date;
  extra_text: string;
  aantal_plaatsen: number;
  vrije_plaatsen: number;
  gereserveerd: number;
  wachtlijst: number;
  te_koop: number;
  voorstelling: number | Voorstelling;

  constructor({
    id,
    aanvang,
    deur_open,
    extra_text,
    aantal_plaatsen,
    vrije_plaatsen,
    gereserveerd,
    wachtlijst,
    te_koop,
    voorstelling,
  }: IUitvoering = {}) {
    this.id = id;
    this.aanvang = aanvang ? new Date(aanvang) : new Date();
    this.deur_open = deur_open ? new Date(deur_open) : new Date();
    this.extra_text = extra_text || "";
    this.aantal_plaatsen = +(aantal_plaatsen || 0);
    this.vrije_plaatsen = +(vrije_plaatsen || 0);
    this.gereserveerd = +(gereserveerd || 0);
    this.wachtlijst = +(wachtlijst || 0);
    this.te_koop = +(te_koop || 0);
    if (voorstelling instanceof Voorstelling) {
      this.voorstelling = voorstelling;
    } else {
      this.voorstelling =
        typeof voorstelling === "number" ? voorstelling : new Voorstelling(voorstelling);
    }
  }

  get verkoopbaar() {
    return this.aanvang > new Date();
  }

  toString() {
    return `${format(this.aanvang, "PPPPp", {
      locale: nl,
    })} ${this.extra_text} `;
  }

  serialize() {
    return {
      id: this.id,
      aanvang: this.aanvang,
      deur_open: this.deur_open,
      aantal_plaatsen: this.aantal_plaatsen,
      extra_text: this.extra_text,
    };
  }
}

export type ExistingUitvoering = Uitvoering & { id: number };
