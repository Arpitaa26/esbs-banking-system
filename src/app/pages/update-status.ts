import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'add-sub-product-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="modal-header ps-3 py-2 text-light" style="background:linear-gradient(135deg, #041643, #3E5ADF);">
      <h4 class="modal-title">Update Status</h4>
      <button type="button" class="btn-close btn-close-white" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <div class="mb-3">
        <label class="form-label fw-bold" style="color:#1e3488;" >State Status</label>
        <input class="modal-input"
       [(ngModel)]="updateStatus"
       (input)="emptyStatus = false"
       style="padding: 8px 8px; width: 100%; border: 2px solid #1e3488; border-radius: 7px;"
       placeholder="Enter Status" />
        <label class="fw-6 text-danger" *ngIf="emptyStatus">Please enter status</label>
      </div>
      <div class="mb-3">
      <p style="color:gray;font-size:smaller;">Note: Please enter the correct status after consulting with Consectus Team, incorrect status with spelling issue will cause issue on customer’s app/online.</p>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-sm btn-danger" (click)="activeModal.dismiss()">Cancel</button>
      <button type="button" class="btn btn-sm text-light" style="background:linear-gradient(135deg, #041643, #3E5ADF);" (click)="UpdateStatus()">
        Update Status
      </button>
    </div>
  `,
})
export class UpdateStatusModal {
    activeModal = inject(NgbActiveModal);
    id!: number;
    updateStatus: any = "";
    emptyStatus: boolean = false;

    UpdateStatus() {
        try {
            if (this.updateStatus.trim()) {
                this.activeModal.close({
                    new_status: this.updateStatus,
                    id: this.id
                });
            } else {
                this.emptyStatus = true;
            }
        } catch (error) {
            console.log("error ===>", error);
        }
    }
}