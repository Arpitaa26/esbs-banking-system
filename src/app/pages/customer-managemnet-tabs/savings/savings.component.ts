import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CustomerService } from 'app/services/customer.service';
import { Subscription } from 'rxjs';
import { TableComponent } from 'app/components/table/table.component';

@Component({
  selector: 'app-savings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TableComponent],
  templateUrl: './savings.component.html',
  styleUrl: './savings.component.scss'
})
export class SavingsComponent  {
  showModal = false;
  data: any;
  selectedAccount: any = null;
  userData: any;
 savings: any;
 currSavings: any = null;
 customerInfo: any;

 savingsDetailsOptions: any = {};

private subscription: Subscription | null = null;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef,
  ) {

  }

  ngOnInit(): void {
    this.data = this.customerService.userData?.data;

    console.log('Customer Data:', this.data);
    this.savings = this.data?.savings || [];
  }
   onAccountChange(account: any) {
      if(account) {
    this.selectedAccount = account;
    this.currSavings = this.selectedAccount,
    this.customerInfo =  this.data?.customer_data,
    this.showModal = true;

    this.savingsDetailsOptions = {
      data: this.currSavings.transactions,
      totalCount: this.currSavings.transactions.length,
      serverMode: false,
      filteredData: [...this.currSavings.transactions],
      pagination: true,
      search: true,
      filter: '',
      select: true,
      pageSize: 12,
      columns: {
        transactionDate: { title: 'Transaction Date', search: true },
        value: { title: 'Amount', search: true },
        narrative: { title: 'Narrative', search: true },
        runningBalance: { title: 'Balance', search: true }
      },
      download: true,
      rowActions: [],
      allActions: [],
      selectedActions: [],
      button1: { buttonTitle: '', buttonAction: null },
      button2: { buttonTitle: '', buttonAction: null },
      add: { addActionTitle: '', addAction: null },
      uploadOptions: {},
      loading: false
    };
    this.cdr.detectChanges();
  }
}
  closeModal() {
    this.showModal = false;
  }
  confirmSelection() {

    this.closeModal();
    // console.log('Going to route with:', this.selectedAccount, this.data?.customer_data);
    //  if (this.selectedAccount) {
    //   this.router.navigate(['savings-details'], {
    //     relativeTo: this.route,
    //     state: {
    //       allSavings: this.savings,
    //       savings:this.selectedAccount,
    //       customerInfo: this.data?.customer_data,
    //     }

    //   });
    // }
  }
  isChildRouteActive(): boolean {
    return this.router.url.includes('savings/savings-details');
  }

}
