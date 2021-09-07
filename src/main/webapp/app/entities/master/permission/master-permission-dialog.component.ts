import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IMaster } from '../master.model';
import { MasterService } from '../service/master.service';

class MasterPermission {
  entityId?: number;
  permission?: string;
  userCredentional?: string;
}

@Component({
  templateUrl: './master-permission-dialog.component.html',
  selector: 'jhi-master',
})
export class MasterPermissionDialogComponent {
  masters?: IMaster[];
  toAddPermission: MasterPermission[];
  bufferPermissionArray: MasterPermission[];

  permissionForm = this.fb.group({
    userCredentional: [],
    userPermission: [],
  });

  constructor(protected masterService: MasterService, protected activeModal: NgbActiveModal, protected fb: FormBuilder) {
    (this.toAddPermission = []), (this.bufferPermissionArray = []);
  }

  cancel(): void {
    this.activeModal.dismiss();
  }

  check(masterId: number, isChecked: any): void {
    const user = this.permissionForm.get(['userCredentional'])!.value;
    const selectedPermission = this.bufferPermissionArray.filter(value => value.entityId === masterId)[0]?.permission;
    const permission: MasterPermission = {
      entityId: masterId,
      permission: selectedPermission ? selectedPermission : 'WRITE',
      userCredentional: user,
    };

    if (isChecked.checked) {
      this.toAddPermission.push(permission);
    } else {
      this.toAddPermission = this.toAddPermission.filter(value => value.entityId !== masterId);
    }
  }

  addPermission(e: any, masterId: number): void {
    const selectedPermission = e.target.value;
    const userName = this.permissionForm.get(['userCredentional']);
    const user = userName !== null ? userName.value : '';
    const permission: MasterPermission = {
      entityId: masterId,
      permission: selectedPermission,
      userCredentional: user,
    };

    let flag = false;
    for (let i = 0; i < this.bufferPermissionArray.length; i++) {
      if (this.bufferPermissionArray[i].entityId === masterId) {
        this.bufferPermissionArray[i].permission = selectedPermission;
        this.bufferPermissionArray[i].userCredentional = user;
        flag = true;
        break;
      }
    }

    if (!flag) {
      this.bufferPermissionArray.push(permission);
    }

    for (let i = 0; i < this.toAddPermission.length; i++) {
      if (this.toAddPermission[i].entityId === masterId) {
        this.toAddPermission[i].permission = selectedPermission;
        this.bufferPermissionArray[i].userCredentional = user;
      }
    }
  }

  async postData(url = '', sendData: any): Promise<string> {
    const check = sessionStorage.getItem('jhi-authenticationToken');
    let token = `Bearer ${check ? check : ''}`;
    token = token.replace('"', '');
    token = token.replace('"', '');
    const response: any = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(sendData),
    });

    const data: string = await response.text();

    return data;
  }

  confirmAdd(): void {
    const user = this.permissionForm.get(['userCredentional'])!.value;
    if (!user || this.toAddPermission.length === 0) {
      alert('write user credentional or pick row');
    } else {
      if (!this.toAddPermission[0].userCredentional) {
        for (let i = 0; i < this.toAddPermission.length; i++) {
          this.toAddPermission[i].userCredentional = user;
        }
      }
      this.activeModal.close('added');
      this.postData('https://practice.sqilsoft.by/internship/maksim_mikhalkevich/car/api/masters/permissions/user', this.toAddPermission);
    }
  }
}
