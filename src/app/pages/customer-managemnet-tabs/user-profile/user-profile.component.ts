import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from 'app/services/customer.service';
import { GlobalProviderService } from 'app/services/global-provider.service';
import { Subscription } from 'rxjs';
import { ApiGateWayService } from 'app/services/apiGateway.service';
import * as globals from 'app/globals';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  userData: any = null;
  subscription: Subscription | null = null;

  showModal = false;
  actionMode: 'block' | 'activate' = 'block';
  reason = '';
  message = '';
  deleteReason = '';
  hasData = true;

  showDeleteModal = false;
  deleteMessage = '';

  constructor(
    private gps: GlobalProviderService,
    public customerService: CustomerService,
    private api: ApiGateWayService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.subscription = this.customerService.customerdata$.subscribe((cust_data: any) => {
      if (!cust_data || !cust_data.data) {
        this.userData = null;
        this.hasData = false;
      } else if (cust_data.data.customer_data) {
        this.userData = cust_data.data.customer_data;
        this.hasData = true;
      } else {
        this.userData = cust_data.data;
        this.hasData = true;
      }
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  openBlockModal(): void {
    this.actionMode = this.isBlocked() ? 'activate' : 'block';
    this.reason = '';
    this.message = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  confirmAction(): void {
    
     let customer = this.userData?.customer_data || this.userData;
    if (!customer) {
      this.message = 'Customer data not available';
      return;
    }

    if (this.actionMode === 'block' && !this.reason.trim()) {
      this.message = 'Please enter the reason to block.';
      return;
    }

    let payload = {
      customers_id: customer.customers_id,
      emailid: customer.emailid,
      fullname: customer.fullname,
      memberid: customer.memberid,
      mobileno: customer.mobileno,
      mode: this.actionMode === 'block' ? '0' : '1',
      reason: this.actionMode === 'block' ? this.reason : 'Activate mobile access',
      username: this.gps.usersName
    };

    

    this.api.post(globals.updateCustomerStatusApiEndpoint, payload).subscribe({
      next: (res) => {
        this.message = '';
        this.closeModal();
       

        if (this.userData?.customer_data) {
          this.userData.customer_data.customer_status = this.actionMode === 'block' ? 'Blocked' : 'Active';
        } else {
          this.userData.customer_status = this.actionMode === 'block' ? 'Blocked' : 'Active';
        }

        this.cdr.detectChanges();
      },
      error: () => {
        this.message = 'Something went wrong';
      }
    });
  }

  isBlocked(): boolean {
    return (
      this.userData?.customer_data?.customer_status === 'Blocked' ||
      this.userData?.customer_status === 'Blocked'
    );
  }
    isActive(): boolean {
    return (
      this.userData?.customer_data?.customer_status === 'Active' ||
      this.userData?.customer_status === 'Active '
    );
  }


  openDeleteModal(): void {
    this.deleteMessage = '';
    this.deleteReason = '';
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  confirmDelete(): void {
    let customer = this.userData?.customer_data;

    if (!customer) {
      this.deleteMessage = 'Customer data not available';
      return;
    }

    if (!this.deleteReason.trim()) {
      this.deleteMessage = 'Please provide a reason before deleting.';
      return;
    }

    const payload = {
      customers_id: customer.customers_id,
      emailid: customer.emailid,
      fullname: customer.fullname,
      memberid: customer.memberid,
      mobileno: customer.mobileno || '',
      username: this.gps.usersName
    };
    this.api.post(globals.deleteCustomerByReferencenApiEndpoint, payload).subscribe({
      next: (res) => {
        this.showDeleteModal = false;
        alert('Customer deleted successfully!');
        this.userData = null;
        this.customerService.clearCustomerData();
        this.cdr.detectChanges();
      },
      error: () => {
        this.deleteMessage = 'Something went wrong while deleting';
      }
    });
  }
}
