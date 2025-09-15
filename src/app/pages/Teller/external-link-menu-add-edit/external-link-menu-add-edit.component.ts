import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SharedService } from '../../../services/shared.service';
import { ApiGateWayService } from '../../../services/apiGateway.service';
import * as globals from '../../../globals';
import { ToastrService } from '../../../services/toastr.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-external-link-menu-add-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './external-link-menu-add-edit.component.html',
  styleUrl: './external-link-menu-add-edit.component.scss'
})
export class ExternalLinkMenuAddEditComponent {
  formConfigForm!: FormGroup;
  customerMenuData: any;
  isEditMode = false
  formTitle: any;

  constructor(
    private fb: FormBuilder,
    public sharedService: SharedService,
    public apiGatewayService: ApiGateWayService,
    private toastr: ToastrService,
    private router : Router
  ) { }

  ngOnInit(): void {

    this.customerMenuData = this.sharedService.getSharedData();
    this.isEditMode = !!this.customerMenuData;

    this.formTitle = this.isEditMode ? 'Edit external link menu' : 'Add external link menu';
    if (this.isEditMode) {
      this.formConfigForm = this.fb.group({
        title: [this.customerMenuData?.title || '', Validators.required],
        link: [
          this.customerMenuData?.link || '',
          [Validators.required, Validators.pattern(/^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/)]
        ],
        status: [this.customerMenuData?.status || false],
        description: [this.customerMenuData?.description || '', Validators.required]
      });
    } else {
      this.formConfigForm = this.fb.group({
        title: ['', Validators.required],
        link: ['', [Validators.required, Validators.pattern(/^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/)]],
        status: [false],
        description: ['', Validators.required]
      });
    }
    this.sharedService.clearSharedData?.();

  }

  saveEditedField(): void {
    if (this.formConfigForm.valid) {
      const formData = this.formConfigForm.value;
      if (this.isEditMode) {
        this.updateExternalLink(formData)
      } else {
        this.addExternalLink(formData)
      }
    } else {
      this.formConfigForm.markAllAsTouched();
      this.toastr.error('Enter Valid Details');
    }
  }

  get f() {
    return this.formConfigForm.controls;
  }

  addExternalLink(data: any) {
    let body = data;
    this.apiGatewayService.post(globals.createExternalLink,
      body
    ).subscribe({
      next: (res) => {
        this.toastr.success(res.message);
        this.router.navigate(['/external-link-menu']);
      }
    });
  }

  updateExternalLink(data: any) {
    data.status = data.status == "Active" ? 1 : 0
    let body = data
    this.apiGatewayService.post(globals.updateExternalLink(this.customerMenuData.tel_external_link_id),
      body
    ).subscribe({
      next: (res) => {
        this.toastr.success(res.message);
        this.router.navigate(['/external-link-menu']);
      }
    });


  }
}
