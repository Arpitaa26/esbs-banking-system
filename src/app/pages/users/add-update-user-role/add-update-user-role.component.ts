import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiGateWayService } from 'app/services/apiGateway.service';
import * as globals from 'app/globals';

@Component({
  selector: 'app-add-update-user-role',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-update-user-role.component.html',
  styleUrl: './add-update-user-role.component.scss'
})
export class AddUpdateUserRoleComponent {
  accessItems: AccessItem[] = [];
  selectedRole: string = '';
  roleOptions: string[] = [
    'Marketing Compliance',
    'Customer Services',
    'Super Admin',
    'Marketing Authorizer'
  ];
  userRoleData: any = {};
  endpoint: string = '';

  constructor(private router: Router, private api: ApiGateWayService) { }

  ngOnInit(): void {
    this.initializeAccessItems();
    this.userRoleData = history.state?.userRoleData || {};
    if (this.userRoleData?.rolename) {
      this.selectedRole = this.userRoleData.rolename;
    }
    this.setCheckedAccessFromUserRole(this.userRoleData);
    this.endpoint = this.userRoleData?.user_roles_id ? globals.rolesetting : globals.addrole;
  }

  initializeAccessItems(): void {
    this.accessItems = [
      { id: 1, title: 'Staff Users Management', code: 'SUM', key: 'staffusers', checked: false },
      { id: 2, title: 'Existing Customer Migration', code: 'SUM', key: 'existing_customer_migration', checked: false },
      { id: 3, title: 'Customer Management', code: 'CM', key: 'customers', checked: false },
      { id: 4, title: 'Existing Customer Onboarding', code: 'ECO', key: 'newaccount', checked: false },
      { id: 5, title: 'Product Application', code: 'PA', key: 'products_application', checked: false },
      { id: 6, title: 'Products Management', code: 'PTM', key: 'products', checked: false },
      { id: 7, title: 'Marketing Push Messaging', code: 'MPM', key: 'pushmessages', checked: false },
      { id: 8, title: 'Campaign Management', code: 'CM', key: 'campaign', checked: false },
      { id: 9, title: 'App Settings', code: 'AS', key: 'appsettings', checked: false },
      { id: 10, title: 'Super Admin', code: 'SA', key: 'rolename', checked: false },
      { id: 11, title: 'Account List', code: 'AL', key: 'account_list', checked: false },
      { id: 12, title: 'Bank Sort Codes', code: 'BSC', key: 'bank_sortcodes', checked: false },
      { id: 13, title: 'Transfer Message Mapping', code: 'TMM', key: 'transfer_message', checked: false },
      { id: 14, title: 'Screen Labels', code: 'SL', key: 'labels', checked: false },
      { id: 15, title: 'Stop', code: 'ST', key: 'stop', checked: false },
      { id: 16, title: 'FAQ Categories', code: 'FAQC', key: 'faqCategories', checked: false },
      { id: 17, title: 'API Logs', code: 'AL', key: 'api_logs', checked: false },
      { id: 18, title: 'Product Creator', code: 'PC', key: 'product_edit', checked: false },
      { id: 19, title: 'Product Compliance', code: 'PCP', key: 'product_submit', checked: false },
      { id: 20, title: 'Product Authoriser', code: 'PA', key: 'product_compliance', checked: false },
      { id: 21, title: 'Product Code Management', code: 'PCM', key: 'products_code_manage', checked: false }
    ];
  }

  setCheckedAccessFromUserRole(userRoleData: any): void {
    const keysWithAccess = Object.keys(userRoleData).filter(key => userRoleData[key] === 1);
    this.accessItems.forEach((item: AccessItem) => {
      item.checked = keysWithAccess.includes(item.key);
    });
  }

  toggleCheck(item: AccessItem): void {
  }

  save(): void {
    try {
      if (!this.selectedRole.trim()) {
        alert('Please enter a role name.');
        return;
      }
      let payload: any = {};
      this.accessItems.forEach((item: AccessItem) => {
        if (item.key) {
          payload[item.key] = item.checked ? 1 : 0;
        }
      });
      payload['rolename'] = this.selectedRole.trim();
      if (this.userRoleData?.user_roles_id) {
        payload['user_roles_id'] = this.userRoleData.user_roles_id;
      }
      this.api.post(this.endpoint, payload).subscribe({
        next: (res) => {
          console.log('Role saved successfully:', res);
          this.router.navigate(['/users'], { state: { activeTab: 'user_role' } });
        },
        error: (err) => {
          console.error('Error saving role:', err);
          alert('Failed to save role. Please try again.');
        }
      });

    } catch (error) {
      console.error('Unexpected error in save():', error);
      alert('Something went wrong.');
    }
  }

  back(): void {
    this.router.navigate(['/users']);
  }
}

export interface AccessItem {
  id: number;
  title: string;
  key: string;
  checked: boolean;
  code: string;
}
