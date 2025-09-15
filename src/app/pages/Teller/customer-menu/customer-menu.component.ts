import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicTableComponent } from "../components/dynamic-table/dynamic-table.component";
import { CommonModalComponent } from '../components/common-modal/common-modal.component';
import { SharedService } from '../../../services/shared.service';
import { ToastrService } from '../../../services/toastr.service';
import { ApiGateWayService } from '../../../services/apiGateway.service';
import * as globals from '../../../globals';

@Component({
  selector: 'app-customer-menu',
  imports: [DynamicTableComponent, CommonModalComponent],
  templateUrl: './customer-menu.component.html',
  styleUrl: './customer-menu.component.scss'
})
export class CustomerMenuComponent {
  itemsPerPage = 10;
  currentPage = 1;
  customerMenuData: any[] = [];
  filteredCustomerMenuData: any[] = [];
  searchValue = '';
  showDeleteModal = false;
  deletedMenuData: any;

  deleteModalButton = [
    { label: 'Cancel', class: 'btn btn-outline', action: 'close', icon: 'bi bi-x-circle' },
    { label: 'Delete', class: 'btn btn-primary', action: 'save', icon: 'bi bi-trash' }
  ];

    tableColumns: { key: string; label: string; type?: 'text' | 'status' | 'action-icon' }[] = [
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description' },
    { key: 'is_default', label: 'Default' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'action', label: 'Actions', type: 'action-icon' }
  ];

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private toastr: ToastrService,
    public apiGatewayService: ApiGateWayService
  ) {}

  ngOnInit(): void {
    this.getCustomerMenuData();
  }

  searchCustomerMenus(searchVal: string) {
    console.log(searchVal);
    this.searchValue = searchVal.trim().toLowerCase();
    if (this.searchValue) {
      this.filteredCustomerMenuData = this.customerMenuData.filter(item =>
        item.title?.toLowerCase().includes(this.searchValue)
      );
      console.log(this.filteredCustomerMenuData);
    } else {
      this.filteredCustomerMenuData = [...this.customerMenuData];
    }
  }

  addMenus() {
    this.router.navigate(['/customer-menu-edit']);
  }

  downloadJSON(): void {
    const dataToDownload = this.filteredCustomerMenuData.length ? this.filteredCustomerMenuData : this.customerMenuData;
    const dataStr = JSON.stringify(dataToDownload, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `customer-menus.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  downloadCSV(): void {
    const dataToDownload = this.filteredCustomerMenuData.length ? this.filteredCustomerMenuData : this.customerMenuData;
    const headers = ['Title', 'Description', 'Default', 'Status'];
    const csvContent = [
      headers.join(','),
      ...dataToDownload.map(item =>
        [item.title, item.description, item.is_default, item.status].map(val => `"${val ?? ''}"`).join(',')
      )
    ].join('\n');

    const dataBlob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `customer-menus.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  getCustomerMenuData() {
    this.apiGatewayService.get(globals.getCustomerMenu).subscribe({
      next: (res) => {
        const actionButton = [
          {
            label: '',
            class: 'action-icon',
            icon: `<i class="bi bi-pencil-square"></i>`,
            callback: (row: any) => this.editMenus(row)
          },
          {
            label: '',
            class: 'action-icon text-danger',
            icon: `<i class="bi bi-trash"></i>`,
            callback: (row: any) => this.deleteMenus(row)
          }
        ];
        this.customerMenuData = res.data.map((item: any) => ({
          ...item,
          status: item.status === 1 ? 'Active' : 'Not Active',
          action: actionButton
        }));
        this.filteredCustomerMenuData = [...this.customerMenuData];
      }
    });
  }

  editMenus(row: any): void {
    row.status = row.status === 'Active';
    this.sharedService.setSharedData(row);
    this.router.navigate(['/customer-menu-edit']);
  }

  deleteMenus(row: any): void {
    this.showDeleteModal = true;
    this.deletedMenuData = row;
  }

  goToPage(page: any): void {
    this.currentPage = page;
  }

  deleteCustomerMenu(data: any) {
    this.apiGatewayService.post(globals.deleteCustomerMenu(data.tel_customer_menu_id), {}).subscribe({
      next: (res) => {
        this.toastr.success(res.message);
        this.getCustomerMenuData();
        this.closeTillModal();
      }
    });
  }

  closeTillModal() {
    this.showDeleteModal = false;
  }

  deleteMenu(data: any) {
    this.deleteCustomerMenu(this.deletedMenuData)
  }
}
