import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IClientCar, ClientCar } from '../client-car.model';
import { ClientCarService } from '../service/client-car.service';

@Injectable({ providedIn: 'root' })
export class ClientCarRoutingResolveService implements Resolve<IClientCar> {
  constructor(protected service: ClientCarService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IClientCar> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((clientCar: HttpResponse<ClientCar>) => {
          if (clientCar.body) {
            return of(clientCar.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ClientCar());
  }
}
