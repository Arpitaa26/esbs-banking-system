import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-audit-log-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {
  auditData: any = {};
 customerInfo: any = {};
  userData: any;
  data: any;

  constructor(private router: Router) {
    const state = this.router.getCurrentNavigation()?.extras?.state;
    this.auditData = state?.['auditData'];
    this.customerInfo = state?.['customerInfo'];
   
  }

 
}
