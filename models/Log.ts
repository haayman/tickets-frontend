export type ILog = {
  id: string;
  message: string;
  created_at: string;
};

export class Log {
  id: string;
  message: string;
  created_at: Date;

  constructor(params: ILog) {
    this.id = params.id;
    this.message = params.message;
    this.created_at = new Date(params.created_at);
  }

  toString() {
    return `${this.created_at} ${this.message})`;
  }
}
