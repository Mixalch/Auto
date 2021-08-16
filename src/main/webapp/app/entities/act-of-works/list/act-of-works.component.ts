import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IActOfWorks } from '../act-of-works.model';
import { ActOfWorksService } from '../service/act-of-works.service';
import { ActOfWorksDeleteDialogComponent } from '../delete/act-of-works-delete-dialog.component';

@Component({
  selector: 'jhi-act-of-works',
  templateUrl: './act-of-works.component.html',
})
export class ActOfWorksComponent implements OnInit {
  actOfWorks?: IActOfWorks[];
  isLoading = false;

  constructor(protected actOfWorksService: ActOfWorksService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.actOfWorksService.query().subscribe(
      (res: HttpResponse<IActOfWorks[]>) => {
        this.isLoading = false;
        this.actOfWorks = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IActOfWorks): number {
    return item.id!;
  }

  delete(actOfWorks: IActOfWorks): void {
    const modalRef = this.modalService.open(ActOfWorksDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.actOfWorks = actOfWorks;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
