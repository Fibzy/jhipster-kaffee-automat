import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IKaffee } from 'app/shared/model/kaffee.model';

type EntityResponseType = HttpResponse<IKaffee>;
type EntityArrayResponseType = HttpResponse<IKaffee[]>;

@Injectable({ providedIn: 'root' })
export class KaffeeService {
  public resourceUrl = SERVER_API_URL + 'api/kaffees';

  constructor(protected http: HttpClient) {}

  create(kaffee: IKaffee): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(kaffee);
    return this.http
      .post<IKaffee>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(kaffee: IKaffee): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(kaffee);
    return this.http
      .put<IKaffee>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IKaffee>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IKaffee[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(kaffee: IKaffee): IKaffee {
    const copy: IKaffee = Object.assign({}, kaffee, {
      brewTime: kaffee.brewTime != null && kaffee.brewTime.isValid() ? kaffee.brewTime.toJSON() : null
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.brewTime = res.body.brewTime != null ? moment(res.body.brewTime) : null;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((kaffee: IKaffee) => {
        kaffee.brewTime = kaffee.brewTime != null ? moment(kaffee.brewTime) : null;
      });
    }
    return res;
  }
}
