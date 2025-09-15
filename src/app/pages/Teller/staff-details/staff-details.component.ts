import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiGateWayService } from '../../../services/apiGateway.service';
import * as globals from '../../../globals';
import { forkJoin } from 'rxjs';
import { environment } from "../../../../environments/environment";
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
import { DynamicTableComponent } from "../components/dynamic-table/dynamic-table.component";
import { ToastrService } from '../../../services/toastr.service';

interface UserForm {
  first_name: string;
  last_name: string;
  full_name: string;
  date_of_birth: string;
  gender: string;
  password: string;
  email: string;
  phone: string;
  branch_id: number;
  external_employee_code: string;
  role_ids: number[];
}

interface AuditLogEntry {
  id: number;
  user_name: string;
  action: string;
  details: string;
  timestamp: string;
  ip_address: string;
  selected?: boolean;
}

interface Tab {
  name: string;
  value: string;
  active: boolean;
}

@Component({
  selector: 'app-staff-details',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DynamicTableComponent],
  templateUrl: './staff-details.component.html',
  styleUrl: './staff-details.component.scss'
})
export class StaffDetailsComponent {
  activeTab: string = 'create';
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  selectedRole: any = '';

  tabs: Tab[] = [
    { name: 'Create Staff', value: 'create', active: true },
    { name: 'Audit Log', value: 'audit', active: false }
  ];

  auditData: AuditLogEntry[] = [];
  filteredAuditList: AuditLogEntry[] = [];

  roles = [
    { id: 1, name: 'Teller' },
    { id: 2, name: 'Safe Manager' },
    { id: 3, name: 'Branch Manager' }
  ];
  staffFormData!: FormGroup;
  genderList: any;
  roleList: any;
  userId: any;
  selectedRoles: { id: number, name: string }[] = [];
  roleIds: number[] = [];
  tableColumns: { key: string; label: string; type?: 'text' | 'status' | 'action' }[] = [
    { key: 'user_name', label: 'User' },
    { key: 'action', label: 'Action', type: 'status' },
    { key: 'details', label: 'Details' },
    { key: 'timestamp', label: 'Timestamp,' },
    { key: 'ip_address', label: 'IP Address,' }
  ];
  staff_button = 'Create Staff';
  branches: any;

  constructor(
    private fb: FormBuilder,
    private apiGatewayService: ApiGateWayService,
    private router: Router,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.initStaffForm();
    this.route.queryParams.subscribe(params => {
      this.userId = params['user_id'];
      if (this.userId) {
        this.tabs[0].name = 'Update Staff Details';
        this.staff_button = 'Update Staff'
      }
      this.loadUserInfo();
    });
    this.loadAuditData();
  }

  getBranchData() {
    this.apiGatewayService.get(globals.getBranchListApiEndPoint)
      .subscribe({
        next: (res) => {
          this.branches = res.data.branches;
        }
      })
  }

  getUserData() {
    this.sharedService.getUserData().subscribe({
      next: (res) => {
        const roles = res.roles || [];
        const selectedRoles = roles.map((role: any) => ({ id: role.id, name: role.name }));
        const roleIds = roles.map((role: any) => role.id);

        this.selectedRoles = selectedRoles;
        this.roleIds = roleIds;

        const formattedData = {
          ...res,
          date_of_birth: res.date_of_birth?.split('T')[0] || null,
          role_ids: roleIds
        };

        this.staffFormData.patchValue(formattedData);
      }
    });
  }


  initStaffForm(): void {
    this.staffFormData = this.fb.group({
      client_secret: [environment.clientSecret],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      full_name: ['', Validators.required],
      date_of_birth: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      branch_id: [Validators.required],
      role_ids: [[], Validators.required],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required]
    });

    if (this.userId) {
      this.staffFormData.removeControl('password');
      this.staffFormData.removeControl('confirm_password');
    }
  }


  resetForm() {
    this.staffFormData.reset();
  }

  loadUserInfo(): void {
    forkJoin({
      genders: this.apiGatewayService.get(globals.genderList),
      roles: this.apiGatewayService.get(globals.userRoleList)
    }).subscribe({
      next: (res: any) => {
        this.genderList = res.genders.data;
        this.roleList = res.roles.data;
        this.getBranchData();
        if (this.userId) {
          this.getUserData();
        }
      },
      error: (err) => {
        console.error('Error loading user info:', err);
      }
    });
  }


  selectTab(tabValue: string) {
    this.activeTab = tabValue;
    this.tabs.forEach(tab => {
      tab.active = tab.value === tabValue;
    });

    if (tabValue === 'audit') {
      this.onSearch();
    }
  }

  loadAuditData() {
    this.auditData = [
      {
        id: 1,
        user_name: 'John Doe',
        action: 'CREATE',
        details: 'Staff account created by Admin',
        timestamp: '2024-01-15T10:30:00',
        ip_address: '192.168.1.100'
      },
      {
        id: 2,
        user_name: 'Jane Smith',
        action: 'LOGIN',
        details: 'User logged in successfully',
        timestamp: '2024-01-15T11:15:00',
        ip_address: '192.168.1.101'
      },
      {
        id: 3,
        user_name: 'Mike Johnson',
        action: 'UPDATE',
        details: 'Profile information updated - Phone number changed',
        timestamp: '2024-01-16T14:20:00',
        ip_address: '192.168.1.102'
      },
      {
        id: 4,
        user_name: 'Sarah Wilson',
        action: 'DELETE',
        details: 'User account deactivated by Branch Manager',
        timestamp: '2024-01-16T16:30:00',
        ip_address: '192.168.1.103'
      },
      {
        id: 5,
        user_name: 'David Brown',
        action: 'LOGIN',
        details: 'User logged in from mobile device',
        timestamp: '2024-01-17T09:45:00',
        ip_address: '10.0.0.25'
      },
      {
        id: 6,
        user_name: 'Emily Davis',
        action: 'UPDATE',
        details: 'Password changed successfully',
        timestamp: '2024-01-17T13:22:00',
        ip_address: '192.168.1.104'
      },
      {
        id: 7,
        user_name: 'Robert Miller',
        action: 'CREATE',
        details: 'New teller account created',
        timestamp: '2024-01-18T08:15:00',
        ip_address: '192.168.1.105'
      },
      {
        id: 8,
        user_name: 'Lisa Anderson',
        action: 'LOGOUT',
        details: 'User logged out after session timeout',
        timestamp: '2024-01-18T17:30:00',
        ip_address: '192.168.1.106'
      },
      {
        id: 9,
        user_name: 'James Wilson',
        action: 'UPDATE',
        details: 'Role changed from Teller to Safe Manager',
        timestamp: '2024-01-19T10:45:00',
        ip_address: '192.168.1.107'
      },
      {
        id: 10,
        user_name: 'Maria Garcia',
        action: 'LOGIN',
        details: 'First login after account activation',
        timestamp: '2024-01-19T14:20:00',
        ip_address: '192.168.1.108'
      },
      {
        id: 11,
        user_name: 'Thomas Lee',
        action: 'DELETE',
        details: 'Account archived due to resignation',
        timestamp: '2024-01-20T11:30:00',
        ip_address: '192.168.1.109'
      },
      {
        id: 12,
        user_name: 'Jennifer Taylor',
        action: 'UPDATE',
        details: 'Branch transfer - Branch ID updated',
        timestamp: '2024-01-20T15:45:00',
        ip_address: '192.168.1.110'
      },
      {
        id: 13,
        user_name: 'Christopher Moore',
        action: 'LOGIN',
        details: 'Login attempt with incorrect password',
        timestamp: '2024-01-21T09:12:00',
        ip_address: '192.168.1.111'
      },
      {
        id: 14,
        user_name: 'Amanda White',
        action: 'CREATE',
        details: 'Branch Manager account created',
        timestamp: '2024-01-21T12:30:00',
        ip_address: '192.168.1.112'
      }
    ];

    this.filteredAuditList = [...this.auditData];
  }

  onSubmitStaff() {
    const first = this.staffFormData.get('first_name')?.value || '';
    const last = this.staffFormData.get('last_name')?.value || '';
    const fullName = `${first} ${last}`.trim();
    this.staffFormData.get('full_name')?.setValue(fullName, { emitEvent: false });
    const apiEndPoint = this.userId ? globals.updateUserEndPoint(this.userId) : globals.createUserEndPoint
    const method = this.userId ? 'put' : 'post'
    this.apiGatewayService[method](apiEndPoint, this.staffFormData.value)
      .subscribe({
        next: (res) => {
          this.staffFormData.reset();
          this.toastr.success(res.message);
          this.router.navigate(['/staff-user-management']);
        }
      })
  }

  onSearch() {
    if (this.searchTerm.trim()) {
      this.filteredAuditList = this.auditData.filter(log =>
        log.user_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        log.ip_address.includes(this.searchTerm)
      );
    } else {
      this.filteredAuditList = [...this.auditData];
    }
    this.currentPage = 1;
  }

  get isIndeterminate(): boolean {
    const selectedCount = this.filteredAuditList.filter(log => log.selected).length;
    return selectedCount > 0 && selectedCount < this.filteredAuditList.length;
  }

  downloadJSON() {
    const data = this.filteredAuditList;
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = 'audit-log.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  downloadCSV() {
    const headers = 'ID,User Name,Action,Details,Timestamp,IP Address\n';
    const rows = this.filteredAuditList.map(log =>
      `${log.id},"${log.user_name}","${log.action}","${log.details}","${log.timestamp}","${log.ip_address}"`
    ).join('\n');

    const csvContent = headers + rows;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'audit-log.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  goToPage(page: any): void {
    this.currentPage = page;
  }

  onMultiRoleChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = Number(selectElement.value);

    const role = this.roleList.find((r: { id: number; }) => r.id === selectedId);
    if (role && !this.selectedRoles.some(r => r.id === selectedId)) {
      this.selectedRoles.push(role);
    }

    this.roleIds = this.selectedRoles.map(r => r.id);
    this.staffFormData.patchValue({ role_ids: this.roleIds });

    selectElement.value = '';
  }

  removeRole(id: number): void {
    this.selectedRoles = this.selectedRoles.filter(r => r.id !== id);
    this.roleIds = this.selectedRoles.map(r => r.id);
    this.staffFormData.patchValue({ role_ids: this.roleIds });
  }
}
