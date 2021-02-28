import { Ticket } from './Ticket'
import { Uitvoering } from './Uitvoering'
import { Payment } from './Payment'
import { Log } from './Log'

export class Reservering {
  constructor({ id,
    naam, email, wachtlijst, opmerking, opmerking_gebruiker,
    ingenomen, betaald, uitvoering, tickets, payments, logs } = {}) {

    this._uitvoering = null;
    this._tickets = [];
    this._payments = [];
    this._logs = [];

    this.naam = naam;
    this.email = email;
    this.wachtlijst = !!wachtlijst;
    this.opmerking = opmerking;
    this.opmerking_gebruiker = opmerking_gebruiker;
    this.ingenomen = ingenomen;
    this.betaald = !!betaald;
    this.uitvoering = uitvoering;
    this.uitvoeringId = uitvoering?.id;

    this.tickets = tickets;
    this.payments = payments;
    this.logs = logs;

  }

  get uitvoering() {
    return this._uitvoering;
  }
  set uitvoering(uitvoering) {
    if (uitvoering) {
      this._uitvoering = new Uitvoering(uitvoering);
      this.uitvoeringId = uitvoering?.id;
    }
  }

  get tickets() {
    return this._tickets;
  }
  set tickets(tickets) {
    this._tickets = tickets?.map(ticket => new Ticket(ticket)) || [];
  }
  get payments() {
    return this._payments;
  }
  set payments(payments) {
    this._payments = payments?.map(payment => new Payment(payment)) || [];
  }
  get logs() {
    return this._logs;
  }
  set logs(logs) {
    this._logs = logs?.map(log => new Log(log)) || [];
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
