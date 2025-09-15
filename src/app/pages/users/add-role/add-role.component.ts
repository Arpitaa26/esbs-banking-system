import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import * as globals from 'app/globals';
import { ApiGateWayService } from 'app/services/apiGateway.service';

interface Permission {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

interface Functionality {
  id: number;
  codename: string;
  name: string;
  permissions: Permission;
}

@Component({
  selector: 'app-add-role',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-role.component.html',
  styleUrl: './add-role.component.scss',
})
export class AddRoleComponent {
  selectedRole: string = '';
  userRoleData: any = {};
  defaultFunctionality: Functionality[] = [];

  constructor(private router: Router, private api: ApiGateWayService) {}

  ngOnInit(): void {
    this.userRoleData = history.state?.userRoleData || {};
    if (this.userRoleData?.role_name) {
      this.selectedRole = this.userRoleData.role_name;
    }
    this.loadInitialPermissions();
  }

  private loadInitialPermissions(): void {
    this.api.get(globals.functionalities).subscribe({
      next: (result: any) => {
        result.data.forEach((x: any) => {
          if (this.userRoleData?.role_name) {
            const existing = this.userRoleData.permissions?.find(
              (y: any) => y.f_code_name === x.codename
            );
            if (existing) {
              x.permissions = {
                create: Boolean(existing.create),
                read: Boolean(existing.read),
                update: Boolean(existing.update),
                delete: Boolean(existing.delete),
              };
            } else {
              x.permissions = {
                create: false,
                read: false,
                update: false,
                delete: false,
              };
            }
          } else {
            x.permissions = {
              create: false,
              read: false,
              update: false,
              delete: false,
            };
          }
          this.defaultFunctionality.push(x);
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onSave(): void {
    const selectedFunctionality = this.defaultFunctionality.filter(
      (x) =>
        x.permissions.create ||
        x.permissions.read ||
        x.permissions.update ||
        x.permissions.delete
    );

    let requestBody: any = {
      role_name: this.selectedRole,
      functionalities: selectedFunctionality,
    };

    if (this.userRoleData?.role_id) {
      requestBody.id = this.userRoleData.role_id;
    }

    const apiEndpoint = this.userRoleData?.role_id
      ? globals.rolesetting
      : globals.addRole;
    this.api.post(apiEndpoint, requestBody).subscribe({
      next: (result: any) => {
        console.log('Role saved successfully:', result);
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.router.navigate(['/users']);
  }

  back(): void {
    this.router.navigate(['/users']);
  }
}
