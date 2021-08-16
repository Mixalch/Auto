import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMaster } from '../master.model';

@Component({
  selector: 'jhi-master-detail',
  templateUrl: './master-detail.component.html',
})
export class MasterDetailComponent implements OnInit {
  master: IMaster | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ master }) => {
      this.master = master;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
