import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMaster } from '../master.model';
import { MasterService } from '../service/master.service';

@Component({
  templateUrl: './master-delete-dialog.component.html',
})
export class MasterDeleteDialogComponent {
  master?: IMaster;

  constructor(protected masterService: MasterService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.masterService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
