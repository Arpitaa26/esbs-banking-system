import { Component } from '@angular/core';
import { DynamicTableComponent } from "../components/dynamic-table/dynamic-table.component";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SharedService } from 'app/services/shared.service';
import { ApiGateWayService } from 'app/services/apiGateway.service';
import { CommonModule } from '@angular/common';
import { CommonModalComponent } from "../components/common-modal/common-modal.component";
import { addDenominationToSafe, getMasterFloat, getSafeFloat, getTillFloat } from 'app/globals';
import { ToastrService } from 'app/services/toastr.service';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-denomination',
  imports: [DynamicTableComponent, CommonModule, CommonModalComponent, FormsModule, RouterModule],
  templateUrl: './view-denomination.component.html',
  styleUrl: './view-denomination.component.scss'
})
export class ViewDenominationComponent {
  itemsPerPage = 10;
  currentPage = 1;
  totalAmount = 0;
  remaining_balance = 0;
  notesRows: string[][] = [];
  coinsRows: string[][] = [];
  showDenominationModal = false;

  tableColumns: { key: string; label: string; type?: 'text' | 'status' | 'action' }[] = [
    { key: 'float_value', label: 'Denominations' },
    { key: 'type', label: 'Type' },
    { key: 'count', label: 'Count' },
    { key: 'total_value', label: 'Total' }
  ];
  denominationButtons = [
    { label: 'Cancel', class: 'btn btn-outline', action: 'cancel', icon: 'bi bi-x-circle' },
    { label: 'Add', class: 'btn btn-primary', action: 'save', icon: 'bi bi-plus-circle' }
  ];

  currentBranchId: number | undefined;
  denomination: Record<string, number> = {};
  till_id = '';
  safe_id = '';
  denominations: any[] = [];

  constructor(
    private router: Router,
    private sharedService: SharedService,
    public apiGatewayService: ApiGateWayService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.safe_id = this.route.snapshot.queryParamMap.get('safe_id') ?? '';
    this.till_id = this.route.snapshot.queryParamMap.get('till_id') ?? '';
    this.currentBranchId = +this.route.snapshot.queryParamMap.get('branch_id')!;
    console.log("Safe ID:", this.safe_id, "Till ID:", this.till_id);
    this.loadMasterFloat();
    this.loadFloat();
  }

  goBack() {
    this.location.back();
  }

  searchDenomination(searchValue: string) { }

  private loadFloat() {
    const apiUrl = this.safe_id ? getSafeFloat(+this.safe_id) : getTillFloat(+this.till_id);
    this.apiGatewayService.get(apiUrl).subscribe(res => {
      this.denominations = (res?.data?.denominations ?? []).map((d: any) => ({
        ...d,
        total_value: d.total_value ? `${this.sharedService.currency_code} ${Number(d.total_value.toFixed(2))}` : ''
      }));
      this.remaining_balance = Number((res?.data?.remaining_balance ?? 0).toFixed(2));
    });
  }

  private loadMasterFloat() {
    this.apiGatewayService.get(getMasterFloat).subscribe((res: any) => {
      const items = res?.data?.float_master ?? [];
      const notes = items.filter((i: any) => i.type === 'note').sort((a: any, b: any) => b.denomination - a.denomination);
      const coins = items.filter((i: any) => i.type === 'coin').sort((a: any, b: any) => b.denomination - a.denomination);

      const noteKeys = notes.map((n: any) => `${n.denomination}`);
      const coinKeys = coins.map((c: any) => c.denomination < 1 ? `${Math.round(c.denomination * 100)}p` : `${c.denomination}`);

      this.notesRows = noteKeys.map((k: any) => [k]);
      this.coinsRows = this.chunk(coinKeys, 2);

      this.denomination = Object.fromEntries([...noteKeys, ...coinKeys].map(k => [k, 0]));
      this.totalAmount = 0;
    });
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  addDenomination() {
    this.resetDenominations();
    this.showDenominationModal = true;
  }

  closeDenominationModal(): void {
    this.showDenominationModal = false;
    this.resetDenominations();
  }

  private resetDenominations(): void {
    Object.keys(this.denomination).forEach(k => this.denomination[k] = 0);
    this.totalAmount = 0;
  }

  calculateTotal(): void {
    this.totalAmount = Object.entries(this.denomination).reduce((sum, [key, qty]) => {
      const value = key.endsWith('p') ? parseInt(key) / 100 : parseFloat(key);
      return sum + (qty || 0) * value;
    }, 0);
  }

  saveDenominations(action : string): void {
    if(action === 'save') {
      if (!this.currentBranchId) {
        this.toastr.error('Branch ID is required');
        return;
      }

      const payloadDenomination = Object.entries(this.denomination).reduce((acc, [key, qty]) => {
        if (qty > 0) {
          const numeric = key.endsWith('p') ? parseInt(key) / 100 : parseFloat(key);
          acc[numeric.toString()] = qty;
        }
        return acc;
      }, {} as Record<string, number>);

      const denominationData = {
        tel_safe_id: +this.safe_id,
        branch_id: this.currentBranchId,
        denomination: payloadDenomination,
        amount: parseFloat(this.totalAmount.toFixed(2)),
        activity_json: {
          operation_reason: "scheduled_replenishment",
          approved_by: "hub_manager"
        }
      };

      console.log("Final Payload:", JSON.stringify(denominationData, null, 2));

      this.apiGatewayService.post(addDenominationToSafe, denominationData).subscribe({
        next: (res) => {
          this.toastr.success(res.message);
          this.closeDenominationModal();
          this.loadFloat();
        }
      });
    } else {
      this.showDenominationModal = false;
    }
  }

  private chunk<T>(arr: T[], size: number): T[][] {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, i * size + size));
  }
}
