import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMaster, Master } from '../master.model';
import { MasterService } from '../service/master.service';

@Injectable({ providedIn: 'root' })
export class MasterRoutingResolveService implements Resolve<IMaster> {
  constructor(protected service: MasterService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMaster> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((master: HttpResponse<Master>) => {
          if (master.body) {
            return of(master.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Master());
  }
}
