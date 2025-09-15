import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Quill from 'quill';
import { ApiGateWayService } from 'app/services/apiGateway.service';
import { GlobalProviderService } from 'app/services/global-provider.service';
import * as globals from 'app/globals';
import { ToastrService } from 'app/services/toastr.service';

@Component({
  selector: 'app-add-update-important-information',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-update-important-information.component.html',
  styleUrls: ['./add-update-important-information.component.scss']
})
export class AddUpdateImportantInformationComponent implements AfterViewInit {
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;
  quillEditor!: Quill;
  ImpInfo: any = { title: '', message: '' };
  isNew = true;
  isBusy = false;
  clickOnSave = false;
  isFieldsValid: any = { title: true, message: true };
  curTab: string = '';
  curSubTab: string = '';
  constructor(
    private router: Router,
    private api: ApiGateWayService,
    private gps: GlobalProviderService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService
  ) {
    this.curTab = this.router.getCurrentNavigation()?.extras?.state?.['tab'];;
    this.curSubTab = this.router.getCurrentNavigation()?.extras?.state?.['subTab'];
    const data = this.router.getCurrentNavigation()?.extras?.state?.['ImpInfoData'];
    if (data) {
      this.isNew = false;
      this.ImpInfo = { ...data };
    }
  }

  ngAfterViewInit(): void {
    this.initializeQuillEditor();
  }

  initializeQuillEditor(): void {
    this.quillEditor = new Quill(this.editorContainer.nativeElement, {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ font: [] }, { size: ['small', false, 'large', 'huge'] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }],
          [{ script: 'sub' }, { script: 'super' }],
          [{ header: 1 }, { header: 2 }],
          [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
          [{ align: [] }],
          ['blockquote', 'code-block'],
          ['link', 'image'],
          ['clean']
        ]
      },
      placeholder: 'Enter your content here...'
    });
    if (this.ImpInfo.message) {
      this.quillEditor.root.innerHTML = this.ImpInfo.message;
    }
    this.quillEditor.on('text-change', () => {
      // this.hasBody  = false;
      this.ImpInfo.message = this.quillEditor.root.innerHTML;
      this.changeValidity('message');
    });
  }

  changeValidity(field: string) {
    this.isFieldsValid[field] = true;
  }

  back(): void {
    this.router.navigate(['/app-settings'], { state: { tab: this.curTab, subTab: this.curSubTab } });
  }

  private runValidations(): boolean {
    this.isFieldsValid = { title: true, message: true };
    if (!this.ImpInfo.title || !this.ImpInfo.title.trim()) {
      this.isFieldsValid.title = false;
      this.toastr.error('Title is required.');
      return false;
    }
    const plainText = this.quillEditor.getText()?.replace(/\s/g, '');
    if (!plainText) {
      this.isFieldsValid.message = false;
      this.toastr.error('Message body is required.');
      return false;
    }
    return true;
  }

  save(): void {
    this.clickOnSave = true;
    this.isFieldsValid = { title: true, message: true };
    if (!this.runValidations()) return;
    this.ImpInfo.message = this.quillEditor.root.innerHTML;
    const userId = this.gps.usersID;
    const payload: any = {
      title: this.ImpInfo.title.trim(),
      message: this.ImpInfo.message,
      isactive: 1
    };
    if (this.isNew) {
      payload.createdby = userId;
      payload.created_date = new Date().toISOString();
    } else {
      payload.product_information_id = this.ImpInfo.product_information_id;
      payload.modifiedby = userId;
      payload.modified_date = new Date().toISOString();
    }
    const endpoint = this.isNew
      ? globals.addProductInformationEndpoint
      : globals.updateProductsInformationEndpoint;
    this.isBusy = true;
    this.api.post(endpoint, payload).subscribe({
      next: () => {
        this.isBusy = false;
        this.toastr.success(`Information ${this.isNew ? 'added' : 'updated'} successfully!`);
        this.back();
      },
      error: (err) => {
        this.isBusy = false;
        console.error('Save Error:', err);
        this.toastr.error('Save failed. Try again.');
      }
    });
  }
}
