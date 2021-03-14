import { Ticket } from './Ticket'
import { Uitvoering } from './Uitvoering'
import { Payment } from './Payment'
import { Log } from './Log'

export class Reservering {
  constructor({ id,
    naam, email, wachtlijst, opmerking, opmerking_gebruiker,
    ingenomen, betaald, uitvoering, tickets, payments, logs, teruggeefbaar } = {}) {

    this.id = id || null;
    this.naam = naam;
    this.email = email;
    this.wachtlijst = !!wachtlijst;
    this.opmerking = opmerking || "";
    this.opmerking_gebruiker = opmerking_gebruiker || "";
    this.ingenomen = ingenomen;
    this.betaald = !!betaald;
    this.uitvoeringId = uitvoering?.id;
    this.teruggeefbaar = !!teruggeefbaar;

    this.uitvoering = new Uitvoering(uitvoering);
    this.tickets = tickets?.map(t => new Ticket(t)) || [];
    this.payments = payments?.map(p => new Payment(p)) || [];
    this.logs = logs?.map(l => new Log(l)) || [];

  }

  async save($axios) {
    if (this.id) {
      await $axios.put(`/reservering/${this.id}`, this.serialize());
    } else {
      const { data } = await $axios.post("/reservering", this.serialize());
      this.id = data.id;
    }
  }

  async delete($axios) {
    if (this.id) {
      await $axios.delete(`/reservering/${this.id}`);
    }
  }

  serialize() {
    return {
      ... this.id ? { id: this.id } : {},
      naam: this.naam,
      email: this.email,
      uitvoeringId: this.uitvoeringId || this.uitvoering.id,
      tickets: this.tickets.map(t => t.serialize()),
      opmerking: this.opmerking,
      opmerking_gebruiker: this.opmerking_gebruiker,
      wachtlijst: this.wachtlijst
    }
  }

}
