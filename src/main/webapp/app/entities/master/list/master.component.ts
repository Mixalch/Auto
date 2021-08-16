import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IMaster } from '../master.model';
import { MasterService } from '../service/master.service';
import { MasterDeleteDialogComponent } from '../delete/master-delete-dialog.component';

@Component({
  selector: 'jhi-master',
  templateUrl: './master.component.html',
})
export class MasterComponent implements OnInit {
  masters?: IMaster[];
  isLoading = false;

  constructor(protected masterService: MasterService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.masterService.query().subscribe(
      (res: HttpResponse<IMaster[]>) => {
        this.isLoading = false;
        this.masters = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IMaster): number {
    return item.id!;
  }

  delete(master: IMaster): void {
    const modalRef = this.modalService.open(MasterDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.master = master;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
