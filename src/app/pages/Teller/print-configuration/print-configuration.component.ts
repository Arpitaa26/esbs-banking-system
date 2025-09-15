import { Component } from "@angular/core"
import { DynamicTableComponent } from "../components/dynamic-table/dynamic-table.component"
import { ApiGateWayService } from "app/services/apiGateway.service"
import { ToastrService } from "app/services/toastr.service"
import { getAllPrintConfigs, createPrintConfig, updatePrintConfig, deletePrintConfig } from "app/globals"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { CommonModalComponent } from "../components/common-modal/common-modal.component"

export interface PrintConfigEntry {
  config_id: number
  name: string
  config_type: string
  height_mm: number
  width_mm: number
  font_type: string
  lines_per_inch: string
  characters_per_inch: string
  selected?: boolean;
}
@Component({
  selector: "app-print-configuration",
  imports: [CommonModule, FormsModule, DynamicTableComponent, CommonModalComponent],
  templateUrl: "./print-configuration.component.html",
  styleUrl: "./print-configuration.component.scss",
})
export class PrintConfigurationComponent {
  currentPage: number = 1;
  tabs = [
    { name: "Passbook Settings", value: "passbook", active: true },
    { name: "Cheque Book Settings", value: "chequebook", active: false },
  ]

  activeTab = "passbook"
  staffList: PrintConfigEntry[] = []
  filteredList: PrintConfigEntry[] = []
  selectedConfigCount = 0
  hasSelectedConfig = false
  itemsPerPage = 10
  searchTerm = ""
  isLoading = false
  isEditMode = false
  currentEditId: number | null = null

  showPrintConfigModal = false
  showDeleteModal = false
  modalHeader = "Add Print Configuration"

  tableColumns: { key: string; label: string; type?: "text" | "status" | "action-icon"; action?: any[] }[] = [
    { key: "name", label: "Name" },
    { key: "config_type", label: "Config Type" },
    { key: "height_mm", label: "Height (mm)" },
    { key: "width_mm", label: "Width (mm)" },
    { key: "font_type", label: "Font Type" },
    { key: "lines_per_inch", label: "LPI" },
    { key: "characters_per_inch", label: "CPI" },
    { key: 'action', label: 'Actions', type: 'action-icon' }
  ]

  newConfig: PrintConfigEntry = {
    config_id: 0,
    name: "",
    config_type: "passbook",
    height_mm: 0,
    width_mm: 0,
    font_type: "Roman",
    lines_per_inch: "6 LPI",
    characters_per_inch: "10 CPI"
  }

  fontTypes = [
    { label: "Roman (Default)", value: "Roman" },
    { label: "OCR-A", value: "OCR-A" },
    { label: "OCR-B", value: "OCR-B" },
    { label: "Courier", value: "Courier" },
    { label: "Sans Serif", value: "Sans Serif" },
  ]

  lpiOptions = [
    { label: "6 LPI (Default)", value: "6 LPI" },
    { label: "8 LPI", value: "8 LPI" },
  ]

  cpiOptions = [
    { label: "10 CPI (Default)", value: "10 CPI" },
    { label: "12 CPI", value: "12 CPI" },
    { label: "15 CPI", value: "15 CPI" },
    { label: "17 CPI", value: "17 CPI" },
    { label: "20 CPI", value: "20 CPI" },
  ]

  printConfigModalButtons = [
    { label: "Cancel", class: "btn btn-outline", action: "cancel", icon: "bi bi-x-circle" },
    { label: "Save Settings", class: "btn btn-primary", action: "save", icon: "bi bi-printer" },
  ]

  deleteModalButtons = [
    { label: "Cancel", class: "btn btn-outline", action: "cancel" },
    { label: "Delete", class: "btn btn-danger", action: "confirm" },
  ]
  configToDelete: any

  constructor(
    private apiService: ApiGateWayService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.loadConfigurations()
  }

  loadConfigurations(): void {
    this.isLoading = true;
    this.apiService.get(getAllPrintConfigs).subscribe({
      next: (res) => {
        this.staffList = (res.data || []).map((config: any) => ({
          ...config,
          action: [
            {
              label: "Edit",
              class: "action-btn edit-btn",
              icon: `<i class="bi bi-pencil-square"></i>`,
              callback: (row: any) => this.editConfig(row),
            },
            {
              label: "",
              class: "action-icon text-danger",
              icon: `<i class="bi bi-trash"></i>`,
              callback: (row: any) => this.deleteConfig(row),
            },
          ]
        }));
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
      },
    });
  }

  createConfiguration(config: PrintConfigEntry): void {
    this.isLoading = true
    const { config_id, ...payload } = config
    this.apiService.post(createPrintConfig, payload).subscribe({
      next: (res) => {
        this.toastr.success("Configuration created successfully")
        this.loadConfigurations()
        this.closePrintConfigModal()
        this.isLoading = false
      },
      error: (error) => {
        this.isLoading = false
      }
    })
  }

  updateConfiguration(id: number, config: PrintConfigEntry): void {
    this.isLoading = true
    this.apiService.post(updatePrintConfig(id), config).subscribe({
      next: (res) => {
        this.toastr.success("Configuration updated successfully")
        this.loadConfigurations()
        this.closePrintConfigModal()
        this.isLoading = false
      },
      error: (error) => {
        this.isLoading = false
      },
    })
  }

  deleteConfiguration(ids: number[]): void {
    this.isLoading = true
    const payload = { config_ids: ids }
    this.apiService.post(deletePrintConfig, payload).subscribe({
      next: (res) => {
        this.toastr.success("Configuration(s) deleted successfully")
        this.loadConfigurations()
        this.isLoading = false
      },
      error: (error) => {
        this.isLoading = false
      },
    })
  }

  get filteredStaffList(): PrintConfigEntry[] {
    return this.filteredList
  }

  applyFilters(): void {
    let filtered = this.staffList

    if (this.activeTab === "passbook") {
      filtered = filtered.filter((item) => item.config_type?.toLowerCase() === "passbook")
    } else {
      filtered = filtered.filter((item) => item.config_type?.toLowerCase() === "cheque")
    }

    if (this.searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          item.config_type?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          item.font_type?.toLowerCase().includes(this.searchTerm.toLowerCase()),
      )
    }

    this.filteredList = filtered
    this.updateSelectionCount()
  }

  searchConfigs(searchTerm: string): void {
    this.searchTerm = searchTerm
    this.applyFilters()
  }

  selectTab(tabValue: string): void {
    this.tabs.forEach((tab) => (tab.active = tab.value === tabValue))
    this.activeTab = tabValue
    this.applyFilters()
  }

  openPrintModal(): void {
    this.isEditMode = false
    this.currentEditId = null
    this.modalHeader = "Add Print Configuration"
    this.resetForm()
    this.showPrintConfigModal = true
  }

  editConfig(config: any): void {
    this.isEditMode = true
    this.currentEditId = config.config_id;
    console.log(this.currentEditId);
    this.modalHeader = "Edit Print Configuration"
    this.newConfig = { ...config }
    this.showPrintConfigModal = true
  }

  deleteConfig(config: any): void {
    console.log(config);
    this.configToDelete = config.config_id;
    this.showDeleteModal = true
  }

  handlePrintConfigAction(action: string): void {
    if (action === "cancel") {
      this.closePrintConfigModal()
      return
    }

    if (action === "save") {
      if (this.isEditMode && this.currentEditId) {
        this.updateConfiguration(this.currentEditId, this.newConfig)
      } else {
        this.createConfiguration(this.newConfig)
      }
    }
  }

  handleDeleteAction(action: string): void {
    console.log(action, this.currentEditId)
    if (action === "cancel") {
      this.closeDeleteModal()
      return
    }
    if (action === "confirm" && this.configToDelete) {
      this.deleteConfiguration([this.configToDelete])
      this.closeDeleteModal()
    }
  }

  closePrintConfigModal(): void {
    this.showPrintConfigModal = false
    this.resetForm()
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false
    this.currentEditId = null
  }

  resetForm(): void {
    this.newConfig = {
      config_id: 0,
      name: "",
      config_type: this.activeTab,
      height_mm: 0,
      width_mm: 0,
      font_type: "Roman",
      lines_per_inch: "6 LPI",
      characters_per_inch: "10 CPI"
    }
  }

  toggleStaffSelection(entry: any): void {
    console.log(entry);
    entry.selected = !entry.selected
    this.updateSelectionCount();
  }

    goToPage(page: any): void {
    this.currentPage = page;
  }

  toggleSelectAll(): void {
    // const allSelected = this.filteredStaffList.every((e) => e.selected)
    // this.filteredStaffList.forEach((e) => (e.selected = !allSelected))
    this.updateSelectionCount()
  }

  updateSelectionCount(): void {
    // const selected = this.filteredStaffList.filter((e) => e.selected)
    // this.selectedConfigCount = selected.length
    // this.hasSelectedConfig = selected.length > 0
  }

  deleteSelectedConfigs(): void {
    // const selectedConfigs = this.filteredStaffList.filter((e) => e.selected)
    // if (selectedConfigs.length === 0) return

    // const selectedIds = selectedConfigs
    //   .map((config) => config.id)
    //   .filter((id): id is number => id !== undefined && id !== null)

    // if (selectedIds.length > 0) {
    //   this.deleteConfiguration(selectedIds)
    // }
  }

  downloadJSON(): void {
    const dataStr = JSON.stringify(this.filteredStaffList, null, 2)
    const blob = new Blob([dataStr], { type: "application/json" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${this.activeTab}-config.json`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  downloadCSV(): void {
    const items = this.filteredStaffList
    if (!items.length) return

    const headers = Object.keys(items[0]).filter((key) => key !== "selected")
    const csv = [headers.join(","), ...items.map((row) => headers.map((k) => (row as any)[k]).join(","))].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${this.activeTab}-config.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }
}
