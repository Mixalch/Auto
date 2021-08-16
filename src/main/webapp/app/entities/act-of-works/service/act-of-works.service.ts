import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IActOfWorks, getActOfWorksIdentifier } from '../act-of-works.model';

export type EntityResponseType = HttpResponse<IActOfWorks>;
export type EntityArrayResponseType = HttpResponse<IActOfWorks[]>;

@Injectable({ providedIn: 'root' })
export class ActOfWorksService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/act-of-works');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(actOfWorks: IActOfWorks): Observable<EntityResponseType> {
    return this.http.post<IActOfWorks>(this.resourceUrl, actOfWorks, { observe: 'response' });
  }

  update(actOfWorks: IActOfWorks): Observable<EntityResponseType> {
    return this.http.put<IActOfWorks>(`${this.resourceUrl}/${getActOfWorksIdentifier(actOfWorks) as number}`, actOfWorks, {
      observe: 'response',
    });
  }

  partialUpdate(actOfWorks: IActOfWorks): Observable<EntityResponseType> {
    return this.http.patch<IActOfWorks>(`${this.resourceUrl}/${getActOfWorksIdentifier(actOfWorks) as number}`, actOfWorks, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IActOfWorks>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IActOfWorks[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addActOfWorksToCollectionIfMissing(
    actOfWorksCollection: IActOfWorks[],
    ...actOfWorksToCheck: (IActOfWorks | null | undefined)[]
  ): IActOfWorks[] {
    const actOfWorks: IActOfWorks[] = actOfWorksToCheck.filter(isPresent);
    if (actOfWorks.length > 0) {
      const actOfWorksCollectionIdentifiers = actOfWorksCollection.map(actOfWorksItem => getActOfWorksIdentifier(actOfWorksItem)!);
      const actOfWorksToAdd = actOfWorks.filter(actOfWorksItem => {
        const actOfWorksIdentifier = getActOfWorksIdentifier(actOfWorksItem);
        if (actOfWorksIdentifier == null || actOfWorksCollectionIdentifiers.includes(actOfWorksIdentifier)) {
          return false;
        }
        actOfWorksCollectionIdentifiers.push(actOfWorksIdentifier);
        return true;
      });
      return [...actOfWorksToAdd, ...actOfWorksCollection];
    }
    return actOfWorksCollection;
  }
}
