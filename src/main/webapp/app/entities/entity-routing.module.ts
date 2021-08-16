import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'car-brand',
        data: { pageTitle: 'myApp.carBrand.home.title' },
        loadChildren: () => import('./car-brand/car-brand.module').then(m => m.CarBrandModule),
      },
      {
        path: 'client-car',
        data: { pageTitle: 'myApp.clientCar.home.title' },
        loadChildren: () => import('./client-car/client-car.module').then(m => m.ClientCarModule),
      },
      {
        path: 'act-of-works',
        data: { pageTitle: 'myApp.actOfWorks.home.title' },
        loadChildren: () => import('./act-of-works/act-of-works.module').then(m => m.ActOfWorksModule),
      },
      {
        path: 'master',
        data: { pageTitle: 'myApp.master.home.title' },
        loadChildren: () => import('./master/master.module').then(m => m.MasterModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
