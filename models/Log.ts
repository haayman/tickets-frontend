import { Reservering } from "./Reservering";

/* eslint-disable camelcase */
export class Log {
  id: string;
  message: string;
  created_at: Date;
  reservering?: Reservering;

  constructor({
    id,
    message,
    created_at,
  }: {
    id: string;
    message: string;
    created_at: string;
    reservering: Reservering;
  }) {
    this.id = id;
    this.message = message;
    this.created_at = new Date(created_at);
  }

  toString() {
    return `${this.created_at} ${this.message})`;
  }
}
