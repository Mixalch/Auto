import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IMaster, Master } from '../master.model';
import { MasterService } from '../service/master.service';

@Component({
  selector: 'jhi-master-update',
  templateUrl: './master-update.component.html',
})
export class MasterUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [],
    date: [],
  });

  constructor(protected masterService: MasterService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ master }) => {
      this.updateForm(master);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const master = this.createFromForm();
    if (master.id !== undefined) {
      this.subscribeToSaveResponse(this.masterService.update(master));
    } else {
      this.subscribeToSaveResponse(this.masterService.create(master));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMaster>>): void {
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

  protected updateForm(master: IMaster): void {
    this.editForm.patchValue({
      id: master.id,
      name: master.name,
      date: master.date,
    });
  }

  protected createFromForm(): IMaster {
    return {
      ...new Master(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      date: this.editForm.get(['date'])!.value,
    };
  }
}
