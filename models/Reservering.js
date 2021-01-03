import { Ticket } from './Ticket'
import { Uitvoering } from './Uitvoering'
import { Payment } from './Payment'
import { Log } from './Log'

export class Reservering {
  constructor({ id,
    naam, email, wachtlijst, opmerking, opmerking_gebruiker,
    ingenomen, betaald, uitvoering, tickets, payments, logs } = {}) {
    this.naam = naam;
    this.email = email;
    this.wachtlijst = !!wachtlijst;
    this.opmerking = opmerking;
    this.opmerking_gebruiker = opmerking_gebruiker;
    this.ingenomen = ingenomen;
    this.betaald = !!betaald;
    this.uitvoering = uitvoering;
    this.tickets = tickets;
    this.payments = payments;
    this.logs = logs;

    this._uitvoering = null;
    this._tickets = [];
    this._payments = [];
    this._logs = [];
  }

  get uitvoering() {
    return this._uitvoering;
  }
  set uitvoering(uitvoering) {
    this._uitvoering = new Uitvoering(uitvoering);
  }

  get tickets() {
    return this._tickets;
  }
  set tickets(tickets) {
    this._tickets = tickets.map(ticket => new Ticket(ticket));
  }
  get payments() {
    return this._payments;
  }
  set payments(payments) {
    this._payments = payments.map(payment => new Payment(payment));
  }
  get logs() {
    return this._logs;
  }
  set logs(logs) {
    this._logs = logs.map(log => new Log(log));
  }

}
