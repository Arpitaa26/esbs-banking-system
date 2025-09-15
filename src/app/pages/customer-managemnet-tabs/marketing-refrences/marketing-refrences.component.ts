import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomerService } from 'app/services/customer.service';
import { Subscription } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-marketing-refrences',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './marketing-refrences.component.html',
  styleUrls: ['./marketing-refrences.component.scss'],
})
export class MarketingRefrencesComponent implements OnInit {
  userData: any;
  private subscription: Subscription | null = null;

  constructor(
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef
  ) {
    this.userData=customerService.userData.data;
    console.log(customerService.getCustomerData);
  }

  ngOnInit() {
    
  }
}
