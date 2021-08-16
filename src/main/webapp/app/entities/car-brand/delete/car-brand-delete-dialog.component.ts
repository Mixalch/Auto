import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICarBrand } from '../car-brand.model';
import { CarBrandService } from '../service/car-brand.service';

@Component({
  templateUrl: './car-brand-delete-dialog.component.html',
})
export class CarBrandDeleteDialogComponent {
  carBrand?: ICarBrand;

  constructor(protected carBrandService: CarBrandService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.carBrandService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
