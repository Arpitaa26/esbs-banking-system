import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TableComponent } from 'app/components/table/table.component';
import { CustomerService } from 'app/services/customer.service'; 

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, TableComponent, FormsModule, RouterModule],
  templateUrl: './audit-logs.component.html',
  styleUrl: './audit-logs.component.scss'
})
export class AuditLogsComponent implements OnInit {
  auditLogs: any[] = [];
  data: any;

  auditLogOptions: any;
    userData: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    
    this.data = this.customerService.userData?.data;

    console.log('Customer Data:', this.data);
    this.auditLogs = this.data?.audit_logs || [];

    this.auditLogOptions = {
      data: this.auditLogs,
      totalCount: this.auditLogs.length,
      serverMode: false,
      filteredData: [...this.auditLogs],
      pagination: true,
      search: false,
      filter: '',
      select: false,
      download: false,
      pageSize: 5,
      columns: {
        appname: { title: 'App Name', search: true },
        event_type: { title: 'Event Type', search: true },
        screen: { title: 'Screen Name', search: true },
        trail_details: { title: 'Trail Details', search: true },
        create_date: { title: 'Date', search: true },
        devicetype: { title: 'Device Type', search: true },
        uuid: { title: 'UUID', search: true }
      },
      tapRow: this.viewAuditTrail.bind(this),
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

  viewAuditTrail(row: any) {
    this.router.navigate(['details'], {
      relativeTo: this.route,
      state: {
        auditData: row,
        customerInfo: this.data.customer_data

      }
    });
  }

  isChildRouteActive(): boolean {
    return this.router.url.includes('audit-logs/details');
  }
}
