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
    selector: 'app-product-application-details',
    imports: [TableComponent, CommonModule, FormsModule],
    templateUrl: './product-application-details.component.html',
    styleUrl: './product-application-details.component.scss'
})
export class ProductApplicationDetailsComponent {
    user: any = {};
    curTab: string = '';
    new_onbording_Options: any = {
        data: [],
        filteredData: [],
        columns: {
            "create_date": { title: "Date", format: "date" },
            "trail_details": { title: "Trail Details" },
        },
        pagination: true,
        filter: null,
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
        uploadOptions: {},
    };
    blockedMap: any = {
        "New Existing Found Active Blocked": "New Existing Found Active",
        "Otp Attempts Fail": "New TermsandConditions",
        "New Customer Found Active Blocked": "New Customer Found Active",
        "New Customer Found Existing Blocked": "New Customer Found Existing",
        "New Existing Found Existing Registration Blocked":
            "New Existing Found Existing Registration",
        "New Customer Found Existing Registration Blocked":
            "New Customer Found Existing Registration",
        "New Existing Found Existing Blocked": "New Existing Found Existing",
        "New Customer Mailer Input Blocked": "New Customer Mailer Input",
    };
    constructor(
        private router: Router,
        private apiService: ApiGateWayService,
        private cdr: ChangeDetectorRef,
        private alertService: AlertService,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private gps: GlobalProviderService
    ) {
        const data = this.router.getCurrentNavigation()?.extras?.state?.['userData'];
        this.curTab = this.router.getCurrentNavigation()?.extras?.state?.['tab'];
        this.user = data || {};
        this.getNewAuditLogs();
        this.getLetters();
    }

    back() {
        this.router.navigate(['/product-application'], { state: { tab: this.curTab } });
    }

    getNewAuditLogs() {
        try {
            let message = `Viewed ${this.user.accountholdername} in New Account Page`;
            let auditData = {
                users_id: this.user.new_accounts_id || this.user.product_application_id,
                customer_devices_id: 0,
                usertype: this.user.product_application_id ? "ECAO" : "newaccount",
                uuid: "",
                appname: "hub",
                event_type: "add",
                screen: "new-account-view",
                trail_details: message,
            };

            this.apiService.post(globals.getnewaccountaudits, auditData).subscribe({
                next: (res) => {
                    this.new_onbording_Options.data = res.message;
                    this.new_onbording_Options = { ...this.new_onbording_Options };
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
                    this.toastr.success(`Status updated successfully!`);
                    this.router.navigate(['/product-application']);
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
                    if (response.status) this.router.navigate(['/product-application']);
                },
                error: (error) => {
                    console.error("error@==#", error);
                }
            })
        } catch (error) {
            console.error("<==Err==>", error)
        }
    }
    approveVerification(status: string) {
        const st = "New Customer Document Verification Approved";
        this.showAlert("Confirm", "Are you sure you want to update the status of this customer?", "Update", (data: any) => this.confirmUpdate(data, st));
        // this.user.state_status = "New Customer Document Verification Approved";
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
            let old_status = this.user.state_status;
            let payload = { new_accounts_id: this.user.new_accounts_id, state_status: this.blockedMap[this.user.state_status] }
            this.apiService.post(globals.blockUnblockNewOnboardingCust, payload).subscribe({
                next: (response: any) => {
                    this.UpDateLoadAudit(old_status, this.blockedMap[this.user.state_status]);
                    this.toastr.success(`Status updated successfully!`);
                    if (response.status) this.router.navigate(['/product-application']);
                },
                error: (error) => {
                    console.error("error@==#", error);
                }
            })
        } catch (error) {
            console.error("<==Err==>", error)
        }
    }
    ApproveNBA() {
        try {
            this.showAlert("Confirm", "Are you sure want to approve NBA?", "Approve", (data: any) => this.approveNBADoc('NBA Verification approved by branch'));
        } catch (error) {
            console.error("error>>>>", error)
        }
    }
    approveNBADoc(status: string) {
        try {
            let old_status = this.user.state_status;
            let payload = { new_accounts_id: this.user.new_accounts_id, status: status }
            this.apiService.post(globals.updateCustAppStatus, payload).subscribe({
                next: (response: any) => {
                    this.UpDateLoadAudit(old_status, status);
                    this.toastr.success(`Status updated successfully!`);
                    this.router.navigate(['/product-application']);
                },
                error: (err) => {
                    console.error('Update Status API Error:', err);
                }
            });
        } catch (error) {
            console.error("error=>=>", error);
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
                    this.new_onbording_Options.data = res.message;
                    this.new_onbording_Options = { ...this.new_onbording_Options };
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
