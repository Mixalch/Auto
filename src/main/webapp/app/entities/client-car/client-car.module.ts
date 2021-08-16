import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ClientCarComponent } from './list/client-car.component';
import { ClientCarDetailComponent } from './detail/client-car-detail.component';
import { ClientCarUpdateComponent } from './update/client-car-update.component';
import { ClientCarDeleteDialogComponent } from './delete/client-car-delete-dialog.component';
import { ClientCarRoutingModule } from './route/client-car-routing.module';

@NgModule({
  imports: [SharedModule, ClientCarRoutingModule],
  declarations: [ClientCarComponent, ClientCarDetailComponent, ClientCarUpdateComponent, ClientCarDeleteDialogComponent],
  entryComponents: [ClientCarDeleteDialogComponent],
})
export class ClientCarModule {}
