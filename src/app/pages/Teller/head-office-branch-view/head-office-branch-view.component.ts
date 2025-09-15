import { SharedService } from './../../../services/shared.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiGateWayService } from '../../../services/apiGateway.service';
import { NoDataComponent, NoDataConfig } from "../components/no-data/no-data.component";
import { CommonModalComponent } from "../components/common-modal/common-modal.component";
import { ToastrService } from '../../../services/toastr.service';
import { addDenominationToSafe, createBranchEndPoint, getBranchListApiEndPoint, updateBranch } from 'app/globals';

interface Branch {
  branch_id: number;
  name: string;
  desktop_count: {
    total: number;
    active: number;
    inactive: number;
  };
  safe_id: number,
  total_balance: number | null | undefined;
  total_devices: number;
  total_safes: number;
  total_tills: number;
  tellerTablet?: {
    current: number;
    total: number;
  };
}
@Component({
  selector: 'app-head-office-branch-view',
  imports: [CommonModule, FormsModule, NoDataComponent, CommonModalComponent],
  templateUrl: './head-office-branch-view.component.html',
  styleUrl: './head-office-branch-view.component.scss'
})
export class HeadOfficeBranchViewComponent {
  showBranchModal = false;
  branch_name = "";
  editedTellerDesktopCurrent = 0;
  editedTellerDesktopTotal = 0;
  editedTellerTabletCurrent = 0;
  editedTellerTabletTotal = 0;
  branches: Branch[] = [];
  totalAmount = 0;

  noDataConfig: NoDataConfig = {
    title: 'No Branches Found',
    description: 'You haven\'t created any branches yet. Get started by adding your first branch to manage cash flow and operations.',
    icon: 'building',
    buttonText: 'Create Your First Branch',
    showButton: true
  };

  branchButton = [
    { label: 'Cancel', class: 'btn btn-outline', action: 'cancel', icon: 'bi bi-x-circle' },
    { label: 'Save', class: 'btn btn-primary', action: 'save', icon: 'bi bi-save' }
  ];

  branch_id: number | undefined;

  constructor(
    private router: Router,
    private apiGatewayService: ApiGateWayService,
    private SharedService: SharedService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.getBranchList();
  }

  getBranchList() {
    this.apiGatewayService.get(getBranchListApiEndPoint)
      .subscribe({
        next: (res) => {
          this.branches = res.data.branches;
        }
      });
  }

  editBranchName(branch: Branch): void {
    this.branch_id = branch.branch_id;
    this.branch_name = branch.name;
    this.addBranch();
  }

  viewDenominations(branch: any): void {
    this.router.navigate([`/view-denomination`], { queryParams: { safe_id: branch.safe_id, branch_id : branch.branch_id } });
  }

  viewSafeAndTills(branch: any): void {
    this.router.navigate(['/branch-view', branch.branch_id]);
    this.SharedService.setBranchData(branch);
  }

  addBranch(): void {
    this.showBranchModal = true;
  }

  closeBranchModal(): void {
    this.showBranchModal = false;
    this.resetBranchForm();
  }

  resetBranchForm(): void {
    this.branch_name = "";
    this.branch_id = undefined;
  }

  saveBranchDetails(event : string): void {
    if(event === 'save') {
      const data: any = {
        branch_name: this.branch_name
      };
      this.branch_id ? data.branch_id = this.branch_id : null;
      const apiType = this.branch_id ? 'put' : 'post';
      const apiEndPoint = this.branch_id ? updateBranch : createBranchEndPoint;
  
      this.apiGatewayService[apiType](apiEndPoint, data)
        .subscribe({
          next: (res) => {
            this.toastr.success(res.message);
            this.closeBranchModal();
            this.getBranchList();
          }
        });
    } else {
      this.showBranchModal = false;
    }
  }
}
