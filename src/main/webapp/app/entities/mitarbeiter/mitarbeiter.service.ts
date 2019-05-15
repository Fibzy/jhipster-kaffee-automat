import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IMitarbeiter } from 'app/shared/model/mitarbeiter.model';

type EntityResponseType = HttpResponse<IMitarbeiter>;
type EntityArrayResponseType = HttpResponse<IMitarbeiter[]>;

@Injectable({ providedIn: 'root' })
export class MitarbeiterService {
  public resourceUrl = SERVER_API_URL + 'api/mitarbeiters';

  constructor(protected http: HttpClient) {}

  create(mitarbeiter: IMitarbeiter): Observable<EntityResponseType> {
    return this.http.post<IMitarbeiter>(this.resourceUrl, mitarbeiter, { observe: 'response' });
  }

  update(mitarbeiter: IMitarbeiter): Observable<EntityResponseType> {
    return this.http.put<IMitarbeiter>(this.resourceUrl, mitarbeiter, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMitarbeiter>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMitarbeiter[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
