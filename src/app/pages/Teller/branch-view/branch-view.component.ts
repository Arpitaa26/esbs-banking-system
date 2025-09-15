import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiGateWayService } from '../../../services/apiGateway.service';
import * as globals from '../../../globals';
import { SharedService } from '../../../services/shared.service';
import { NoDataComponent, NoDataConfig } from "../components/no-data/no-data.component";
import { CommonModalComponent } from "../components/common-modal/common-modal.component";
import { ToastrService } from '../../../services/toastr.service';

interface FloatItem {
  float_id: number;
  denomination: string;
  count: number;
  value: number;
}
interface DeviceSystem {
  device_type: 'safe' | 'till';
  device_id: number;
  name: string;
  is_active: number;
  machine_id: string;
  floats: FloatItem[];
  total_balance: number;
}
interface Tablet {
  tel_terminal_id: string;
  name: string;
  machine_id: string;
  is_active: number;
  active_login_user_id: number
}

@Component({
  selector: 'app-branch-view',
  imports: [CommonModule, FormsModule, NoDataComponent, CommonModalComponent],
  templateUrl: './branch-view.component.html',
  styleUrl: './branch-view.component.scss'
})
export class BranchViewComponent {
  branchName: string = 'Branch 1';
  tillsAndSafe: DeviceSystem[] = [];
  modalTitle: string = '';
  modalInputPlaceholder: string = '';

  tablets: Tablet[] = [];
  showTillModal: boolean = false;
  tillAndTerminalName: any;
  branchId!: number;
  branchData: any;
  noDataConfig: NoDataConfig = {
    title: 'No Tills Found',
    description: 'No tills are associated with this branch yet. Start by creating a till to manage cash transactions, assign staff, and track daily operations efficiently.',
    icon: 'package',
    buttonText: 'Create Till',
    showButton: true
  };
  noDataConfigTerminal: NoDataConfig = {
    title: 'No Terminal Found',
    description: 'No Terminal are associated with this branch yet. Start by creating a Terminal to manage transactions, assign staff, and track daily operations efficiently.',
    icon: 'package',
    buttonText: 'Create Terminal',
    showButton: true
  };
  tillModalButton = [
    { label: 'Cancel', class: 'btn btn-outline', action: 'cancel', icon: 'bi bi-x-circle' },
    { label: 'Save', class: 'btn btn-primary', action: 'save', icon: 'bi bi-save' }
  ]
  modalType: string = '';
  modalHeader: string = '';
  actionId: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiGatewayService: ApiGateWayService,
    private sharedService: SharedService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    const branchId = this.route.snapshot.paramMap.get('id');
    if (branchId) {
      this.branchId = +branchId;
      this.getTillByBranch();
      this.getTerminalByBranch();
      this.getBranchData();
    }
  }

  getTillByBranch() {
    this.apiGatewayService.get(globals.getSafeAndTillByBranch(this.branchId))
      .subscribe({
        next: (res) => {
          this.tillsAndSafe = res.data.devices;
        }
      })
  }

  removeMachineId(system: any) {
    console.log(system);
    const apiEndPoint = system.device_id
      ? globals.removeMachineFromTill(system.device_id)
      : globals.removeMachineFromTerminal(system.tel_terminal_id);

    this.apiGatewayService.post(apiEndPoint, '').subscribe({
      next: () => {
        if (system.device_id) {
          this.getTillByBranch();
        } else {
          this.getTerminalByBranch();
        }
      }
    });
  }

  editItem(item: any) {
    const deviceType = item.device_type ? 'till' : 'terminal'
    this.addTillAndTerminal(deviceType);
    this.tillAndTerminalName = item.name;
    this.actionId = item?.device_id || item?.tel_terminal_id;
    console.log("Edit item:", item)
  }

  getTerminalByBranch() {
    this.apiGatewayService.get(globals.getTerminalByBranch(this.branchId))
      .subscribe({
        next: (res) => {
          this.tablets = res.data.terminals;
        }
      })
  }

  getBranchData() {
    this.sharedService.getBranchData().subscribe({
      next: (data) => {
        this.branchData = data;
      }
    })
  }

  viewDenominations(data: any): void {
    this.router.navigate(['/view-denomination'], {
      queryParams: {
        [data.device_type === 'safe' ? 'safe_id' : 'till_id']: data.device_id,
        branch_id: this.branchId
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/head-office-branch-view']);
  }

  addTillAndTerminal(type: string): void {
    this.modalType = type;
    this.showTillModal = true;
    if (type === 'till') {
      this.modalHeader = 'Add Till';
      this.modalTitle = 'Till name';
      this.modalInputPlaceholder = 'Enter Till name';
    } else {
      this.modalHeader = 'Add Terminal';
      this.modalTitle = 'Terminal name';
      this.modalInputPlaceholder = 'Enter Terminal name';
    }
  }

  viewAuditLog(item: any) {
    const terminalId = item.tel_terminal_id || '';
    const deviceId = item.device_id || '';

    this.router.navigate(
      ['/branch-audit-logs', this.branchId],
      {
        queryParams: {
          ...(deviceId && { till_id: deviceId }),
          ...(terminalId && { terminal_id: terminalId })
        }
      }
    );
  }

  closeTillModal() {
    this.showTillModal = false;
  }

  saveTillDetails(event: string) {
    if (event === 'save') {
      const data: any = {};
      data.branch_id = this.branchId;
      if (!this.actionId) {
        data[this.modalType === 'till' ? 'till_name' : 'terminal_name'] = this.tillAndTerminalName;
      } else {
        data.name = this.tillAndTerminalName;
      }
      let apiEndPoint = '';
      if (this.actionId) {
        apiEndPoint = this.modalType === 'till' ? globals.updateTillName(this.actionId) : globals.updateTerminalName(this.actionId);
      } else {
        apiEndPoint = this.modalType === 'till' ? globals.createTillApiEndPoint : globals.createTerminalApiEndPoint;
      }
      this.apiGatewayService.post(apiEndPoint, data)
        .subscribe({
          next: (res) => {
            this.toastr.success(res.message);
            this.modalType === 'till' ? this.getTillByBranch() : this.getTerminalByBranch();
            this.showTillModal = false;
          }
        });
    } else {
      this.showTillModal = false;
    }
  }
}
