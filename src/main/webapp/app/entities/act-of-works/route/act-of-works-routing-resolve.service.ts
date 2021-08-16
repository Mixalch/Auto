import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IActOfWorks, ActOfWorks } from '../act-of-works.model';
import { ActOfWorksService } from '../service/act-of-works.service';

@Injectable({ providedIn: 'root' })
export class ActOfWorksRoutingResolveService implements Resolve<IActOfWorks> {
  constructor(protected service: ActOfWorksService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IActOfWorks> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((actOfWorks: HttpResponse<ActOfWorks>) => {
          if (actOfWorks.body) {
            return of(actOfWorks.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ActOfWorks());
  }
}
