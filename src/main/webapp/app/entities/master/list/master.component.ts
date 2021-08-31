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
  masStatus: any[] = [];
  canDo = false;

  constructor(protected masterService: MasterService, protected modalService: NgbModal) {}

  async postData(url = ''): Promise<string> {
    const check = sessionStorage.getItem('jhi-authenticationToken');
    let token = `Bearer ${check ? check : ''}`;
    token = token.replace('"', '');
    token = token.replace('"', '');
    const response: any = await fetch(url, {
      method: 'GET',

      headers: {
        Authorization: token,
        'X-TENANT-ID': 'maksimdb',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'X-PINGOTHER, Content-Type',
        'Access-Control-Max-Age': '0',
        'Content-Security-Policy': 'default-src *; connect-src *; script-src *; object-src *',
        'X-Content-Security-Policy': 'default-src *; connect-src *; script-src *; object-src *',
        'X-Webkit-CSP': 'default-src *; connect-src *; script-src unsafe-inline unsafe-eval *; object-src *',
      },
    });

    const data: string = JSON.stringify(await response.json());

    return data;
  }

  apiStatusRecordByFetch(): void {
    this.postData('https://practice.sqilsoft.by/internship/yury_sinkevich/acl/api/get-acl-entries?objE=com.myapp.domain.Master').then(
      data => {
        this.masStatus = JSON.parse(data);
      }
    );
  }

  apiCanDoByFetch(): void {
    this.postData('https://practice.sqilsoft.by/internship/yury_sinkevich/acl/api/check-role').then(data => {
      this.canDo = JSON.parse(data);
    });
  }

  getStatusRecord(idRecord: any, permissionId: number): any {
    if (this.canDo) {
      return 16;
    }
    const newElemet: any = this.masStatus.filter(masStat => masStat.objId === idRecord);
    if (newElemet.length === 0) {
      return 0;
    }

    for (let i = 0; i < newElemet.length; i++) {
      if (newElemet[i].mask === permissionId) {
        return true;
      }
    }

    return false;
  }

  loadAll(): void {
    this.apiStatusRecordByFetch();
    this.apiCanDoByFetch();
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
