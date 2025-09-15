import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiGateWayService } from 'app/services/apiGateway.service';
import * as globals from '../../globals';
import { CustomerService } from 'app/services/customer.service';

@Component({
  selector: 'app-customer-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './customer-management.component.html',
  styleUrl: './customer-management.component.scss'
})
export class CustomerManagementComponent {
  searchValue: string = '';
  referenceValue: string = '';
  showResult: boolean = false;

  constructor(
    private router: Router,
    private api: ApiGateWayService,
    private customerService: CustomerService
  ) { this.customerService.clearCustomerData(); }

  /** ---------------- Email or Mobile Search ---------------- */
  searchCustomer(): void {
    const value = this.searchValue.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    if (!value || (!emailRegex.test(value) && (!phoneRegex.test(value) && value.length > 14))) {
      alert('Please enter a valid Email or Mobile Number');
      this.showResult = false;
      this.customerService.clearCustomerData(); 
      return;
    }
    const payload = { search: value };
    this.api.post(globals.customerSearchApiEndpoint, payload).subscribe({
      next: (response: any) => {
        if (!response?.data?.customer_data) {
          alert('Customer not found!');  
          this.customerService.clearCustomerData();
          this.showResult = false;
          return;      
        }
        this.customerService.sendCustomerData(response);
        this.showResult = true;
        this.router.navigate(['customer-management', 'tabs', 'user-profile']);
        this.scrollToResult();
      },
      error: (err) => {
        console.error('SearchCustomer API Error:', err);
        this.customerService.clearCustomerData();
        this.showResult = false;
        return;
      }
    });
  }

  searchReference(): void {
    if (!this.isValidReference()) {
      alert('Please enter a valid Phoebus Reference Number');
      this.showResult = false;
      this.customerService.clearCustomerData(); 
      return;
      
    }

    const payload = { soprarefno: this.referenceValue.trim() };

    this.api.post(globals.customerSearchApiEndpoint, payload).subscribe({
      next: (response: any) => {
        if (!response?.data?.customer_data) {
          alert('Customer not found!'); 
          this.customerService.clearCustomerData();
          this.showResult = false;
           return;    
        }
        this.customerService.sendCustomerData(response);
        this.showResult = true;
        this.router.navigate(['customer-management', 'tabs', 'user-profile']);
        this.scrollToResult();
      },
      error: (err) => {
        console.error('Reference Search Error:', err);
        this.customerService.clearCustomerData();
        this.showResult = false;
        return;
      }
    });
  }

  /** ---------------- Input Validation ---------------- */
  isValidReference(): boolean {
    return this.referenceValue.trim().length > 0;
  }

  /** ---------------- Scroll to Result ---------------- */
  private scrollToResult(): void {
    setTimeout(() => {
      const section = document.getElementById('result-section');
      section?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }
}
