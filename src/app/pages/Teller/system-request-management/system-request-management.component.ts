import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiGateWayService } from '../../../services/apiGateway.service';
import * as globals from '../../../globals';
import { DynamicTableComponent } from "../components/dynamic-table/dynamic-table.component";
import { CommonModalComponent } from "../components/common-modal/common-modal.component";
import { SocketService } from '../../../services/socket.service';
import { ToastrService } from 'app/services/toastr.service';
interface SystemRequest {
  req_id: string
  branch_id: number
  machine_id: string
  selected?: boolean
  branch_name: string
  request_for: string
  created_at: string
}

interface system {
  tel_till_id: number,
  tel_terminal_id: number,
  name: string
  type: "till" | "Terminal"
}

@Component({
  selector: 'app-system-request-management',
  imports: [CommonModule, FormsModule, DynamicTableComponent, CommonModalComponent],
  templateUrl: './system-request-management.component.html',
  styleUrl: './system-request-management.component.scss'
})
export class SystemRequestManagementComponent {
  systemRequests: SystemRequest[] = []

  availableSystems: system[] = []

  selectedRequest: SystemRequest | null = null
  itemsPerPage: number = 10;

  showActionsPopup = false
  showAssignmentModal = false;
  tableColumns: { key: string; label: string; type?: 'text' | 'status' | 'action' }[] = [
    { key: 'req_id', label: 'ID' },
    { key: 'created_at', label: 'Date and time' },
    { key: 'branch_name', label: 'Branch Name' },
    { key: 'request_for', label: 'Request From' },
    { key: 'machine_id', label: 'Machine ID' },
    { key: 'action', label: 'Actions', type: 'action' }
  ];
  currentPage: number = 1;
  branch_id!: number;
  selectedSystem: system | null = null;
  actionModalButton = [
    {
      label: 'Accept',
      class: 'btn',
      action: 'accept',
      icon: 'bi bi-check2-circle',
      backgroundColor: '#059669',
      textColor: 'white'
    },
    {
      label: 'Reject',
      class: 'btn',
      action: 'reject',
      icon: 'bi bi-x-circle',
      backgroundColor: '#dc2626',
      textColor: 'white'
    },
    {
      label: 'Login',
      class: 'btn',
      action: 'login',
      icon: 'bi bi-box-arrow-in-right',
      backgroundColor: '#1e293b',
      textColor: 'white'
    }
  ];
  tillModalButton = [
    { label: 'Cancel', class: 'btn btn-outline', action: 'cancel', icon: 'bi bi-x-circle' },
    { label: 'Save', class: 'btn btn-primary', action: 'save', icon: 'bi bi-save' }
  ]
  modalType: string = '';
  modalHeader: string = '';
  showTillModal: boolean = false;
  modalTitle: string = '';
  modalInputPlaceholder: string = '';
  tillAndTerminalName: string = '';

  constructor(
    private apiGatewayService: ApiGateWayService,
    public socketService: SocketService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.getPendingSystemRequest();
  }

  getPendingSystemRequest(searchInput?: string) {
    this.apiGatewayService.post(globals.getRequestApiEndPoint,
      searchInput ? { machine_id: searchInput } : ''
    ).subscribe({
      next: (res) => {
        this.systemRequests = res.data.map((req: SystemRequest) => ({
          ...req,
          created_at: this.formatDate(req.created_at),
          action: [
            {
              label: 'Manage',
              class: 'action-btn',
              icon: `<i class="bi bi-sliders2-vertical"></i>`,
              callback: (row: any) => this.openActionsPopup(row, new Event('click'))
            }
          ]
        }));
      }
    });
  }

  private formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year}, ${hours}:${minutes}`;
  }


  closeTillModal() {
    this.showTillModal = false;
  }

  saveTillDetails() {
    const data = {
      [this.modalType === 'till' ? 'till_name' : 'terminal_name']: this.tillAndTerminalName,
      branch_id: this.branch_id
    };
    const apiEndPoint = this.modalType === 'till' ? globals.createTillApiEndPoint : globals.createTerminalApiEndPoint;
    this.apiGatewayService.post(apiEndPoint, data)
      .subscribe({
        next: (res) => {
          this.toastr.success(res.message);
          console.log(this.showAssignmentModal);
          this.showAssignmentModal = true;
          this.showTillModal = false;
          this.getAvailableSystems(this.selectedRequest);
        }
      });
  }

  addTillAndTerminal(): void {
    this.modalType = this.selectedRequest?.request_for === "exe" ? 'till' : 'terminal';
    this.showTillModal = true;
    if (this.selectedRequest?.request_for === "exe") {
      this.modalHeader = 'Add Till';
      this.modalTitle = 'Till name';
      this.modalInputPlaceholder = 'Enter Till name';
    } else {
      this.modalHeader = 'Add Terminal';
      this.modalTitle = 'Terminal name';
      this.modalInputPlaceholder = 'Enter Terminal name';
    }
  }

  performAction(action: string) {
    switch (action) {
      case 'accept':
        this.acceptRequest();
        break;
      case 'reject':
        this.rejectRequest();
        break;
      case 'login':
        this.loginRequest();
        break;
      default:
        console.warn('Unknown action:', action);
    }
  }

  searchDataByMachineId(id: string) {
    this.getPendingSystemRequest(id);
  }

  openActionsPopup(request: SystemRequest, event: Event): void {
    console.log(request);
    event.stopPropagation()
    this.selectedRequest = request
    this.showActionsPopup = true
  }

  closeActionsPopup(): void {
    this.showActionsPopup = false
  }

  goToPage(page: any): void {
    this.currentPage = page;
  }


  acceptRequest(): void {
    if (this.selectedRequest) {
      this.branch_id = this.selectedRequest.branch_id
      this.showActionsPopup = false
      this.showAssignmentModal = true;
      this.getAvailableSystems(this.selectedRequest);
    }
  }

  getAvailableSystems(system: any) {
    const apiEndPoint = system.request_for === "exe" ? globals.getUnassignedTill(this.branch_id) : globals.getUnassignedTerminal(this.branch_id);
    this.apiGatewayService.get(apiEndPoint).subscribe({
      next: (res) => {
        this.availableSystems = system.request_for === "exe" ? res.data.tills : res.data.terminal;
      }
    });
  }

  rejectRequest(): void {
    if (this.selectedRequest) {
      const confirmed = confirm(`Are you sure you want to reject request ${this.selectedRequest.req_id}?`)
      if (confirmed) {
        this.apiGatewayService.post(globals.rejectSystemRequestApiEndPoint,
          { req_id: this.selectedRequest.req_id }
        ).subscribe({
          next: (res) => {
            this.toastr.success(res.message);
            this.getPendingSystemRequest();
          }
        })
        this.resetSelection()
      }
    }
  }

  loginRequest(): void {
    // if (this.selectedRequest) {
    //   console.log(`Request ${this.selectedRequest.id} login initiated`)
    //   this.resetSelection()
    // }
  }

  assignSystem(): void {
    console.log(this.selectedRequest, this.selectedSystem)
    if (this.selectedRequest && this.selectedSystem) {
      const data = {
        type: this.selectedRequest.request_for === 'exe' ? 'till' : 'terminal',
        machine_id: this.selectedRequest.machine_id,
        action_id: this.selectedSystem.tel_till_id || this.selectedSystem.tel_terminal_id,
        req_id: this.selectedRequest.req_id
      }
      this.apiGatewayService.post(globals.systemApproveRequest, data)
        .subscribe({
          next: (res) => {
            this.toastr.success(res.message);
            this.socketService.emit('request-accepted', data);
            this.getPendingSystemRequest();
          }
        })
      this.closeAssignmentModal()
    }
  }

  closeAssignmentModal(): void {
    this.showAssignmentModal = false
    this.selectedSystem = null;
    this.resetSelection()
  }

  resetSelection(): void {
    this.selectedRequest = null
    this.showActionsPopup = false
  }

  craeteTillorTerminal() {
    this.addTillAndTerminal();
    this.showAssignmentModal = false;
  }

  readNotification() {
    // let body = {
    //   "receiverType": "hub"       // Required: user|till|safe|branch|manager|machine|hub
    // }
    // this.apiGatewayService.put(globals.markAsReadNotification(notification.tel_notification_id),
    //   body
    // ).subscribe({
    //   next: (res) => {
    //   }
    // });
  }

}
