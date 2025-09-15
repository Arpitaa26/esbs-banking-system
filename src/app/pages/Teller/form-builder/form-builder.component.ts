import { Component } from "@angular/core"
import { type CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop"
import { DragDropModule } from "@angular/cdk/drag-drop"
import { FormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"
import { SharedService } from "../../../services/shared.service"
import { ApiGateWayService } from "app/services/apiGateway.service"
import * as globals from '../../../globals';
import { ToastrService } from "app/services/toastr.service"
import { CommonModalComponent } from "../components/common-modal/common-modal.component"
import { RouterModule } from "@angular/router"

export interface FormField {
  id: string
  type: string
  label: string
  placeholder: string
  required: boolean
  icon: string
  color: string
  options?: any[]
  size?: string
}
@Component({
  selector: 'app-form-builder',
  imports: [DragDropModule, FormsModule, CommonModule, CommonModalComponent, RouterModule],
  templateUrl: './form-builder.component.html',
  styleUrl: './form-builder.component.scss'
})
export class FormBuilderComponent {
  formConfig: any = {
    title: "",
    description: "",
    status: false,
    notification_email: "",
    is_scan_document_allowed: false,
    is_read_only: false
  }
  isEditMode = false
  availableFields: any = []
  formTitle: string = "";
  formPreviewFields: any = []

  showAddFieldModal = false
  showEditFieldModal = false
  editingFieldIndex = -1
  editingField: any | null = null

  newField: any = {
    label: "",
    type: "text",
    placeholder: "",
    size: "100%",
    mandatory: false,
    input_key: "",
    newLine: false,
    options: [],
  }

  fieldTypes = [
    { value: "text", label: "Text" },
    { value: "dropdown", label: "Dropdown" },
    { value: "date", label: "Date" },
    { value: "textarea", label: "Textarea" },
    { value: "checkbox", label: "Checkbox" },
    { value: "email", label: "Email" },
    { value: "number", label: "Number" },
  ]

  sizeOptions = [
    { value: "25%", label: "25%" },
    { value: "50%", label: "50%" },
    { value: "75%", label: "75%" },
    { value: "100%", label: "100%" },
  ]
  scanDocuments: boolean = false;

  constructor(
    private sharedService: SharedService,
    public apiGatewayService: ApiGateWayService,
    public toastr: ToastrService) { }

  ngOnInit() {
    let data = this.sharedService.getSharedData();

    this.getCustomerFeild()
    if (data) {
      this.formConfig = data;
      this.formPreviewFields = this.formConfig.form_fields
    }

    this.isEditMode = !!data;
    this.formTitle = this.isEditMode ? 'Edit customer form' : 'Add customer form';
    this.sharedService.clearSharedData?.();
  }

  getFieldSize(field: FormField): string {
    return field.size || "100%"
  }

  onFieldDrop(event: CdkDragDrop<FormField[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)
    } else {
      const draggedField = event.previousContainer.data[event.previousIndex]
      const newField: FormField = {
        ...draggedField,
        id: `preview-${draggedField.id}-${Date.now()}`,
      }

      this.formPreviewFields.splice(event.currentIndex, 0, newField)
    }
  }

  onPreviewReorder(event: CdkDragDrop<FormField[]>) {
    moveItemInArray(this.formPreviewFields, event.previousIndex, event.currentIndex)
  }

  removeField(index: number) {
    this.formPreviewFields.splice(index, 1)
  }

  editField(index: number) {
    this.editingFieldIndex = index
    this.editingField = { ...this.availableFields[index] }

    this.newField = {
      label: this.editingField.label,
      type: this.editingField.type,
      placeholder: this.editingField.placeholder,
      size: this.editingField.size || "100%",
      mandatory: this.editingField.required,
      input_key: this.editingField.input_key,
      newLine: false,
      options: this.editingField.options ? [...this.editingField.options] : [],
    }

    this.showEditFieldModal = true
  }

  saveEditedField() {
    if (!this.newField.label || !this.newField.type || !this.newField.placeholder || !this.newField.input_key || !this.newField.size) {
      this.toastr.error("Please fill all required fields")
      return
    }
    const columnSize =
      this.newField.size === "25%" ? 3 :
      this.newField.size === "50%" ? 6 :
      this.newField.size === "75%" ? 9 :
      this.newField.size === "100%" ? 12 :
      0;

    console.log("columnSize", columnSize)
    if (this.editingFieldIndex > -1) {
      const updatedField: any = {
        ...this.availableFields[this.editingFieldIndex],
        label: this.newField.label,
        type: this.newField.type,
        placeholder: this.newField.placeholder,
        required: this.newField.mandatory,
        size: columnSize,
        input_key: this.newField.input_key,
        options: this.newField.options || [],
        color: this.getFieldColor(this.newField.type),
        icon: this.getFieldIcon(this.newField.type),
      }

      this.updateCustomerFeilds(updatedField)
      this.closeEditFieldModal()
    }
  }

  addCustomerMenu(data: any) {

    let body = {
      ...data.config,
      form_fields: [...data.fields]
    };
    this.apiGatewayService.post(globals.creatCustomerMenu,
      body
    ).subscribe({
      next: (res) => {
        this.toastr.success(res.message);
        window.history.back()
      }
    });
  }

  updateCustomerMenu(data: any) {
    let body = {
      ...data.config,
      form_fields: [...data.fields]
    };
    this.apiGatewayService.post(globals.updateCustomerMenu(this.formConfig.tel_customer_menu_id),
      body
    ).subscribe({
      next: (res) => {
        this.toastr.success(res.message);
        window.history.back()
      }
    });
  }

  closeEditFieldModal() {
    this.showEditFieldModal = false
    this.editingFieldIndex = -1
    this.editingField = null
    this.resetNewField()
  }

  addNewFieldType() {
    this.showAddFieldModal = true
    this.resetNewField()
  }

  closeAddFieldModal() {
    this.showAddFieldModal = false
    this.resetNewField()
  }

  resetNewField() {
    this.newField = {
      label: "",
      type: "text",
      placeholder: "",
      size: "100%",
      mandatory: false,
      input_key: "",
      newLine: false,
      options: [],
    }
  }

  addOptionToField() {
    this.newField.options.push({ label: "", value: "" })
  }

  removeOption(index: number) {
    this.newField.options.splice(index, 1)
  }

  saveNewField() {
    if (!this.newField.label || !this.newField.type || !this.newField.placeholder || !this.newField.input_key || !this.newField.size) {
      this.toastr.error("Please fill all required fields")
      return
    }

    const fieldColor = this.getFieldColor(this.newField.type)
    const fieldIcon = this.getFieldIcon(this.newField.type)
    const columnSize =
      this.newField.size === "25%" ? 3 :
      this.newField.size === "50%" ? 6 :
      this.newField.size === "75%" ? 9 :
      this.newField.size === "100%" ? 12 : 0;

    const newFieldType: any = {
      id: this.newField.type + "-" + Date.now(),
      type: this.newField.type,
      label: this.newField.label,
      placeholder: this.newField.placeholder,
      is_mandatory: this.newField.mandatory,
      icon: fieldIcon,
      color: fieldColor,
      input_key: this.newField.input_key,
      size: columnSize,
      options: this.newField.options || [],
    }

    this.saveCustomerFeilds(newFieldType)

    this.closeAddFieldModal()
  }

  saveCustomerFeilds(data: any) {
    let body = data;
    this.apiGatewayService.post(globals.createFormField,
      body
    ).subscribe({
      next: (res) => {
        this.toastr.success(res.message);
        this.getCustomerFeild()
      }
    });
  }

  updateCustomerFeilds(data: any) {
    let body = data;
    this.apiGatewayService.post(globals.updateFormField(this.editingField.tel_form_fields_id),
      body
    ).subscribe({
      next: (res) => {
        this.toastr.success(res.message);
        this.getCustomerFeild()
      }
    });
  }

  deleteCustomerFeilds() {

    let body = {};
    this.apiGatewayService.post(globals.deleteFormField(this.editingField.tel_form_fields_id),
      body
    ).subscribe({
      next: (res) => {
        this.toastr.success(res.message);
        this.showDeleteModal = false;
        this.getCustomerFeild()

      }
    });
  }

  getFieldColor(type: string): string {
    const colors: { [key: string]: string } = {
      text: "#E8D5FF",
      dropdown: "#E6F3FF",
      date: "#E6F3FF",
      textarea: "#FFF2CC",
      checkbox: "#E8F5E8",
      email: "#FFE6E6",
      number: "#F0F9FF",
    }
    return colors[type] || "#F3F4F6"
  }

  getFieldIcon(type: string): string {
    const icons: { [key: string]: string } = {
      text: "📝",
      dropdown: "📋",
      date: "📅",
      textarea: "📄",
      checkbox: "☑️",
      email: "📧",
      number: "🔢",
    }
    return icons[type] || "📝"
  }

  onSubmit() {
    this.formConfig.status = this.formConfig.status ? 1 : 0
    this.formConfig.is_scan_document_allowed = this.formConfig.is_scan_document_allowed ? 1 : 0
    this.formConfig.is_read_only = this.formConfig.is_read_only ? 1 : 0
    let passData = {
      config: this.formConfig,
      fields: this.formPreviewFields,
    }
    if (this.isEditMode) {
      this.updateCustomerMenu(passData)
    } else {
      this.addCustomerMenu(passData)
    }
  }

  toggleScanDocuments(event: any) {
    this.scanDocuments = event.target.checked;
  }

  getCustomerFeild() {
    this.apiGatewayService.get(globals.getFormField,
    ).subscribe({
      next: (res) => {
        this.availableFields = res.data.map((data: any) => {
          return {
            ...data,
            size: data.size === 3 ? "25%" :
              data.size === 6 ? "50%" :
                data.size === 9 ? "75%" :
                  data.size === 12 ? "100%" :
                    "0%",
            color: this.getFieldColor(data.type),
            icon: this.getFieldIcon(data.type)
          }
        })
        console.log("this.availableFields", this.availableFields)
      }
    });

  }
  showDeleteModal = false;
  deleteField(index: any) {
    this.showDeleteModal = true;
    this.editingFieldIndex = index
    this.editingField = { ...this.availableFields[index] }

  }

  deleteModalButton = [
    { label: 'Cancel', class: 'btn btn-outline', action: 'close', icon: 'bi bi-x-circle' },
    { label: 'Delete', class: 'btn btn-primary', action: 'save', icon: 'bi bi-trash' }
  ]

  closeTillModal() {
    this.showDeleteModal = false;
  }

  deleteMenu(data: any) {
    this.deleteCustomerFeilds()
  }

}
