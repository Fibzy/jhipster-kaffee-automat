import { Moment } from 'moment';
import { IMitarbeiter } from 'app/shared/model/mitarbeiter.model';

export const enum KaffeeArt {
  SCHWARZ = 'SCHWARZ',
  MILCH = 'MILCH',
  VANILLE = 'VANILLE',
  ESPRESSO = 'ESPRESSO',
  KAKAO = 'KAKAO'
}

export interface IKaffee {
  id?: number;
  art?: KaffeeArt;
  brewTime?: Moment;
  mitarbeiter?: IMitarbeiter;
}

export class Kaffee implements IKaffee {
  constructor(public id?: number, public art?: KaffeeArt, public brewTime?: Moment, public mitarbeiter?: IMitarbeiter) {}
}
