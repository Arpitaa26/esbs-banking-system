import { Component } from '@angular/core';
import { SegmentComponent } from '../../components/segment/segment.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableComponent } from '../../components/table/table.component';
import { Router } from '@angular/router';
import * as globals from '../../globals';
import { ChangeDetectorRef } from '@angular/core';
import { ApiGateWayService } from 'app/services/apiGateway.service';

@Component({
  selector: 'users',
  imports: [SegmentComponent, CommonModule, FormsModule, TableComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  standalone: true,
})
export class UsersComponent {
  segbuttonConfig1: any = [
    { name: 'Staff Users', functionName: 'staff_users' },
    { name: 'User Role', functionName: 'user_role' },
  ];
  segbuttonConfig2: any = [
    { name: 'Active', functionName: 'active' },
    { name: 'Archive', functionName: 'archive' },
  ];

  currentMainTab: string = 'staff_users';
  currentSubTab: string = 'active';

  activeStaffUsers: any[] = [];
  inactiveStaffUsers: any[] = [];
  blockedStaffUsers: any[] = [];

  usersOptions: any = {
    data: [],
    filteredData: [],
    columns: {
      rolename: {
        title: 'Role Name',
        search: true,
        format: 'function',
        fn: this.createFunctionalityRoleUI.bind(this),
      },
      full_name: {
        title: 'Name',
        search: true,
        format: 'function',
        fn: this.commonFunctionStaff.bind(this),
      },
      emailid: {
        title: 'Email',
        search: true,
        format: 'function',
        fn: this.commonFunctionStaff.bind(this),
      },
      status: {
        title: 'Status',
        search: true,
        format: 'function',
      },
    },
    pagination: true,
    fitler: null,
    search: true,
    select: true,
    selectedActions: [
      {
        title: 'Archive',
        color: 'red',
        action: this.archiveUser.bind(this)
      },
    ],
    rowActions: [],
    download: true,
    btnSize: 'small',
    pageSize: 50,
    rowClass: 'table-row',
    columnClass: 'table-column',
    add: {
      addActionTitle: 'Add Staff User',
      addAction: this.createUser.bind(this),
    },
    tapRow: this.editUser.bind(this),
    resetFilter: null,
    uploadOptions: {},
    serverMode: false,
    serverParams: {
      pageDetail: {
        page: 1,
        pageSize: 50,
        rowCount: 0,
        pageCount: 1,
      },
    },
  };

  userRolesOptions: any = {
    data: [],
    filteredData: [],
    columns: {
      role_name: {
        title: 'Role Name',
        tooltip: 'Role Name',
        search: true,
        col: 'col-2',
      },
      functionalities: {
        title: 'Role Functionalities',
        tooltip: 'Allow Staff User Management',
        format: 'function',
        search: true,
        fn: this.createFunctionalityUI.bind(this),
      }
    },
    pagination: true,
    fitler: null,
    search: true,
    select: true,
    selectedActions: [
      {
        title: 'Delete',
        color: 'red',
        action: this.deleteUserRole.bind(this),
      },
    ],
    rowActions: [],
    download: true,
    btnSize: 'small',
    pageSize: 50,
    rowClass: 'table-row',
    columnClass: 'table-column',
    add: {
      addActionTitle: 'Add User Role Access',
      addAction: this.addUserRoles.bind(this),
    },
    tapRow: this.editUserRoles.bind(this),
    resetFilter: null,
    uploadOptions: {},
    serverParams: {
      pageDetail: {
        page: 1,
        pageSize: 50,
        rowCount: 0,
        pageCount: 1,
      },
    },
  };

  constructor(
    private router: Router,
    private apiService: ApiGateWayService,
    private cdr: ChangeDetectorRef
  ) {
    this.usersOptions.rowActions.push({
      title: this.buttonTitle.bind(this),
      action: this.unblockuser.bind(this),
      color: 'green;',
    });
  }

  ngOnInit(): void {
    this.loadStaffUsers();
  }

  archiveUser(data: any) {
    this.updateUserStatus(data, 0);
  }

  activateUser(data: any) {
    this.updateUserStatus(data, 1);
  }

  updateUserStatus(data: any[], isActive: number) {
    try {
      let user_ids: any[] = [];
      data.forEach((user: any) => {
        if (user.userid) {
          user_ids.push(user.userid);
        }
      });
      
      if(isActive == 0) {
        this.apiService.post(globals.archiveuser, {user_ids}).subscribe({
            next: () => {
              this.loadStaffUsers();
            },
            error: (err) => {
              console.error('Error updating user status:', err);
            },
          });
      } else {
        this.apiService.post(globals.activeuser, {user_ids}).subscribe({
            next: () => {
              this.loadStaffUsers();
            },
            error: (err) => {
              console.error('Error updating user status:', err);
            },
        });
      }
    } catch (error) {
      console.error('Exception in updateUserStatus:', error);
    }
  }

  seghandleClick1(functionName: string) {
    if (functionName === 'user_role') {
      this.loadUserRoles();
    } else {
      this.loadStaffUsers();
    }
    this.currentMainTab = functionName;
  }

  seghandleClick2(functionName: string) {
    if (functionName === 'archive') {
      this.loadArchiveUsers();
    } else {
      this.loadStaffUsers();
    }
    this.currentSubTab = functionName;
  }
  commonFunction(data: any) {

    let str = '';
    if (data == 0) {
      str =
        '<img class="imgUpload"  style="width:50%; height:50%;margin-left:29px" src ="image/close.jpg" alt="" width="14px" height="14px">';
    } else if (data == null) {
      str =
        '<img class="imgUpload"  style="width:50%; height:50%;margin-left:29px" src ="image/close.jpg" alt=""  width="14px" height="14px">';
    } else {
      str =
        '<img class="imgUpload"  style="width:50%; height:50%;margin-left:29px" src ="image/1398911.png" alt=""  width="14px" height="14px">';
    }
    return str;
  }

  commonFunctionStaff(nullData: any) {
    try {
      if (nullData === 0 || nullData == null || nullData == undefined) {
        return '--';
      } else {
        return nullData;
      }
    } catch (error) {
      console.error('Error in commonFunction:', error);
      return '--';
    }
  }

  editUser(userData: any) {
    console.log(userData);
    const id = userData.userid;
    if (!id) return;
    this.router.navigate(['/add-update-user'], { state: { userData } });
  }

  createUser(data: any) {
    this.router.navigate(['/add-update-user'], { state: { userData: data } });
  }

  editUserRoles(data: any) {
    this.router.navigate(['/app-add-role'], {
      state: { userRoleData: data },
    });
  }
  addUserRoles(data: any) {
    this.router.navigate(['/app-add-role']);
  }

  loadStaffUsers(): void {
    this.apiService.get(globals.getUserEndPointAO).subscribe({
      next: (response: any) => {

        this.usersOptions.selectedActions[0] = {
            title: 'Archive',
            color: 'red',
            action: this.archiveUser.bind(this)
          };

        this.usersOptions = {
          ...this.usersOptions,
          data: response.data,
        };
        // this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading staff users:', err),
    });
  }

  loadArchiveUsers(): void {
    this.apiService.get(globals.getuserarchive).subscribe({
      next: (response: any) => {

        this.usersOptions.selectedActions[0] = { title: "Active", action: this.activateUser.bind(this), color: "green" }
        this.usersOptions = {
          ...this.usersOptions,
          data: response.data,
        };
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading staff users:', err),
    });
  }

  loadUserRoles(): void {
    this.userRolesOptions = {
      ...this.userRolesOptions,
      data: [],
    };

    this.apiService.get(globals.getroles).subscribe({
      next: (response: any) => {
        this.userRolesOptions = {
          ...this.userRolesOptions,
          data: response.data,
        };
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading roles:', err),
    });
  }

  deleteUserRole(data: any): void {
    try {
      let roleIds = data.map((item: any) => item.role_id);

      this.apiService
        .post(globals.deleterole, { user_roles_id: roleIds })
        .subscribe({
          next: () => {
            this.loadUserRoles();
          },
          error: (err) => {
            console.error('Error deleting user role:', err);
            alert('Failed to delete user role.');
          },
        });
    } catch (error) {
      console.error('Exception in deleteUserRole:', error);
    }
  }
  buttonTitle(item: any) {
    try {
      if (item.is_blocked) {
        return 'Unblock';
      } else {
        return;
      }
    } catch (error) {
      // console.log(error);
      return;
    }
  }
  unblockuser(items: any) {
    try {
      items.isactive = 1;
      items.is_blocked = 0;
      this.updateUserStatus(items, 1);
    } catch (error) {
      // console.log(error);
    }
  }

  createFunctionalityUI(value: any, column: any, item: any) {
    if (item?.permissions) {
      const functionalities = item.permissions.map((permission: any) => `<span class='pills'>${permission.f_name}</span>`);
      return functionalities.join(" ");
    }
  }

   createFunctionalityRoleUI(value: any, column: any, item: any) {
    if (item?.roles) {
      const functionalities = item.roles.map((role: any) => `<span class='pills'>${role.name}</span>`);
      return functionalities.join(" ");
    }
  }
}
