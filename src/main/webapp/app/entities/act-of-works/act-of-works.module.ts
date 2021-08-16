import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ActOfWorksComponent } from './list/act-of-works.component';
import { ActOfWorksDetailComponent } from './detail/act-of-works-detail.component';
import { ActOfWorksUpdateComponent } from './update/act-of-works-update.component';
import { ActOfWorksDeleteDialogComponent } from './delete/act-of-works-delete-dialog.component';
import { ActOfWorksRoutingModule } from './route/act-of-works-routing.module';

@NgModule({
  imports: [SharedModule, ActOfWorksRoutingModule],
  declarations: [ActOfWorksComponent, ActOfWorksDetailComponent, ActOfWorksUpdateComponent, ActOfWorksDeleteDialogComponent],
  entryComponents: [ActOfWorksDeleteDialogComponent],
})
export class ActOfWorksModule {}
