import { Model } from "@vuex-orm/core";
import { Uitvoering } from "./Uitvoering";
import { Prijs } from "./Prijs";

export class Voorstelling extends Model {
  static entity = "voorstelling";

  static fields() {
    return {
      id: this.attr(null),
      title: this.string(""),
      description: this.string(""),
      active: this.boolean(true),
      url: this.string("").nullable(),
      locatie: this.string("").nullable(),
      url: this.string("").nullable(),
      locatie: this.string("").nullable(),
      opmerkingen: this.string("").nullable(),
      poster: this.string("").nullable(),
      thumbnail: this.string("").nullable(),
      uitvoeringen: this.hasMany(Uitvoering, "voorstellingId"),
      prijzen: this.hasMany(Prijs, "voorstellingId")
    };
  }

}
