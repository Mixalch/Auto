import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MasterComponent } from './list/master.component';
import { MasterDetailComponent } from './detail/master-detail.component';
import { MasterUpdateComponent } from './update/master-update.component';
import { MasterDeleteDialogComponent } from './delete/master-delete-dialog.component';
import { MasterRoutingModule } from './route/master-routing.module';
import { MasterPermissionDialogComponent } from './permission/master-permission-dialog.component';
import { MasterPermissionDeleteDialogComponent } from './permission/delete-permission/master-permission-delete-dialog.component';

@NgModule({
  imports: [SharedModule, MasterRoutingModule],
  declarations: [
    MasterComponent,
    MasterDetailComponent,
    MasterUpdateComponent,
    MasterDeleteDialogComponent,
    MasterPermissionDialogComponent,
    MasterPermissionDeleteDialogComponent,
  ],
  entryComponents: [MasterDeleteDialogComponent, MasterPermissionDialogComponent, MasterPermissionDeleteDialogComponent],
})
export class MasterModule {}
