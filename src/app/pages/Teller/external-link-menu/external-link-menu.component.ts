import { Component } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { Router } from '@angular/router';
import { ToastrService } from '../../../services/toastr.service';
import { DynamicTableComponent } from '../components/dynamic-table/dynamic-table.component';
import { CommonModule } from '@angular/common';
import { ApiGateWayService } from '../../../services/apiGateway.service';
import * as globals from '../../../globals';

@Component({
  selector: 'app-external-link-menu',
  standalone: true,
  imports: [DynamicTableComponent, CommonModule],
  templateUrl: './external-link-menu.component.html',
  styleUrls: ['./external-link-menu.component.scss']
})
export class ExternalLinkMenuComponent {
  itemsPerPage = 10;
  currentPage = 1;

  filterData: any[] = [];
  externalMenuData: any[] = [];

  tableColumns: { key: string; label: string; type?: 'text' | 'status' | 'action' }[] = [
    { key: 'title', label: 'Title' },
    { key: 'link', label: 'Link' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'action', label: 'Actions', type: 'action' }
  ];

  constructor(
    private router: Router,
    private sharedService: SharedService,
    public apiGatewayService: ApiGateWayService
  ) {}

  ngOnInit(): void {
    this.getExternalLinkData();
  }

  editMenus(row: any, event?: Event): void {
    this.sharedService.setSharedData(row);
    this.router.navigate(['/external-link-menu-add-edit']);
  }

  goToPage(page: any): void {
    this.currentPage = page;
  }

  searchCustomerMenus(searchVal: string) {
    const lower = searchVal.toLowerCase();
    console.log(lower);
    if (!searchVal.trim()) {
      this.filterData = [...this.externalMenuData];
      return;
    }
    this.filterData = this.externalMenuData.filter(item =>
      item.title.toLowerCase().includes(lower) ||
      item.link.toLowerCase().includes(lower) ||
      item.status.toLowerCase().includes(lower)
    );
  }

  addMenus() {
    this.router.navigate(['/external-link-menu-add-edit']);
  }

  downloadJSON() {
    const blob = new Blob([JSON.stringify(this.externalMenuData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'external_links.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  downloadCSV() {
    if (!this.externalMenuData.length) return;
    const headers = Object.keys(this.externalMenuData[0]).filter(key => key !== 'action');
    const csvRows = [
      headers.join(','),
      ...this.externalMenuData.map(row =>
        headers.map(h => `"${(row[h] ?? '').toString().replace(/"/g, '""')}"`).join(',')
      )
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'external_links.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  getExternalLinkData() {
    this.apiGatewayService.get(globals.getExternalLink).subscribe({
      next: (res) => {
        const actionButton = [
          {
            label: 'Edit',
            class: 'action-btn',
            icon: `<i class="bi bi-pencil-square"></i>`,
            callback: (row: any) => this.editMenus(row, new Event('click'))
          }
        ];
        this.filterData = res.data.external_links.map((item: any) => ({
          ...item,
          status: item.status === 1 ? 'Active' : 'Not Active',
          action: actionButton
        }));
        this.externalMenuData = [...this.filterData];
      }
    });
  }
}
