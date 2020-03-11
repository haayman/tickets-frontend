import { Model } from '@vuex-orm/core'
import { Ticket } from './Ticket'
import { Uitvoering } from './Uitvoering'
import { Payment } from './Payment'
import { Log } from './Log'

export class Reservering extends Model {
  static entity = 'reservering'

  static fields() {
    return {
      id: this.attr(null),
      naam: this.string(''),
      email: this.string(''),
      wachtlijst: this.boolean(false),
      opmerking: this.string('').nullable(),
      opmerking_gebruiker: this.string('').nullable(),
      ingenomen: this.string(null).nullable(),
      betaald: this.boolean(false), // wordt alleen door de kassa gezet
      uitvoering: this.hasOne(Uitvoering, 'uitvoeringId'),
      tickets: this.hasMany(Ticket, 'reserveringId'),
      payments: this.hasMany(Payment, 'reserveringId'),
      logs: this.hasMany(Log, 'reserveringId')
    }
  }
}
