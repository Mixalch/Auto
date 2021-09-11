import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterService } from '../../service/master.service';

class MasterPermission {
  id?: number;
  name?: string;
  mask?: string;
}

class DeletedPermissionMaster {
  entityId?: number;
  permission?: string;
  userCredentional?: string;
}
@Component({
  templateUrl: './master-permission-delete-dialog.component.html',
  selector: 'jhi-master',
})
export class MasterPermissionDeleteDialogComponent {
  masters?: MasterPermission[];
  permission: string;

  permissionForm = this.fb.group({
    entityId: [],
    userCredentional: [],
  });
  constructor(protected masterService: MasterService, protected activeModal: NgbActiveModal, protected fb: FormBuilder) {
    this.permission = '';
  }

  cancel(): void {
    this.activeModal.dismiss();
  }

  downloadMasters(): void {
    const user: string = this.permissionForm.get(['userCredentional'])!.value;
    this.getData(`http://localhost:8080/api/masters/by-user/${user}`).then(data => {
      this.masters = JSON.parse(data);
    });
  }

  async postData(url = '', sendData: any): Promise<string> {
    const check = sessionStorage.getItem('jhi-authenticationToken');
    let token = `Bearer ${check ? check : ''}`;
    token = token.replace('"', '');
    token = token.replace('"', '');
    const response: any = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-TENANT-ID': 'maksimdb',
        Authorization: token,
      },
      body: JSON.stringify(sendData),
    });

    const data: string = await response.text();

    return data;
  }

  async getData(url = ''): Promise<string> {
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

  deletePermission(masterId: number, mask: string): void {
    const user: string = this.permissionForm.get(['userCredentional'])!.value;
    const toDelete: DeletedPermissionMaster = {
      entityId: masterId,
      permission: mask,
      userCredentional: user,
    };
    this.postData('http://localhost:8080/api/masters/delete-permission/user', toDelete);
    this.masters = this.masters!.filter(value => {
      if (value.id === masterId && value.mask === mask) {
        return false;
      }
      return true;
    });
  }
}
