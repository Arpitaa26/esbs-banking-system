import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiGateWayService } from 'app/services/apiGateway.service';
import * as globals from 'app/globals';
import { GlobalProviderService } from 'app/services/global-provider.service';
import { ToastrService } from 'app/services/toastr.service';

@Component({
  selector: 'app-add-update-sms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-update-sms.component.html',
  styleUrl: './add-update-sms.component.scss'
})
export class AddUpdateSmsComponent {
  @ViewChild('typeCtrl') typeCtrl!: NgModel;
  @ViewChild('purposeCtrl') purposeCtrl!: NgModel;
  @ViewChild('msgCtrl') msgCtrl!: NgModel;

  sms: any = { type: '', purpose: '', msg: '' };
  isNew: boolean = true;
  isBusy: boolean = false;
  clickOnSave: boolean = false;
  isFieldsValid: any = { type: true, purpose: true, msg: true };

  constructor(
    private router: Router,
    private api: ApiGateWayService,
    private gps: GlobalProviderService,
    private toastr: ToastrService
  ) {
    const state = this.router.getCurrentNavigation()?.extras?.state;
    if (state?.['smsData']) {
      this.isNew = false;
      this.sms = { ...state['smsData'] };
    }
  }

  back() {
    this.router.navigate(['/app-settings'], { state: { tab: 'sms' } });
  }

  changeValidity(field: string) {
    this.isFieldsValid[field] = true;
  }

  save() {
    this.clickOnSave = true;
    this.isFieldsValid.type = true;
    this.isFieldsValid.purpose = true;
    this.isFieldsValid.msg = true;

    if (!this.runValidations()) return;

    const payload: any = {
      type: this.sms.type.trim(),
      purpose: this.sms.purpose.trim(),
      msg: this.sms.msg.trim()
    };

    if (this.isNew) {
      payload.createdby = this.gps.usersID;
      payload.created_date = new Date().toISOString();
    } else {
      payload.sms_messages_id = this.sms.sms_messages_id;
      payload.modifiedby = this.gps.usersID;
      payload.modified_date = new Date().toISOString();
    }

    const endpoint = this.isNew
      ? globals.createSmsMessageEndpoint
      : globals.updateSmsMessageEndpoint;

    this.isBusy = true;
    this.api.post(endpoint, payload).subscribe({
      next: () => {
        this.isBusy = false;
        this.toastr.success(`SMS ${this.isNew ? 'created' : 'updated'} successfully!`);
        this.back();
      },
      error: (err) => {
        this.isBusy = false;
        console.error('SMS Save Error:', err);
        this.toastr.error('Failed to save SMS. Please try again.');
      }
    });
  }

private runValidations(): boolean {
  
  this.isFieldsValid.type = true;
  this.isFieldsValid.purpose = true;
  this.isFieldsValid.msg = true;

  
  if (!this.sms.type || !this.sms.type.trim()) {
    this.isFieldsValid.type = false;
    this.toastr.error('Subject is required.');
    return false; 
  }

  
  if (!this.sms.purpose || !this.sms.purpose.trim()) {
    this.isFieldsValid.purpose = false;
    this.toastr.error('Purpose is required.');
    return false;
  }

  
  if (!this.sms.msg || !this.sms.msg.trim()) {
    this.isFieldsValid.msg = false;
    this.toastr.error('Message is required.');
    return false;
  }

  
  return true;
}

}
