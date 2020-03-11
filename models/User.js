import { Model } from '@vuex-orm/core'
import { Role } from './Role'

export class User extends Model {
  static entity = 'user'

  static fields() {
    return {
      id: this.attr(null),
      username: this.attr(''),
      name: this.attr(''),
      role: this.attr(null),
      email: this.attr(''),
      password: this.attr('')
    }
  }

  static apiConfig = {
    actions: {
      fetchById(id) {
        return this.get(`/api/user/${id}/`)
      },
      fetch: {
        method: 'get',
        url: '/api/user'
      }
    }
  }

  isAdministrator() {
    return this.role === 'admin'
  }

  isSpeler() {
    return this.role === 'speler' || this.isAdministrator()
  }

  isKassa() {
    return this.role === 'kassa'
  }

  isAuthorised(authorizationRequired) {
    switch (authorizationRequired) {
      case true:
        return true
      case 'admin':
      case Role.ADMINISTRATOR:
        return this.isAdministrator()
      case 'speler':
      case Role.SPELER:
        return this.isSpeler()
      case 'kassa':
      case Role.KASSA:
        return this.isKassa()
    }
  }
}
