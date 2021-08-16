import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IActOfWorks } from '../act-of-works.model';

@Component({
  selector: 'jhi-act-of-works-detail',
  templateUrl: './act-of-works-detail.component.html',
})
export class ActOfWorksDetailComponent implements OnInit {
  actOfWorks: IActOfWorks | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ actOfWorks }) => {
      this.actOfWorks = actOfWorks;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
