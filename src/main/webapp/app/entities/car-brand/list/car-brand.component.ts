import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';

import { ICarBrand } from '../car-brand.model';
import { CarBrandService } from '../service/car-brand.service';
import { CarBrandDeleteDialogComponent } from '../delete/car-brand-delete-dialog.component';
import { subscribeOn } from 'rxjs/operators';
import { formatNumber } from '@angular/common';

@Component({
  selector: 'jhi-car-brand',
  templateUrl: './car-brand.component.html',
})
export class CarBrandComponent implements OnInit {
  carBrands?: ICarBrand[];
  isLoading = false;

  constructor(protected carBrandService: CarBrandService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.carBrandService.query().subscribe(
      (res: HttpResponse<ICarBrand[]>) => {
        this.isLoading = false;
        this.carBrands = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ICarBrand): number {
    return item.id!;
  }

  delete(carBrand: ICarBrand): void {
    const modalRef = this.modalService.open(CarBrandDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.carBrand = carBrand;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
