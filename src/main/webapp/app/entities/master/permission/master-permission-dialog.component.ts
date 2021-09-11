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
  selectedMasters: number[];

  permissionForm = this.fb.group({
    userCredentional: '',
    permissions: [],
    masterName: '',
  });

  constructor(protected masterService: MasterService, protected activeModal: NgbActiveModal, protected fb: FormBuilder) {
    (this.bufferPermissionArray = []), (this.selectedMasters = []), (this.toAddPermission = []);
  }

  cancel(): void {
    this.activeModal.dismiss();
  }

  check(masterId: number, isChecked: any): void {
    const user = this.permissionForm.get(['userCredentional'])!.value;
    if (masterId === 0 && isChecked.checked) {
      const bookPermission: MasterPermission = {
        entityId: masterId,
        permission: 'CREATE',
        userCredentional: user,
      };
      this.bufferPermissionArray.push(bookPermission);
    } else if (masterId === 0) {
      console.log(masterId);
      this.bufferPermissionArray = this.bufferPermissionArray.filter(value => value.entityId !== masterId);
    } else if (isChecked.checked) {
      this.selectedMasters.push(masterId);
    } else {
      this.selectedMasters = this.selectedMasters.filter(value => value !== masterId);
      this.bufferPermissionArray = this.bufferPermissionArray.filter(value => value.entityId !== masterId);
    }
  }

  addAction(masterId: number): void {
    const selectedPermissions: string[] = this.permissionForm.get(['permissions'])!.value;
    const user = this.permissionForm.get(['userCredentional'])!.value;
    const newPermissions: MasterPermission[] = [];
    selectedPermissions.map(value => {
      const masterPermission: MasterPermission = {
        entityId: masterId,
        permission: value,
        userCredentional: user,
      };
      newPermissions.push(masterPermission);
    });
    const bufferArray = this.bufferPermissionArray.filter(value => value.entityId !== masterId);
    const concatedArray = bufferArray.concat(newPermissions);
    this.bufferPermissionArray = concatedArray;
  }

  getMasters(): IMaster[] {
    const masterName: string = this.permissionForm.get(['masterName'])!.value;
    return this.masters!.filter(value => value.name!.toLowerCase().indexOf(masterName.toLowerCase()) !== -1);
  }

  showPermissions(masterId: number): any {
    const permission: number[] = this.selectedMasters.filter(value => value === masterId);
    if (permission.length > 0) {
      return true;
    }
  }

  showAddPermissionsButton(): any {
    if (this.bufferPermissionArray.length === 0) {
      return true;
    }
  }

  checkUserCredentional(): any {
    return this.permissionForm.get(['userCredentional'])!.value;
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
    if (!user) {
      this.bufferPermissionArray.length = 0;
      this.selectedMasters.length = 0;
      alert('write user name or role');
    } else {
      this.postData('http://localhost:8080/api/masters/permissions/user', this.bufferPermissionArray);
      this.activeModal.close('added');
    }
  }
}
