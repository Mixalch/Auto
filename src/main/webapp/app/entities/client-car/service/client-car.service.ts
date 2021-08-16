import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IClientCar, getClientCarIdentifier } from '../client-car.model';

export type EntityResponseType = HttpResponse<IClientCar>;
export type EntityArrayResponseType = HttpResponse<IClientCar[]>;

@Injectable({ providedIn: 'root' })
export class ClientCarService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/client-cars');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(clientCar: IClientCar): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(clientCar);
    return this.http
      .post<IClientCar>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(clientCar: IClientCar): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(clientCar);
    return this.http
      .put<IClientCar>(`${this.resourceUrl}/${getClientCarIdentifier(clientCar) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(clientCar: IClientCar): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(clientCar);
    return this.http
      .patch<IClientCar>(`${this.resourceUrl}/${getClientCarIdentifier(clientCar) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IClientCar>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IClientCar[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addClientCarToCollectionIfMissing(
    clientCarCollection: IClientCar[],
    ...clientCarsToCheck: (IClientCar | null | undefined)[]
  ): IClientCar[] {
    const clientCars: IClientCar[] = clientCarsToCheck.filter(isPresent);
    if (clientCars.length > 0) {
      const clientCarCollectionIdentifiers = clientCarCollection.map(clientCarItem => getClientCarIdentifier(clientCarItem)!);
      const clientCarsToAdd = clientCars.filter(clientCarItem => {
        const clientCarIdentifier = getClientCarIdentifier(clientCarItem);
        if (clientCarIdentifier == null || clientCarCollectionIdentifiers.includes(clientCarIdentifier)) {
          return false;
        }
        clientCarCollectionIdentifiers.push(clientCarIdentifier);
        return true;
      });
      return [...clientCarsToAdd, ...clientCarCollection];
    }
    return clientCarCollection;
  }

  protected convertDateFromClient(clientCar: IClientCar): IClientCar {
    return Object.assign({}, clientCar, {
      dateReceiving: clientCar.dateReceiving?.isValid() ? clientCar.dateReceiving.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateReceiving = res.body.dateReceiving ? dayjs(res.body.dateReceiving) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((clientCar: IClientCar) => {
        clientCar.dateReceiving = clientCar.dateReceiving ? dayjs(clientCar.dateReceiving) : undefined;
      });
    }
    return res;
  }
}
