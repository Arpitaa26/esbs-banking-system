import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiGateWayService } from '../../../services/apiGateway.service';
import * as globals from '../../../globals';
import { DynamicTableComponent } from "../components/dynamic-table/dynamic-table.component";
import { SharedService } from '../../../services/shared.service';
import { ToastrService } from '../../../services/toastr.service';

export interface StaffEntry {
  user_id: number;
  full_name: string;
  email: string;
  role: string;
  is_active: number;
  selected?: boolean;
}

@Component({
  selector: 'app-staff-user-management',
  imports: [CommonModule, FormsModule, DynamicTableComponent],
  templateUrl: './staff-user-management.component.html',
  styleUrl: './staff-user-management.component.scss'
})
export class StaffUserManagementComponent {
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  showAddStaffModal: boolean = false;
  activeTab: string = 'active';

  tableColumns: { key: string; label: string; type?: 'text' | 'status' | 'action' }[] = [
    { key: 'full_name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'roleNames', label: 'Role' },
    { key: 'status', label: 'Status', type: 'status' }
  ];

  tabs = [
    { name: 'Active Staff', value: 'active', active: true },
    { name: 'Archive Staff', value: 'archived', active: false }
  ];

  staffList: StaffEntry[] = [];
  userRole: any;

  constructor(
    private router: Router,
    private apiGatewayService: ApiGateWayService,
    private sharedService: SharedService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getUserList();
  }

  getUserList() {
    this.apiGatewayService.get(globals.getUserEndPoint)
      .subscribe({
        next: (res) => {
          this.staffList = res.data.map((user: any) => ({
            ...user,
            status: user.is_active ? 'Active' : 'Inactive',
            roleNames: Array.isArray(user.roles)
              ? user.roles.map((r: any) => r.name).join(', ')
              : 'No Role',
            roleIds: Array.isArray(user.roles)
              ? user.roles.map((r: any) => r.id)
              : []
          }));
        }
      });
  }

  searchUsers(searchTerm: string): void {
    const lowerSearch = searchTerm.toLowerCase();

    if (!lowerSearch.trim()) {
      this.getUserList();
      return;
    }

    const filteredUsers = this.staffList.filter((user: any) =>
      user.full_name.toLowerCase().includes(lowerSearch) ||
      user.email.toLowerCase().includes(lowerSearch)
    );

    this.staffList = filteredUsers;
  }


  onRowClicked(row: any) {
    this.sharedService.setUserData(row);
    this.router.navigate(
      ['/staff-user-details'],
      { queryParams: { user_id: row.user_id } }
    );
  }

  selectTab(tabValue: string): void {
    this.activeTab = tabValue;
    this.tabs.forEach(tab => {
      tab.active = tab.value === tabValue;
    });
    this.staffList.forEach(staff => staff.selected = false);
  }

  get filteredStaffList(): StaffEntry[] {
    if (this.activeTab === 'active') {
      return this.staffList.filter(staff => staff.is_active === 1);
    } else {
      return this.staffList.filter(staff => staff.is_active === 0);
    }
  }


  onSearch(): void { }

  downloadJSON(): void {
    const dataToDownload = this.filteredStaffList;
    const dataStr = JSON.stringify(dataToDownload, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.activeTab}-staff-data.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  downloadCSV(): void {
    const headers = ['Name', 'Email', 'Role', 'Status'];
    const dataToDownload = this.filteredStaffList;
    const csvContent = [
      headers.join(','),
      ...dataToDownload.map(staff =>
        [staff.full_name, staff.email, staff.role, staff.is_active].join(',')
      )
    ].join('\n');

    const dataBlob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.activeTab}-staff-data.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  toggleStaffSelection(staff: any): void {
    console.log(staff)
    staff.selected = !staff.selected;
  }

  toggleSelectAll(): void {
    const selectAll = !this.isAllSelected;
    this.filteredStaffList.forEach(staff => staff.selected = selectAll);
  }

  goToPage(page: any): void {
    this.currentPage = page;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredStaffList.length / this.itemsPerPage);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get hasSelectedStaff(): boolean {
    return this.filteredStaffList.some(staff => staff.selected);
  }

  get selectedStaffCount(): number {
    return this.filteredStaffList.filter(staff => staff.selected).length;
  }

  archiveSelectedStaff(): void {
    const selectedStaff = this.filteredStaffList.filter(staff => staff.selected);
    if (selectedStaff.length > 0) {
      const confirmArchive = confirm(`Are you sure you want to archive ${selectedStaff.length} staff member(s)?`);
      if (confirmArchive) {
        const user_ids: number[] = selectedStaff.map(staff => staff.user_id);
        this.handleUserStatusChange(user_ids, 'archive');
      }
    }
  }

  restoreSelectedStaff(): void {
    const selectedStaff = this.filteredStaffList.filter(staff => staff.selected);
    if (selectedStaff.length > 0) {
      const confirmRestore = confirm(`Are you sure you want to restore ${selectedStaff.length} staff member(s)?`);
      if (confirmRestore) {
        const user_ids: number[] = selectedStaff.map(staff => staff.user_id);
        this.handleUserStatusChange(user_ids, 'restore');
      }
    }
  }

  handleUserStatusChange(user_ids: number[], action: 'archive' | 'restore'): void {
    const apiUrl = action === 'archive' ? globals.archiveUser : globals.restoreUser;
    this.apiGatewayService.post(apiUrl, { user_ids }).subscribe({
      next: (res) => {
        this.getUserList();
        this.toastr.success(res.message);
      }
    });
  }

  openAddStaffModal(): void {
    this.router.navigate(['/staff-user-details']);
  }

  get isAllSelected(): boolean {
    const visibleStaff = this.filteredStaffList;
    return visibleStaff.length > 0 && visibleStaff.every(staff => staff.selected);
  }
}
