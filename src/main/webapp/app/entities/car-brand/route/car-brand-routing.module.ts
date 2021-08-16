import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CarBrandComponent } from '../list/car-brand.component';
import { CarBrandDetailComponent } from '../detail/car-brand-detail.component';
import { CarBrandUpdateComponent } from '../update/car-brand-update.component';
import { CarBrandRoutingResolveService } from './car-brand-routing-resolve.service';

const carBrandRoute: Routes = [
  {
    path: '',
    component: CarBrandComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CarBrandDetailComponent,
    resolve: {
      carBrand: CarBrandRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CarBrandUpdateComponent,
    resolve: {
      carBrand: CarBrandRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CarBrandUpdateComponent,
    resolve: {
      carBrand: CarBrandRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(carBrandRoute)],
  exports: [RouterModule],
})
export class CarBrandRoutingModule {}
