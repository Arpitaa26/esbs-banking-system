import { CommonModule } from "@angular/common"
import { Component, Input, Output, EventEmitter, SimpleChanges } from "@angular/core"
import { type NoDataConfig, NoDataComponent } from "../no-data/no-data.component"
import { FormsModule } from "@angular/forms"
export interface ColumnConfig {
  key: string
  label: string
  type?: "text" | "status" | "action-icon" | "action"
  width?: string
}
export interface PaginationItem {
  type: "page" | "ellipsis"
  value: number | string
  active?: boolean
  disabled?: boolean
}
@Component({
  selector: "app-dynamic-table",
  standalone: true,
  imports: [CommonModule, FormsModule, NoDataComponent],
  templateUrl: "./dynamic-table.component.html",
  styleUrls: ["./dynamic-table.component.scss"],
})
export class DynamicTableComponent {
  @Input() data: any[] = []
  @Input() columns: ColumnConfig[] = []
  @Input() withCheckbox = false
  @Input() enablePagination = true
  @Input() rowsPerPage = 10
  @Input() dataCount = 0
  @Output() rowClick = new EventEmitter<any>()
  @Output() pageChange = new EventEmitter<number>()
  @Output() selectionChange = new EventEmitter<any[]>()
  @Output() pageSizeChange = new EventEmitter<number>()

  selectedRow: any
  currentPage = 1
  pageSizes = [10, 20, 25, 50, 100]

  noDataConfig: NoDataConfig = {
    title: "No Records Available",
    description:
      "There is currently no data in this table. Once records are added, they will appear here for review and management.",
    icon: "table",
    showButton: false,
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['data']) {
  //     console.log("DynamicTableComponent data changed:", this.data);
  //   }
  // }

  trackByColumn(index: number, column: ColumnConfig): string {
    return column.key
  }

  isString(value: any): boolean {
    return typeof value === 'string';
  }

  trackByRow(index: number, row: any): any {
    return row?.id || row?.ID || index
  }

  trackByAction(index: number, action: any): any {
    return action?.id || action?.label || index
  }

  trackByPaginationItem(index: number, item: PaginationItem): any {
    return `${item.type}-${item.value}`
  }

  get totalCount(): number {
    return this.dataCount ? this.dataCount : this.data?.length || 0;
  }

  get totalPages(): number {
    if (this.totalCount === 0 || this.rowsPerPage === 0) return 1
    return Math.ceil(this.totalCount / this.rowsPerPage)
  }

  get isAllSelected(): boolean {
    return this.data?.length > 0 && this.data.every((item) => item.selected)
  }

  get isIndeterminate(): boolean {
    if (!this.data?.length) return false
    const selected = this.data.filter((item) => item.selected)
    return selected.length > 0 && selected.length < this.data.length
  }

  get selectedItems(): any[] {
    return this.data?.filter((item) => item.selected) || []
  }

  toggleSelectAll(): void {
    if (!this.data?.length) return
    const newState = !this.isAllSelected
    this.data.forEach((row) => (row.selected = newState))
    this.selectionChange.emit(this.selectedItems)
  }

  toggleSelection(row: any): void {
    if (!row) return
    row.selected = !row.selected
    this.selectionChange.emit(this.selectedItems)
  }

  handleAction(action: any, row: any): void {
    if (action?.callback) {
      action.callback(row)
    }
  }

  onRowClick(row: any): void {
    if (!row) return
    this.selectedRow = row
    this.rowClick.emit(row)
  }

  get pageStart(): number {
    return (this.currentPage - 1) * this.rowsPerPage
  }

  get pageEnd(): number {
    const end = this.pageStart + this.rowsPerPage
    return end > this.totalCount ? this.totalCount : end
  }

  paginatedData(): any[] {
    if(this.dataCount) {
      return this.data;
    } else {
      if (!this.enablePagination || !this.data?.length) return this.data || []
      const start = this.pageStart
      const end = start + this.rowsPerPage
      return this.data.slice(start, end)
    }
  }

  goToPrevious(): void {
    if (this.currentPage > 1) {
      this.currentPage--
      this.pageChange.emit(this.currentPage)
    }
  }

  goToNext(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++
      this.pageChange.emit(this.currentPage)
    }
  }

  goToPage(page: number | string): void {
    const pageNumber = typeof page === "string" ? Number.parseInt(page, 10) : page
    if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > this.totalPages) return

    this.currentPage = pageNumber
    this.pageChange.emit(this.currentPage)
  }

  onPageSizeChange(): void {
    this.currentPage = 1
    this.pageSizeChange.emit(this.rowsPerPage)
    this.pageChange.emit(this.currentPage)
  }

  getColumnWidth(column: ColumnConfig): string {
    return column?.width || "auto"
  }

  truncateText(text: string, maxLength = 50): string {
    if (!text || typeof text !== "string") return ""
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  getStatusClass(status: string): string {
    if (!status || typeof status !== "string") return "status-unknown"
    return `status-${status.toLowerCase().replace(/\s+/g, "-")}`
  }

  isRowSelected(row: any): boolean {
    return this.selectedRow === row
  }

  getPaginationItems(): PaginationItem[] {
    const items: PaginationItem[] = []
    const totalPages = this.totalPages
    const currentPage = this.currentPage

    if (totalPages <= 0 || currentPage <= 0) return items

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        items.push({
          type: "page",
          value: i,
          active: i === currentPage,
        })
      }
    } else {
      items.push({
        type: "page",
        value: 1,
        active: currentPage === 1,
      })

      if (currentPage <= 4) {
        for (let i = 2; i <= Math.min(5, totalPages - 1); i++) {
          items.push({
            type: "page",
            value: i,
            active: i === currentPage,
          })
        }
        if (totalPages > 6) {
          items.push({
            type: "ellipsis",
            value: "...",
            disabled: true,
          })
        }
      } else if (currentPage >= totalPages - 3) {
        if (totalPages > 6) {
          items.push({
            type: "ellipsis",
            value: "...",
            disabled: true,
          })
        }
        for (let i = Math.max(2, totalPages - 4); i <= totalPages - 1; i++) {
          items.push({
            type: "page",
            value: i,
            active: i === currentPage,
          })
        }
      } else {
        items.push({
          type: "ellipsis",
          value: "...",
          disabled: true,
        })

        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          if (i > 1 && i < totalPages) {
            items.push({
              type: "page",
              value: i,
              active: i === currentPage,
            })
          }
        }

        items.push({
          type: "ellipsis",
          value: "...",
          disabled: true,
        })
      }

      if (totalPages > 1 && !items.some((item) => item.value === totalPages)) {
        items.push({
          type: "page",
          value: totalPages,
          active: currentPage === totalPages,
        })
      }
    }

    return items
  }

  onPaginationItemClick(item: PaginationItem): void {
    if (item?.type === "page" && typeof item.value === "number") {
      this.goToPage(item.value)
    }
  }
}
