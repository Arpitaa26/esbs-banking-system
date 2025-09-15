import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AlertService } from 'app/services/alert.service';
import { ApiGateWayService } from 'app/services/apiGateway.service';
import * as globals from '../../globals'

@Component({
  selector: 'app-delete-customer',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './delete-customer.component.html',
  styleUrl: './delete-customer.component.scss'
})
export class DeleteCustomerComponent {
  searchValue: string = '';
  referenceValue: string = '';
  showResult: boolean = false;

  constructor(
    private router: Router,
    private api: ApiGateWayService,
    private alertService: AlertService
  ) { }

  searchCustomer() {
    const value = this.searchValue.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (emailRegex.test(value) || phoneRegex.test(value)) {
      this.showResult = true;
      this.router.navigate(['customer-management', 'tabs', 'user-profile']);
      this.scrollToResult();
    } else {
      alert('Please enter valid details (Email or 10-digit Mobile Number)');
      this.showResult = false;
    }
  }

  onReferenceInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const digitsOnly = input.value.replace(/\D/g, '');
    this.referenceValue = digitsOnly;
  }

  isValidReference(): boolean {
    return this.referenceValue.length > 0;
  }

  searchReference() {
    if (this.isValidReference()) {
      this.showResult = true;
      this.router.navigate(['customer-management', 'tabs', 'user-profile']);
      this.scrollToResult();
    } else {
      alert('Please enter a valid number');
      this.showResult = false;
    }
  }

  private scrollToResult() {
    setTimeout(() => {
      const section = document.getElementById('result-section');
      section?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  deleteCustomer() {
    try {
      const value = this.searchValue.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      // const phoneRegex = /^[0-9]{10}$/;
      // if (!value || (!emailRegex.test(value) && !phoneRegex.test(value))) {
      //   alert('Please enter valid Email or 10-digit Mobile Number');
      //   this.showResult = false;
      //   return;
      // }
      this.alertService.show({
        title: "Delete Customer",
        message: "Would you like to Delete this customer ?",
        inputs: [
          { name: 'note', type: 'textarea', label: 'Reason', placeholder: 'Why?' }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Delete',
            role: 'destructive',
            handler: (data: any) => this.delete(data)
          }
        ],
        enableBackdropDismiss: true
      });

    } catch (error) {
      console.log(error);
    }
  }
  delete(data: any) {
    try {
      let payload = { 'customer': this.searchValue.trim() };
      this.api.post(globals.deleteCustomerApiEndpoint, payload).subscribe({
        next: (response: any) => {
          this.alertService.show({
            title: "Deleted Sucessfull",
            message: response.message,
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
              }
            ],
            enableBackdropDismiss: true
          });
        },
        error: (err) => {
          console.error('SearchCustomer API Error:', err);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
}
