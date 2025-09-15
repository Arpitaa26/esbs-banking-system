import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TableComponent } from 'app/components/table/table.component';
import * as globals from '../../../globals';
import { ApiGateWayService } from 'app/services/apiGateway.service';
import { AlertService } from 'app/services/alert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateStatusModal } from 'app/pages/update-status';
import { ToastrService } from 'app/services/toastr.service';
import { GlobalProviderService } from 'app/services/global-provider.service';
@Component({
  selector: 'app-existing-onboarding-customer-detail',
  imports: [TableComponent, CommonModule, FormsModule],
  templateUrl: './existing-onboarding-customer-detail.component.html',
  styleUrl: './existing-onboarding-customer-detail.component.scss'
})
export class ExistingOnboardingCustomerDetailComponent {
  user: any = {};
  curTab: string = '';
  existing_onbording_Options: any = {
    data: [],
    filteredData: [],
    columns: {
      "create_date": { title: "Date", format: "date" },
      "trail_details": { title: "Trail Details" },
    },
    pagination: true,
    fitler: null,
    search: false,
    select: false,
    download: true,
    btnSize: "small",
    pageSize: 10,
    rowClass: "table-row",
    add: {
      addActionTitle: "",
      addAction: null,
    },
    rowActions: [],
    columnClass: "table-column",
    // tapRow: this.showUser.bind(this),
    resetFilter: null,
    uploadOptions: {
    },
  };
  statusMap: any = {
    "Active Blocked": "Active",
    Blocked: "Active",
    "Otp Attempts Fail": "New TermsandConditions",
    "Existing Mailer Blocked": "Existing Mailer",
    "Active PIN Verification Blocked": "Active PIN Verification",
    "Existing Active PIN Verification Blocked": "Existing Active PIN Verification",
    "Existing Registration Blocked": "Existing Registration",
    "Existing Passcode Blocked": "Existing Enter Mobile Number",
    "New Existing Blocked": "New Existing Enter Mobile Number",
    "Existing Blocked": "Existing Enter Mobile Number",
    "Existing Found Active Blocked": "Existing Found Active",
    "New Existing Found Active Blocked": "New Existing Found Active",
    "New Existing Found Existing Registration Blocked": "New Existing Found Existing Registration",
    "New Customer Found Existing Registration Blocked": "New Customer Found Existing Registration",
    "New Existing Found Existing Blocked": "New Existing Found Existing",
  }
  constructor(
    private router: Router,
    private apiService: ApiGateWayService,
    private cdr: ChangeDetectorRef,
    private alertService: AlertService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    public gps: GlobalProviderService
  ) {
    let data = this.router.getCurrentNavigation()?.extras?.state?.['userData'];
    this.curTab = this.router.getCurrentNavigation()?.extras?.state?.['tab'];

    if (!data) {
      this.user = {};
    } else {
      this.user = data;
    }
    this.getexistingAuditLogs();
    this.getLetters();
  }
  back() {
    this.router.navigate(['/existing-customer-onboarding'], { state: { tab: this.curTab } });
  }
  save() { }

  getexistingAuditLogs() {
    try {
      let message = `Viewed ${this.user.accountholdername} in Existing Account Detail Page`;
      let auditData = {
        users_id: this.user.new_accounts_id || this.user.product_application_id,
        customer_devices_id: 0,
        usertype: this.user.product_application_id ? "ECAO" : "newaccount",
        uuid: "",
        appname: "hub",
        event_type: "add",
        screen: "existing-account-detail-view",
        trail_details: message,
      };
      this.apiService.post(globals.getnewaccountaudits, auditData).subscribe({
        next: (res) => {
          this.existing_onbording_Options.data = res.message;
          this.existing_onbording_Options = { ...this.existing_onbording_Options };
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(`Load failed:`, err);
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  async updateStatus() {
    try {
      const modalRef = this.modalService.open(UpdateStatusModal);
      modalRef.componentInstance.id = this.user.new_accounts_id || this.user.product_application_id;
      const result = await modalRef.result;
      if (result?.new_status) {
        this.showAlert("Confirm", "Are you sure you want to update the status of this customer?", "Update", (data: any) => this.confirmUpdate(data, result.new_status));
      }
    } catch (error) {
      console.log('Modal dismissed or error:', error);
    }
  }

  showAlert(title: string, msg: string, btnName: string, handler: Function) {
    try {
      this.alertService.show({
        title: title,
        message: msg,
        buttons: [
          { text: 'Cancel', role: 'cancel', cssClass: 'bg-danger' },
          { text: btnName, role: 'destructive', cssClass: 'bg-success', handler: (data: any) => handler(data), }
        ],
        enableBackdropDismiss: true
      });
    } catch (error) {
      console.error("AlertError", error);
    }
  }

  confirmUpdate(data: any, status: any) {
    try {
      let old_status = this.user.state_status;
      let payload = { new_accounts_id: this.user.new_accounts_id, status: status }
      this.apiService.post(globals.updateCustAppStatus, payload).subscribe({
        next: (response: any) => {
          this.UpDateLoadAudit(old_status, status);
          this.toastr.success(`Status Updated successfully!`);
          this.router.navigate(['/existing-customer-onboarding']);
        },
        error: (err) => {
          console.error('Update Status API Error:', err);
        }
      });
    } catch (error) {
      console.error("error=>=>", error);
    }
  }
  approveApplication(status: string) {
    try {
      this.showAlert("Confirm", "Are you sure want to approve the documents?", "Approve", (data: any) => this.approveDoc("", status));
    } catch (error) {
      console.error("error>>>>", error)
    }
  }
  approveExistingAppliction(status: string) {
    try {
      this.showAlert("Confirm", "Are you sure want to approve the documents?", "Approve", (data: any) => this.confirmUpdate("", status));
    } catch (error) {
      console.error("error<========>", error)
    }
  }
  approveDoc(data: any, status: string) {
    try {
      this.apiService.post(globals.approveDoc, { new_accounts_id: this.user.new_accounts_id, status: status, mode: "HUB" }).subscribe({
        next: (response: any) => {
          this.toastr.success(`Status Updated successfully!`);
          if (response.status) this.router.navigate(['/existing-customer-onboarding']);
        },
        error: (error) => {
          console.error("error@==#", error);
        }
      })
    } catch (error) {
      console.error("<==Err==>", error)
    }
  }
  DownloadPdf(user: any) {
    try {
      let binary = atob(user?.generated_letter.replace(/\s/g, ""));
      let len = binary.length;
      let buffer = new ArrayBuffer(len);
      let view = new Uint8Array(buffer);
      let j: any;
      for (j = 0; j < len; j++) {
        view[j] = binary.charCodeAt(j);
      }
      let url = URL.createObjectURL(
        new Blob([view], { type: "application/pdf" })
      );
      window.open(url);
    } catch (error) {
      console.error("Error,,,,,,>", error)
    }
  }
  getLetters() {
    try {
      this.apiService.post(globals.getcustomerLetter, { "new_accounts_id": this.user.new_accounts_id }).subscribe({
        next: (response: any) => {
          this.user.generated_letter = response.generated_letter;
        },
        error: (error) => {
          console.error("error*****", error)
        }
      })
    } catch (error) {
      console.error(error, "<======new_error")
    }
  }
  Unblock(status: string, mode: string) {
    try {
      this.showAlert("Confirm", "Are you sure want to approve Unblock?", "Approve", (data: any) => this.approveBLocked(status));
    } catch (error) {
      console.error("error>>>>", error)
    }
  }
  approveBLocked(status: string) {
    try {
      let payload = { new_accounts_id: this.user.new_accounts_id, state_status: this.statusMap[this.user.state_status] }
      this.apiService.post(globals.blockUnblockExistingOnboardingCust, payload).subscribe({
        next: (response: any) => {
          this.toastr.success(`Status Updated successfully!`);
          if (response.status) this.router.navigate(['/existing-customer-onboarding']);
        },
        error: (error) => {
          console.error("error@==#", error);
        }
      })
    } catch (error) {
      console.error("<==Err==>", error)
    }
  }

  UpDateLoadAudit(old_status: string, new_status: string) {
    try {
      let message = "Customer Status Updated by " + this.gps.usersName + " From " + old_status + " to " + new_status;
      let auditData = {
        users_id: this.user.new_accounts_id || this.user.product_application_id,
        customer_devices_id: 0,
        usertype: "newaccount",
        uuid: "",
        appname: "hub",
        event_type: "update",
        screen: "new-onboarding-view",
        trail_details: message,
      };
      this.apiService.post(globals.loadAudit, auditData).subscribe({
        next: (res) => {
          this.existing_onbording_Options.data = res.message;
          this.existing_onbording_Options = { ...this.existing_onbording_Options };
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(`Load failed:`, err);
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
}
