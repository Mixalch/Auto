import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMaster, getMasterIdentifier } from '../master.model';

export type EntityResponseType = HttpResponse<IMaster>;
export type EntityArrayResponseType = HttpResponse<IMaster[]>;

@Injectable({ providedIn: 'root' })
export class MasterService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/masters');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(master: IMaster): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(master);
    return this.http
      .post<IMaster>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(master: IMaster): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(master);
    return this.http
      .put<IMaster>(`${this.resourceUrl}/${getMasterIdentifier(master) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(master: IMaster): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(master);
    return this.http
      .patch<IMaster>(`${this.resourceUrl}/${getMasterIdentifier(master) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IMaster>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IMaster[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addMasterToCollectionIfMissing(masterCollection: IMaster[], ...mastersToCheck: (IMaster | null | undefined)[]): IMaster[] {
    const masters: IMaster[] = mastersToCheck.filter(isPresent);
    if (masters.length > 0) {
      const masterCollectionIdentifiers = masterCollection.map(masterItem => getMasterIdentifier(masterItem)!);
      const mastersToAdd = masters.filter(masterItem => {
        const masterIdentifier = getMasterIdentifier(masterItem);
        if (masterIdentifier == null || masterCollectionIdentifiers.includes(masterIdentifier)) {
          return false;
        }
        masterCollectionIdentifiers.push(masterIdentifier);
        return true;
      });
      return [...mastersToAdd, ...masterCollection];
    }
    return masterCollection;
  }

  protected convertDateFromClient(master: IMaster): IMaster {
    return Object.assign({}, master, {
      date: master.date?.isValid() ? master.date.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.date = res.body.date ? dayjs(res.body.date) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((master: IMaster) => {
        master.date = master.date ? dayjs(master.date) : undefined;
      });
    }
    return res;
  }
}
