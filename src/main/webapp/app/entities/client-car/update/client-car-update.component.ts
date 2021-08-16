import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IClientCar, ClientCar } from '../client-car.model';
import { ClientCarService } from '../service/client-car.service';
import { ICarBrand } from 'app/entities/car-brand/car-brand.model';
import { CarBrandService } from 'app/entities/car-brand/service/car-brand.service';

@Component({
  selector: 'jhi-client-car-update',
  templateUrl: './client-car-update.component.html',
})
export class ClientCarUpdateComponent implements OnInit {
  isSaving = false;

  carBrandsSharedCollection: ICarBrand[] = [];

  editForm = this.fb.group({
    id: [],
    brande: [],
    win: [],
    dateReceiving: [],
    carBrand: [],
  });

  constructor(
    protected clientCarService: ClientCarService,
    protected carBrandService: CarBrandService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ clientCar }) => {
      this.updateForm(clientCar);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const clientCar = this.createFromForm();
    if (clientCar.id !== undefined) {
      this.subscribeToSaveResponse(this.clientCarService.update(clientCar));
    } else {
      this.subscribeToSaveResponse(this.clientCarService.create(clientCar));
    }
  }

  trackCarBrandById(index: number, item: ICarBrand): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IClientCar>>): void {
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

  protected updateForm(clientCar: IClientCar): void {
    this.editForm.patchValue({
      id: clientCar.id,
      brande: clientCar.brande,
      win: clientCar.win,
      dateReceiving: clientCar.dateReceiving,
      carBrand: clientCar.carBrand,
    });

    this.carBrandsSharedCollection = this.carBrandService.addCarBrandToCollectionIfMissing(
      this.carBrandsSharedCollection,
      clientCar.carBrand
    );
  }

  protected loadRelationshipsOptions(): void {
    this.carBrandService
      .query()
      .pipe(map((res: HttpResponse<ICarBrand[]>) => res.body ?? []))
      .pipe(
        map((carBrands: ICarBrand[]) =>
          this.carBrandService.addCarBrandToCollectionIfMissing(carBrands, this.editForm.get('carBrand')!.value)
        )
      )
      .subscribe((carBrands: ICarBrand[]) => (this.carBrandsSharedCollection = carBrands));
  }

  protected createFromForm(): IClientCar {
    return {
      ...new ClientCar(),
      id: this.editForm.get(['id'])!.value,
      brande: this.editForm.get(['brande'])!.value,
      win: this.editForm.get(['win'])!.value,
      dateReceiving: this.editForm.get(['dateReceiving'])!.value,
      carBrand: this.editForm.get(['carBrand'])!.value,
    };
  }
}
