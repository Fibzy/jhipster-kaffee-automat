import { IKaffee } from 'app/shared/model/kaffee.model';

export interface IMitarbeiter {
  id?: number;
  vorname?: string;
  nachname?: string;
  kaffees?: IKaffee[];
}

export class Mitarbeiter implements IMitarbeiter {
  constructor(public id?: number, public vorname?: string, public nachname?: string, public kaffees?: IKaffee[]) {}
}
