import { Component } from "@angular/core"
import { Router } from "@angular/router"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { DynamicTableComponent } from "../components/dynamic-table/dynamic-table.component"
import { SharedService } from "app/services/shared.service"
import { ApiGateWayService } from "app/services/apiGateway.service"
import { getThirdPartyAuditLogs } from "app/globals"

interface ApiAuditLogEntry {
  id: number
  type: string
  url: string
  requestBody: string
  responseBody: string
  headers: string,
  error_message: string,
  createdDate: string,
  selected?: boolean
}

interface ApiResponse {
  tel_api_log_id: number
  tel_api_provider_id: number
  api_name: string
  request_url: string
  request_method: string
  request_headers: any
  request_body: any
  response_status_code: number
  response_body: any
  error_message: string | null
  status_id: number
  duration_ms: number
  created_at: string
  provider_name: string
}

type ColumnConfig = {
  key: string
  label: string
  type?: "text" | "status" | "action"
  width?: string
}

@Component({
  selector: "app-third-party-audit-logs",
  imports: [DynamicTableComponent, CommonModule, FormsModule],
  templateUrl: "./third-party-audit-logs.component.html",
  styleUrl: "./third-party-audit-logs.component.scss",
})
export class ThirdPartyAuditLogsComponent {
  searchTerm = ""
  selectedApiType = "All"
  fromDate = ""
  toDate = ""
  filteredAuditList: ApiAuditLogEntry[] = []
  auditData: ApiAuditLogEntry[] = []
  currentPage = 1
  itemsPerPage = 10
  isLoading = false

  apiTypes: string[] = ["All", "create customer", "get token", "find customer", "get savings product details", "get person details", "get account details", "update customer"]

  tableColumns: ColumnConfig[] = [
    { key: "id", label: "ID", width: "80px" },
    { key: "type", label: "Type", width: "250px" },
    { key: "url", label: "URL", width: "350px" },
    { key: "requestBody", label: "Request Body", width: "300px" },
    { key: "responseBody", label: "Response Body", width: "300px" },
    { key: "headers", label: "Headers", width: "250px" },
    { key: "createdDate", label: "Created Date", width: "200px" },
  ]
  dataCount: any

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private apiService: ApiGateWayService,
  ) { }

  ngOnInit() {
    this.fromDate = this.formatDateForInput(new Date());
    this.loadAuditData()
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

  private mapApiResponseToAuditEntry(apiData: ApiResponse): ApiAuditLogEntry {
    return {
      id: Number(apiData.tel_api_log_id) || 0,
      type: `${apiData.provider_name}: ${apiData.api_name}`,
      url: apiData.request_url || "",
      requestBody: apiData.request_body ? JSON.stringify(apiData.request_body) : "",
      responseBody: apiData.response_body ? JSON.stringify(apiData.response_body) : "",
      headers: apiData.request_headers ? JSON.stringify(apiData.request_headers) : "",
      error_message: apiData.error_message ? JSON.parse(apiData.error_message) : "",
      createdDate: this.sharedService.formatDate(apiData.created_at) || "",
    }
  }

  onSearch() {
    this.loadAuditData();
    this.currentPage = 1
  }

  onRowClick(logEntry: ApiAuditLogEntry) {
    this.sharedService.setAuditLogData(logEntry);
    this.router.navigate(["/audit-logs-details", logEntry.id])
  }

  today: string = new Date().toISOString().split('T')[0]

  onFromDateChange() {
    if (this.toDate && this.toDate < this.fromDate) {
      this.toDate = this.fromDate;
    }
  }

  buildFilterObject() {
    const filter: any = {
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
      filter.search = this.searchTerm
    }

    if (this.selectedApiType && this.selectedApiType !== "All") {
      filter.api_name = this.selectedApiType
    }

    return filter
  }

  loadAuditData() {
    const filter = this.buildFilterObject()
    this.isLoading = true
    this.apiService.post(getThirdPartyAuditLogs, filter).subscribe({
      next: (res) => {
        try {
          if (res && res.data && Array.isArray(res.data)) {
            this.dataCount = res.count;
            this.auditData = res.data.map((item: ApiResponse) => this.mapApiResponseToAuditEntry(item))
            this.filteredAuditList = [...this.auditData]
          } else {
            this.auditData = []
            this.filteredAuditList = []
          }
        } catch (error) {
          this.auditData = []
          this.filteredAuditList = []
        } finally {
          this.isLoading = false
        }
      },
      error: (error) => {
        this.auditData = []
        this.filteredAuditList = []
        this.isLoading = false
      },
    })
  }

  onPageSizeChanged(newSize: number) {
    this.itemsPerPage = +newSize
    this.goToPage(1)
  }

  goToPage(page: any): void {
    this.currentPage = page
    this.loadAuditData()
  }

  downloadJSON() {
    const data = this.filteredAuditList
    const dataStr = JSON.stringify(data, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = "api-audit-log.json"
    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  downloadCSV() {
    const headers = "ID,Type,URL,Request Body,Response Body,Headers,Created Date\n"
    const rows = this.filteredAuditList
      .map(
        (log) =>
          `${log.id},"${log.type}","${log.url}","${log.requestBody.replace(/"/g, '""')}","${log.responseBody.replace(/"/g, '""')}","${log.headers.replace(/"/g, '""')}","${log.createdDate}"`,
      )
      .join("\n")
    const csvContent = headers + rows
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "api-audit-log.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  clearFilters() {
    this.searchTerm = ""
    this.selectedApiType = "All"
    this.fromDate = ""
    this.toDate = ""
    this.filteredAuditList = [...this.auditData]
    this.currentPage = 1
  }

  hasActiveFilters(): boolean {
    return !!(
      this.searchTerm ||
      (this.selectedApiType && this.selectedApiType !== "All") ||
      this.fromDate ||
      this.toDate
    )
  }
}
