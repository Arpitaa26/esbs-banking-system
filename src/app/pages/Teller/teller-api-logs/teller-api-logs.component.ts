import { Component } from '@angular/core';
import { DynamicTableComponent } from "../components/dynamic-table/dynamic-table.component";
import { Router } from '@angular/router';
import { SharedService } from 'app/services/shared.service';
import { ApiGateWayService } from 'app/services/apiGateway.service';
import { getApiAuditLogs } from 'app/globals';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

type ColumnConfig = {
  key: string
  label: string
  type?: "text" | "status" | "action"
  width?: string
}

@Component({
  selector: 'app-teller-api-logs',
  imports: [DynamicTableComponent, CommonModule, FormsModule],
  templateUrl: './teller-api-logs.component.html',
  styleUrl: './teller-api-logs.component.scss'
})

export class TellerApiLogsComponent {
  searchTerm = ""
  fromDate = ""
  toDate = ""
  filteredAuditList: ApiAuditLogEntry[] = []
  auditData: ApiAuditLogEntry[] = []
  currentPage = 1
  itemsPerPage = 10
  isLoading = false

  apiTypes: string[] = ["All"]

  tableColumns: ColumnConfig[] = [
    { key: "id", label: "ID", width: "80px" },
    { key: "user_id", label: "User ID", width: "120px" },
    { key: "type", label: "Type", width: "110px" },
    { key: "url", label: "URL", width: "350px" },
    { key: "requestbody", label: "Request Body", width: "300px" },
    { key: "responsebody", label: "Response Body", width: "300px" },
    { key: "error", label: "Error", width: "300px" },
    { key: "headers", label: "Headers", width: "250px" },
    { key: "created_date", label: "Created Date", width: "200px" },
  ]
  dataCount: any
  today: string = new Date().toISOString().split('T')[0];

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private apiService: ApiGateWayService,
  ) { }

  ngOnInit() {
    this.fromDate = this.formatDateForInput(new Date());
    this.loadAuditData();
  }

  onFromDateChange() {
    if (this.toDate && this.toDate < this.fromDate) {
      this.toDate = this.fromDate;
    }
  }

  onSearch() {
    this.loadAuditData();
    this.currentPage = 1
  }

  onRowClick(logEntry: ApiAuditLogEntry) {
    this.sharedService.setAuditLogData(logEntry)
    this.router.navigate(["/audit-logs-details", logEntry.id])
  }

  loadAuditData() {
    const filter = this.buildFilterObject()
    this.isLoading = true
    this.apiService.post(getApiAuditLogs, filter).subscribe({
      next: (res) => {
        try {
          if (res && res.data && Array.isArray(res.data.logs)) {
            this.dataCount = res.count;
            this.auditData = res.data.logs.map((item: any) => ({
              ...item,
              created_date: item.created_date ? this.sharedService.formatDate(item.created_date) : ''
            }))
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
      error: () => {
        this.auditData = []
        this.filteredAuditList = []
        this.isLoading = false
      },
    })
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

    return filter
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
    this.fromDate = ""
    this.toDate = ""
    this.filteredAuditList = [...this.auditData]
    this.currentPage = 1
  }

  hasActiveFilters(): boolean {
    return !!(
      this.searchTerm ||
      this.fromDate ||
      this.toDate
    )
  }
}
