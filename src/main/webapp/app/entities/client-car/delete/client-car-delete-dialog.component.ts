import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IClientCar } from '../client-car.model';
import { ClientCarService } from '../service/client-car.service';

@Component({
  templateUrl: './client-car-delete-dialog.component.html',
})
export class ClientCarDeleteDialogComponent {
  clientCar?: IClientCar;

  constructor(protected clientCarService: ClientCarService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.clientCarService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
