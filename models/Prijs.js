export class Prijs {
  constructor({ id, description, prijs, role } = {}) {
    if (id) {
      this.id = id;
    }
    this.description = description || "";
    this.prijs = +prijs || 0;
    this.role = role || null;
  }
}
