import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IClientCar } from '../client-car.model';

@Component({
  selector: 'jhi-client-car-detail',
  templateUrl: './client-car-detail.component.html',
})
export class ClientCarDetailComponent implements OnInit {
  clientCar: IClientCar | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ clientCar }) => {
      this.clientCar = clientCar;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
