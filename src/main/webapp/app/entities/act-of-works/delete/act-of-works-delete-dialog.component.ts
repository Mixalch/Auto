import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IActOfWorks } from '../act-of-works.model';
import { ActOfWorksService } from '../service/act-of-works.service';

@Component({
  templateUrl: './act-of-works-delete-dialog.component.html',
})
export class ActOfWorksDeleteDialogComponent {
  actOfWorks?: IActOfWorks;

  constructor(protected actOfWorksService: ActOfWorksService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.actOfWorksService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
