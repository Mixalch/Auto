import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ICarBrand, CarBrand } from '../car-brand.model';
import { CarBrandService } from '../service/car-brand.service';

@Component({
  selector: 'jhi-car-brand-update',
  templateUrl: './car-brand-update.component.html',
})
export class CarBrandUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    brande: [],
  });

  constructor(protected carBrandService: CarBrandService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ carBrand }) => {
      this.updateForm(carBrand);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const carBrand = this.createFromForm();
    if (carBrand.id !== undefined) {
      this.subscribeToSaveResponse(this.carBrandService.update(carBrand));
    } else {
      this.subscribeToSaveResponse(this.carBrandService.create(carBrand));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICarBrand>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(carBrand: ICarBrand): void {
    this.editForm.patchValue({
      id: carBrand.id,
      brande: carBrand.brande,
    });
  }

  protected createFromForm(): ICarBrand {
    return {
      ...new CarBrand(),
      id: this.editForm.get(['id'])!.value,
      brande: this.editForm.get(['brande'])!.value,
    };
  }
}
