import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICarBrand } from '../car-brand.model';

@Component({
  selector: 'jhi-car-brand-detail',
  templateUrl: './car-brand-detail.component.html',
})
export class CarBrandDetailComponent implements OnInit {
  carBrand: ICarBrand | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ carBrand }) => {
      this.carBrand = carBrand;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
