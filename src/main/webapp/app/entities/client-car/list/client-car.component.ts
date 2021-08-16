import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IClientCar } from '../client-car.model';
import { ClientCarService } from '../service/client-car.service';
import { ClientCarDeleteDialogComponent } from '../delete/client-car-delete-dialog.component';

@Component({
  selector: 'jhi-client-car',
  templateUrl: './client-car.component.html',
})
export class ClientCarComponent implements OnInit {
  clientCars?: IClientCar[];
  isLoading = false;

  constructor(protected clientCarService: ClientCarService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.clientCarService.query().subscribe(
      (res: HttpResponse<IClientCar[]>) => {
        this.isLoading = false;
        this.clientCars = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IClientCar): number {
    return item.id!;
  }

  delete(clientCar: IClientCar): void {
    const modalRef = this.modalService.open(ClientCarDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.clientCar = clientCar;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
