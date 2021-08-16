import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IActOfWorks, ActOfWorks } from '../act-of-works.model';
import { ActOfWorksService } from '../service/act-of-works.service';
import { IClientCar } from 'app/entities/client-car/client-car.model';
import { ClientCarService } from 'app/entities/client-car/service/client-car.service';
import { IMaster } from 'app/entities/master/master.model';
import { MasterService } from 'app/entities/master/service/master.service';

@Component({
  selector: 'jhi-act-of-works-update',
  templateUrl: './act-of-works-update.component.html',
})
export class ActOfWorksUpdateComponent implements OnInit {
  isSaving = false;

  clientCarsSharedCollection: IClientCar[] = [];
  mastersSharedCollection: IMaster[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    win: [],
    problev: [],
    clientCar: [],
    master: [],
  });

  constructor(
    protected actOfWorksService: ActOfWorksService,
    protected clientCarService: ClientCarService,
    protected masterService: MasterService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ actOfWorks }) => {
      this.updateForm(actOfWorks);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const actOfWorks = this.createFromForm();
    if (actOfWorks.id !== undefined) {
      this.subscribeToSaveResponse(this.actOfWorksService.update(actOfWorks));
    } else {
      this.subscribeToSaveResponse(this.actOfWorksService.create(actOfWorks));
    }
  }

  trackClientCarById(index: number, item: IClientCar): number {
    return item.id!;
  }

  trackMasterById(index: number, item: IMaster): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IActOfWorks>>): void {
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

  protected updateForm(actOfWorks: IActOfWorks): void {
    this.editForm.patchValue({
      id: actOfWorks.id,
      name: actOfWorks.name,
      win: actOfWorks.win,
      problev: actOfWorks.problev,
      clientCar: actOfWorks.clientCar,
      master: actOfWorks.master,
    });

    this.clientCarsSharedCollection = this.clientCarService.addClientCarToCollectionIfMissing(
      this.clientCarsSharedCollection,
      actOfWorks.clientCar
    );
    this.mastersSharedCollection = this.masterService.addMasterToCollectionIfMissing(this.mastersSharedCollection, actOfWorks.master);
  }

  protected loadRelationshipsOptions(): void {
    this.clientCarService
      .query()
      .pipe(map((res: HttpResponse<IClientCar[]>) => res.body ?? []))
      .pipe(
        map((clientCars: IClientCar[]) =>
          this.clientCarService.addClientCarToCollectionIfMissing(clientCars, this.editForm.get('clientCar')!.value)
        )
      )
      .subscribe((clientCars: IClientCar[]) => (this.clientCarsSharedCollection = clientCars));

    this.masterService
      .query()
      .pipe(map((res: HttpResponse<IMaster[]>) => res.body ?? []))
      .pipe(map((masters: IMaster[]) => this.masterService.addMasterToCollectionIfMissing(masters, this.editForm.get('master')!.value)))
      .subscribe((masters: IMaster[]) => (this.mastersSharedCollection = masters));
  }

  protected createFromForm(): IActOfWorks {
    return {
      ...new ActOfWorks(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      win: this.editForm.get(['win'])!.value,
      problev: this.editForm.get(['problev'])!.value,
      clientCar: this.editForm.get(['clientCar'])!.value,
      master: this.editForm.get(['master'])!.value,
    };
  }
}
