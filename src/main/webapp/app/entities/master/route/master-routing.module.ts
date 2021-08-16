import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MasterComponent } from '../list/master.component';
import { MasterDetailComponent } from '../detail/master-detail.component';
import { MasterUpdateComponent } from '../update/master-update.component';
import { MasterRoutingResolveService } from './master-routing-resolve.service';

const masterRoute: Routes = [
  {
    path: '',
    component: MasterComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MasterDetailComponent,
    resolve: {
      master: MasterRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MasterUpdateComponent,
    resolve: {
      master: MasterRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MasterUpdateComponent,
    resolve: {
      master: MasterRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(masterRoute)],
  exports: [RouterModule],
})
export class MasterRoutingModule {}
