
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TableComponent } from 'app/components/table/table.component';
import { CustomerService } from 'app/services/customer.service';
@Component({
  selector: 'app-savings-details',
  standalone: true,
  imports: [CommonModule, FormsModule, TableComponent],
  templateUrl: './savings-details.component.html',
  styleUrl: './savings-details.component.scss'
})
export class SavingsDetailsComponent implements OnInit {
  savings: any;
  savingsDetails: any[] = [];
  savingsDetailsOptions: any;
  customerInfo: any;
  constructor(private router: Router, private customerService: CustomerService) {}
  ngOnInit(): void {
    const state = history.state;
    this.savings = state?.savings;
    this.customerInfo = state?.customerInfo;
    console.log('Savings:', this.savings);
    console.log('Customer Info:', this.customerInfo);
    if (this.savings?.transactions?.length) {
      this.savingsDetails = this.savings.transactions;
    }
    this.savingsDetailsOptions = {
      data: this.savingsDetails,
      totalCount: this.savingsDetails.length,
      serverMode: false,
      filteredData: [...this.savingsDetails],
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
  }
}
