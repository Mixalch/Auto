import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICarBrand, getCarBrandIdentifier } from '../car-brand.model';

export type EntityResponseType = HttpResponse<ICarBrand>;
export type EntityArrayResponseType = HttpResponse<ICarBrand[]>;

@Injectable({ providedIn: 'root' })
export class CarBrandService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/car-brands');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(carBrand: ICarBrand): Observable<EntityResponseType> {
    return this.http.post<ICarBrand>(this.resourceUrl, carBrand, { observe: 'response' });
  }

  update(carBrand: ICarBrand): Observable<EntityResponseType> {
    return this.http.put<ICarBrand>(`${this.resourceUrl}/${getCarBrandIdentifier(carBrand) as number}`, carBrand, { observe: 'response' });
  }

  partialUpdate(carBrand: ICarBrand): Observable<EntityResponseType> {
    return this.http.patch<ICarBrand>(`${this.resourceUrl}/${getCarBrandIdentifier(carBrand) as number}`, carBrand, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICarBrand>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICarBrand[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCarBrandToCollectionIfMissing(carBrandCollection: ICarBrand[], ...carBrandsToCheck: (ICarBrand | null | undefined)[]): ICarBrand[] {
    const carBrands: ICarBrand[] = carBrandsToCheck.filter(isPresent);
    if (carBrands.length > 0) {
      const carBrandCollectionIdentifiers = carBrandCollection.map(carBrandItem => getCarBrandIdentifier(carBrandItem)!);
      const carBrandsToAdd = carBrands.filter(carBrandItem => {
        const carBrandIdentifier = getCarBrandIdentifier(carBrandItem);
        if (carBrandIdentifier == null || carBrandCollectionIdentifiers.includes(carBrandIdentifier)) {
          return false;
        }
        carBrandCollectionIdentifiers.push(carBrandIdentifier);
        return true;
      });
      return [...carBrandsToAdd, ...carBrandCollection];
    }
    return carBrandCollection;
  }
}
