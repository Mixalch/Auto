import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MasterComponent } from './list/master.component';
import { MasterDetailComponent } from './detail/master-detail.component';
import { MasterUpdateComponent } from './update/master-update.component';
import { MasterDeleteDialogComponent } from './delete/master-delete-dialog.component';
import { MasterRoutingModule } from './route/master-routing.module';

@NgModule({
  imports: [SharedModule, MasterRoutingModule],
  declarations: [MasterComponent, MasterDetailComponent, MasterUpdateComponent, MasterDeleteDialogComponent],
  entryComponents: [MasterDeleteDialogComponent],
})
export class MasterModule {}
