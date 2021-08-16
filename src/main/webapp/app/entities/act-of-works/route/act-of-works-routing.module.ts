import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ActOfWorksComponent } from '../list/act-of-works.component';
import { ActOfWorksDetailComponent } from '../detail/act-of-works-detail.component';
import { ActOfWorksUpdateComponent } from '../update/act-of-works-update.component';
import { ActOfWorksRoutingResolveService } from './act-of-works-routing-resolve.service';

const actOfWorksRoute: Routes = [
  {
    path: '',
    component: ActOfWorksComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ActOfWorksDetailComponent,
    resolve: {
      actOfWorks: ActOfWorksRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ActOfWorksUpdateComponent,
    resolve: {
      actOfWorks: ActOfWorksRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ActOfWorksUpdateComponent,
    resolve: {
      actOfWorks: ActOfWorksRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(actOfWorksRoute)],
  exports: [RouterModule],
})
export class ActOfWorksRoutingModule {}
