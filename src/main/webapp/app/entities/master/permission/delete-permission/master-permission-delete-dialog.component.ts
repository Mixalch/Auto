import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IMaster } from '../../master.model';
import { MasterService } from '../../service/master.service';

class MasterPermission {
  entityId?: number;
  permission?: string;
  userCredentional?: string;
}

@Component({
  templateUrl: './master-permission-delete-dialog.component.html',
  selector: 'jhi-master',
})
export class MasterPermissionDeleteDialogComponent {
  masters?: IMaster[];
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

  selectPermission(e: any): void {
    this.permission = e.target.value;
  }

  deletePermission(): void {
    if (!this.permissionForm.get(['entityId'])?.value || !this.permissionForm.get(['userCredentional'])?.value) {
      alert('fill all fields');
    } else {
      const deletedPermission: MasterPermission = {
        entityId: this.permissionForm.get(['entityId'])?.value,
        permission: this.permission ? this.permission : 'WRITE',
        userCredentional: this.permissionForm.get(['userCredentional'])?.value,
      };

      console.log(
        this.postData(
          'https://practice.sqilsoft.by/internship/maksim_mikhalkevich/car/api/masters/delete-permission/user',
          deletedPermission
        )
      );
      this.activeModal.close('deleted');
    }
  }
}
