import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICarBrand, CarBrand } from '../car-brand.model';
import { CarBrandService } from '../service/car-brand.service';

@Injectable({ providedIn: 'root' })
export class CarBrandRoutingResolveService implements Resolve<ICarBrand> {
  constructor(protected service: CarBrandService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICarBrand> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((carBrand: HttpResponse<CarBrand>) => {
          if (carBrand.body) {
            return of(carBrand.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new CarBrand());
  }
}
