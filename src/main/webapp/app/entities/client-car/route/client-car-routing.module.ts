import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ClientCarComponent } from '../list/client-car.component';
import { ClientCarDetailComponent } from '../detail/client-car-detail.component';
import { ClientCarUpdateComponent } from '../update/client-car-update.component';
import { ClientCarRoutingResolveService } from './client-car-routing-resolve.service';

const clientCarRoute: Routes = [
  {
    path: '',
    component: ClientCarComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ClientCarDetailComponent,
    resolve: {
      clientCar: ClientCarRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ClientCarUpdateComponent,
    resolve: {
      clientCar: ClientCarRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ClientCarUpdateComponent,
    resolve: {
      clientCar: ClientCarRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(clientCarRoute)],
  exports: [RouterModule],
})
export class ClientCarRoutingModule {}
