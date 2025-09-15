import { CommonModule } from "@angular/common";
import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from "@angular/router";
import { TableComponent } from "app/components/table/table.component";
import { ApiGateWayService } from "app/services/apiGateway.service";
import { ToastrService } from "app/services/toastr.service";
import * as globals from "../../../globals";

interface User {
  userid?: number | null;
  roleid: number[] | null;
  full_name: string;
  mobileno: string;
  emailid: string;
  password: string;
  confirmpassword: string;
  branch_id: number | null;
  platform: string | null;
  rolename: string | null;
  is_teller: boolean;
}

interface UserOptions {
  data: any[];
  filteredData: any[];
  columns: Record<string, { title: string; format?: string }>;
  pagination: boolean;
  fitler: any;
  search: boolean;
  select: boolean;
  download: boolean;
  btnSize: string;
  pageSize: number;
  rowClass: string;
  add: { addActionTitle: string; addAction: any };
  rowActions: any[];
  columnClass: string;
  resetFilter: any;
  uploadOptions: {};
}

const DEFAULT_USER: User = {
  userid: null,
  roleid: null,
  full_name: "",
  mobileno: "",
  emailid: "",
  password: "",
  confirmpassword: "",
  branch_id: null,
  platform: null,
  rolename: null,
  is_teller: false
};

@Component({
  selector: "app-add-update-user",
  standalone: true,
  imports: [TableComponent, CommonModule, FormsModule],
  templateUrl: "./add-update-user.component.html",
  styleUrl: "./add-update-user.component.scss"

})
export class AddUpdateUserComponent implements OnInit {
  @ViewChild('platformCtrl') platformCtrl!: NgModel;
  @ViewChild('roleCtrl') roleCtrl!: NgModel;
  @ViewChild('fullNameCtrl') fullNameCtrl!: NgModel;
  @ViewChild('emailCtrl') emailCtrl!: NgModel;
  @ViewChild('mobileCtrl') mobileCtrl!: NgModel;
  @ViewChild('passwordCtrl') passwordCtrl!: NgModel;
  @ViewChild('confirmPasswordCtrl') confirmPasswordCtrl!: NgModel;
  @ViewChild('branchCtrl') branchCtrl!: NgModel;

  user: User = { ...DEFAULT_USER };
  platform = ["App/Online", "Teller"];
  branches: any[] = [];
  isNew = false;
  isBusy = false;

  userOptions: UserOptions = {
    data: [],
    filteredData: [],
    columns: {
      trail_date: { title: "Date", format: "date" },
      trail_details: { title: "Trail Details" }
    },
    pagination: true,
    fitler: null,
    search: false,
    select: false,
    download: true,
    btnSize: 'small',
    pageSize: 50,
    rowClass: "table-row",
    add: { addActionTitle: "", addAction: null },
    rowActions: [],
    columnClass: "table-column",
    resetFilter: null,
    uploadOptions: {}
  };
  roles: { role_id: number; role_name: string }[] = [];
  selectedRoles: { role_id: number; role_name: string }[] = [];
  roleIds: number[] = [];
  roleid: any = '';
  clickOnSave: boolean = false;
  isFieldsValid: any = {
    plat : false,
    role : false,
    name : false,
    email : false,
    phn : false,
    password : false,
    confirmpass : false,
    branch: false
  }

  constructor(
    private router: Router,
    private apiService: ApiGateWayService,
    private cdr: ChangeDetectorRef,
    private toaster: ToastrService
  ) { }

  ngOnInit(): void {
    this.initializeUser();
    this.loadUserRoles();
    this.loadBranches();
  }

  changeValidity(field: string){
    this.isFieldsValid[field] = false;
  }

  private initializeUser(): void {
    const data = history.state.userData;

    if (data) {
      this.user = {
        ...data,
        password: "",
        confirmpassword: "",
        branch_id: data.branch_id || null,
        platform : data.is_teller ? 'Teller' : 'App/Online'
      };
      this.isNew = false;
      if (data.roles.length > 1) {
        this.selectedRoles = (data.roles || []).map((r: any) => ({
          role_id: r.id,
          role_name: r.name
        }));
        this.roleIds = this.selectedRoles.map(r => r.role_id);
        this.user.roleid = this.roleIds;
        const tellerRoles = [8, 9, 10];
        this.user.is_teller = data.roles.some((role: any) => tellerRoles.includes(role.id));
      } else {
        this.roleid = data.roles[0].id;
        this.user.roleid = [this.roleid];
      }

      if (this.user.userid) {
        this.loadAuditTrail(this.user.userid);
      }
    } else {
      this.user = { ...DEFAULT_USER };
      this.isNew = true;
    }
  }

  private loadUserRoles(): void {
    this.fetchData(globals.getroles, (res: any) => {
      this.roles = res.data;
      this.cdr.detectChanges();
    });
  }

  onPlatFormChange(data: string) {
    if (data === 'Teller') this.user.is_teller = true;
    this.user.roleid = [];
    this.selectedRoles = [];
    this.roleid = '';
  }

  private loadBranches(): void {
    this.fetchData(globals.getBranchListApiEndPoint, (res: any) => {
      this.branches = res.data.branches || [];
    });
  }

  private loadAuditTrail(userId: number): void {
    this.apiService.post(globals.getuserbyid, { users_id: userId }).subscribe({
      next: (res: any) => {
        this.userOptions.data = res.data;
        this.userOptions = { ...this.userOptions };
      },
      error: (err) => console.error("Error loading audit trail:", err)
    });
  }

  private fetchData(endpoint: string, onSuccess: (res: any) => void): void {
    this.apiService.get(endpoint).subscribe({
      next: onSuccess,
      error: (err) => console.error(`Error fetching from ${endpoint}:`, err)
    });
  }

  back(): void {
    this.router.navigate(["/users"]);
  }

  save(): void {
    this.clickOnSave = true;
    this.isFieldsValid.plat = true;
    this.isFieldsValid.role = true;
    this.isFieldsValid.name = true;
    this.isFieldsValid.email = true;
    this.isFieldsValid.phn = true;
    this.isFieldsValid.password = true;
    this.isFieldsValid.confirmpass = true;
    this.isFieldsValid.branch = true;

    if (!this.runValidations()) return;

    const isCreating = !this.user.userid;
    const endpoint = isCreating ? globals.adduser : globals.updateuser;

    const payload = {
      name: this.user.full_name.trim(),
      emailid: this.user.emailid.trim(),
      mobileno: String(this.user.mobileno || "").trim(),
      roleid: this.user.roleid,
      platform: this.user.platform,
      branch_id: this.user.branch_id,
      is_teller : this.user.is_teller,
      password: this.user.password?.trim() || "",
      confirmpassword: this.user.confirmpassword?.trim() || "",
      ...(isCreating ? {} : { user_id: this.user.userid })
    };

    this.isBusy = true;
    this.apiService.post(endpoint, payload).subscribe({
      next: () => {
        this.toaster.success(`User ${isCreating ? "created" : "updated"} successfully!`);
        this.isBusy = false;
        this.back();
      },
      error: (err) => {
        console.error(`Error ${isCreating ? "creating" : "updating"} user:`, err);
        this.toaster.error(`Failed to ${isCreating ? "create" : "update"} user. Please try again.`);
        this.isBusy = false;
      }
    });
  }

  onMultiRoleChange(id: any) {
    const selectedRoleId = +id;
    if (this.user.platform === 'Teller') {
      const role = this.roles.find((r: { role_id: number }) => r.role_id === selectedRoleId);
      if (role && !this.selectedRoles.some(r => r.role_id === selectedRoleId)) {
        this.selectedRoles.push(role);
      }
      this.roleIds = this.selectedRoles.map(r => r.role_id);
      const tellerRoles = [8, 9, 10];
      this.user.is_teller = this.roleIds.some((role: number) => tellerRoles.includes(role));
      this.user.roleid = this.roleIds;
    } else {
      this.user.roleid = [selectedRoleId];
    }
  }


  removeRole(id: number): void {
    this.selectedRoles = this.selectedRoles.filter(r => r.role_id !== id);
    this.roleIds = this.selectedRoles.map(r => r.role_id);
    this.user.roleid =  this.roleIds;
  }

  private runValidations(): boolean {
    const validations = [
      { valid: !!this.user.roleid, msg: "Please select a valid role." },
      { valid: !!this.user.full_name.trim(), msg: "Please enter the full name." },
      { valid: !!this.user.emailid.includes("@"), msg: "Please enter a valid email." },
      { valid: !this.isNew || !!this.user.password?.trim(), msg: "Please enter a password." },
      { valid: !this.isNew || this.user.password === this.user.confirmpassword, msg: "Passwords do not match." },
      { valid: !!this.user.platform, msg: "Please select a platform." },
      { valid: this.user.platform !== 'Teller' || !!this.user.branch_id, msg: "Please select a branch." }
    ];

    for (const { valid, msg } of validations) {
      if (!valid) {
        this.toaster.error(msg);
        return false;
      }
    }
    return true;
  }

}
