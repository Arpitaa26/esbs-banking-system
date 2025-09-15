import { ChangeDetectorRef, Component, HostListener } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { SharedService } from "app/services/shared.service"
import { DynamicTableComponent } from "../components/dynamic-table/dynamic-table.component"
import { ApiGateWayService } from "app/services/apiGateway.service"
import { getActivitiesList, getActivitiesStatusList, getBranchLevelAuditLogs } from "app/globals"
import { forkJoin } from "rxjs"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
interface Activity {
  tel_activity_master_id: number
  activity_name: string
}
interface ActivityStatus {
  tel_activity_status_id: number
  activity_status: string
  activity_status_description: string
}
@Component({
  selector: "app-branch-audit-log",
  imports: [DynamicTableComponent, CommonModule, FormsModule],
  templateUrl: "./branch-audit-log.component.html",
  styleUrl: "./branch-audit-log.component.scss",
})
export class BranchAuditLogComponent {
  branchData: any
  tableColumns: { key: string; label: string; type?: "text" | "status" | "action" }[] = [
    { key: "activity_date_time", label: "Date & Time" },
    { key: "activity_name", label: "Activity Name" },
    { key: "customer_name", label: "Customer" },
    { key: "activity_status", label: "Status", type: "status" },
    { key: "amount", label: "Amount" }
  ]

  auditData: any[] = []
  currentPage = 1
  itemsPerPage = 10

  // Filter properties
  searchTerm = ""
  selectedActivityIds: number[] = []
  selectedActivityStatusIds: number[] = []
  selectedActivities: Activity[] = []
  selectedStatuses: ActivityStatus[] = []
  fromDate = ""
  toDate = ""

  // Dropdown state
  openDropdown: string | null = null

  filerData: { branch_id: number; till_id: number; terminal_id: number } | undefined
  activityStatusList: ActivityStatus[] = []
  activityList: Activity[] = []
  dataCount: any
  today: string = new Date().toISOString().split('T')[0];

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private apiService: ApiGateWayService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement
    if (!target.closest(".dropdown-container")) {
      this.closeDropdowns()
    }
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const branchId = params["branchId"];

      this.route.queryParams.subscribe((queryParams) => {
        this.filerData = {
          branch_id: +branchId,
          ...(queryParams["till_id"] && { till_id: queryParams["till_id"] }),
          ...(queryParams["terminal_id"] && { terminal_id: queryParams["terminal_id"] })
        };
      });
    });

    this.fromDate = this.formatDateForInput(new Date())

    this.activityStatusAndActivityList()
    this.getBranchData()
    this.loadAuditData()
  }

  onFromDateChange() {
    if (this.toDate && this.toDate < this.fromDate) {
      this.toDate = this.fromDate;
    }
  }

  formatDateForInput(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  formatDateForAPI(dateString: string): string {
    if (!dateString) return ""
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  // Dropdown methods
  toggleDropdown(dropdown: string) {
    if (this.openDropdown === dropdown) {
      this.openDropdown = null
    } else {
      this.openDropdown = dropdown
    }
  }

  closeDropdowns() {
    this.openDropdown = null
  }

  toggleActivity(activity: Activity) {
    const index = this.selectedActivityIds.indexOf(activity.tel_activity_master_id)
    if (index > -1) {
      this.selectedActivityIds.splice(index, 1)
      this.selectedActivities = this.selectedActivities.filter(
        (a) => a.tel_activity_master_id !== activity.tel_activity_master_id,
      )
    } else {
      this.selectedActivityIds.push(activity.tel_activity_master_id)
      this.selectedActivities.push(activity)
    }
  }

  toggleStatus(status: ActivityStatus) {
    const index = this.selectedActivityStatusIds.indexOf(status.tel_activity_status_id)
    if (index > -1) {
      this.selectedActivityStatusIds.splice(index, 1)
      this.selectedStatuses = this.selectedStatuses.filter(
        (s) => s.tel_activity_status_id !== status.tel_activity_status_id,
      )
    } else {
      this.selectedActivityStatusIds.push(status.tel_activity_status_id)
      this.selectedStatuses.push(status)
    }
  }

  removeActivity(activityId: number) {
    const index = this.selectedActivityIds.indexOf(activityId)
    if (index > -1) {
      this.selectedActivityIds.splice(index, 1)
      this.selectedActivities = this.selectedActivities.filter((a) => a.tel_activity_master_id !== activityId)
    }
  }

  removeStatus(statusId: number) {
    const index = this.selectedActivityStatusIds.indexOf(statusId)
    if (index > -1) {
      this.selectedActivityStatusIds.splice(index, 1)
      this.selectedStatuses = this.selectedStatuses.filter((s) => s.tel_activity_status_id !== statusId)
    }
  }

  onPageSizeChanged(newSize: number) {
    this.itemsPerPage = +newSize
    this.goToPage(1)
  }

  isActivitySelected(activityId: number): boolean {
    return this.selectedActivityIds.includes(activityId)
  }

  isStatusSelected(statusId: number): boolean {
    return this.selectedActivityStatusIds.includes(statusId)
  }

  activityStatusAndActivityList() {
    forkJoin({
      activityStatus: this.apiService.get(getActivitiesStatusList),
      activity: this.apiService.get(getActivitiesList),
    }).subscribe({
      next: (res) => {
        this.activityStatusList = res.activityStatus.data
        this.activityList = res.activity.data;
      },
    })
  }

  getBranchData() {
    this.sharedService.getBranchData().subscribe({
      next: (data) => {
        this.branchData = data
      },
    })
  }


  loadAuditData() {
    const filter = this.buildFilterObject();
    this.apiService.post(getBranchLevelAuditLogs, filter).subscribe({
      next: (res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        this.auditData = data.map((item: any) => ({
          ...item,
          amount: item.amount ? `${this.sharedService.currency_code} ${item.amount}` : ''
        }));
        console.log(this.auditData);
        this.dataCount = res.count || 0;
        this.cdr.detectChanges();
      },
    });
  }

  buildFilterObject() {
    const filter: any = {
      ...this.filerData,
      page: this.currentPage,
      page_size: this.itemsPerPage,
    }

    if (this.fromDate) {
      filter.from_date = this.formatDateForAPI(this.fromDate)
    }

    if (this.toDate) {
      filter.to_date = this.formatDateForAPI(this.toDate)
    }

    if (this.searchTerm) {
      filter.activity_name = this.searchTerm
    }

    if (this.selectedActivityIds.length > 0) {
      filter.activity_id = this.selectedActivityIds
    }

    if (this.selectedActivityStatusIds.length > 0) {
      filter.activity_status_id = this.selectedActivityStatusIds
    }

    return filter
  }

  applyFilters() {
    this.closeDropdowns()
    this.loadAuditData()
  }

  clearFilters() {
    this.searchTerm = ""
    this.selectedActivityIds = []
    this.selectedActivityStatusIds = []
    this.selectedActivities = []
    this.selectedStatuses = []
    this.fromDate = this.formatDateForInput(new Date())
    this.toDate = ""
    this.closeDropdowns()
    this.loadAuditData()
  }

  hasActiveFilters(): boolean {
    return !!(
      this.searchTerm ||
      this.selectedActivityIds.length > 0 ||
      this.selectedActivityStatusIds.length > 0 ||
      this.toDate
    )
  }

  goToPage(page: any): void {
    console.log("Navigating to page:", page)
    this.currentPage = page
    this.loadAuditData()
  }

  goBack(route: string, param?: number): void {
    const navigation = param ? [route, param] : [route]
    this.router.navigate(navigation)
  }

  downloadJSON() {
    const data = this.auditData
    const dataStr = JSON.stringify(data, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = "branch-audit-log.json"
    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  downloadCSV() {
    const headers = "ID,User Name,Action,Details,Timestamp,IP Address\n"
    const rows = this.auditData
      .map(
        (log) => `${log.id},"${log.user_name}","${log.action}","${log.details}","${log.timestamp}","${log.ip_address}"`,
      )
      .join("\n")
    const csvContent = headers + rows
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "branch-audit-log.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
