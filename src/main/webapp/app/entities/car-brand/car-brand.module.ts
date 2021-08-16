import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CarBrandComponent } from './list/car-brand.component';
import { CarBrandDetailComponent } from './detail/car-brand-detail.component';
import { CarBrandUpdateComponent } from './update/car-brand-update.component';
import { CarBrandDeleteDialogComponent } from './delete/car-brand-delete-dialog.component';
import { CarBrandRoutingModule } from './route/car-brand-routing.module';

@NgModule({
  imports: [SharedModule, CarBrandRoutingModule],
  declarations: [CarBrandComponent, CarBrandDetailComponent, CarBrandUpdateComponent, CarBrandDeleteDialogComponent],
  entryComponents: [CarBrandDeleteDialogComponent],
})
export class CarBrandModule {}
