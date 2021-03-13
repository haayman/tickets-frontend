import { Uitvoering } from "./Uitvoering";
import { Prijs } from "./Prijs";

export class Voorstelling {
  constructor({ id, title, description, active, url, locatie, opmerkingen, poster, thumbnail, uitvoeringen, prijzen } = {}) {
    if (id) {
      this.id = id;
    }
    this.title = title;
    this.description = description;
    this.active = active;
    this.url = url;
    this.locatie = locatie;
    this.opmerkingen = opmerkingen;
    this.poster = poster;
    this.thumbnail = thumbnail;
    this.uitvoeringen = uitvoeringen?.map(u => new Uitvoering(u)) || [];
    this.prijzen = prijzen?.map(p => new Prijs(p)) || [];

  }

  serialize() {
    return {
      ... this.id ? { id: this.id } : {},
      title: this.title,
      description: this.description,
      active: this.active,
      url: this.url,
      locatie: this.locatie,
      opmerkingen: this.opmerkingen,
      poster: this.poster,
      thumbnail: this.thumbnail,
      uitvoeringen: this.uitvoeringen.map(u => u.serialize()),
      prijzen: this.prijzen
    }
  }

}
