import { Role } from "./Role";

export class User {
  constructor({ id, username, name, role, email, password } = {}) {
    this.id = id;
    this.username = username;
    this.name = name;
    this.email = email;
    this.role = role || "speler";
    this.password = password;
  }

  isAdministrator() {
    return this.role === "admin";
  }

  isSpeler() {
    return this.role === "speler" || this.isAdministrator();
  }

  isKassa() {
    return this.role === "kassa";
  }

  isAuthorised(authorizationRequired) {
    switch (authorizationRequired) {
      case true:
        return true;
      case "admin":
      case Role.ADMINISTRATOR:
        return this.isAdministrator();
      case "speler":
      case Role.SPELER:
        return this.isSpeler();
      case "kassa":
      case Role.KASSA:
        return this.isKassa();
    }
  }
}
