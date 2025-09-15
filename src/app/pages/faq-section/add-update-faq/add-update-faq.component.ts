import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import Quill from 'quill';
import { ApiGateWayService } from 'app/services/apiGateway.service';
import { GlobalProviderService } from 'app/services/global-provider.service';
import { ToastrService } from 'app/services/toastr.service';
import * as globals from 'app/globals';

@Component({
  selector: 'app-add-update-faq',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-update-faq.component.html',
  styleUrl: './add-update-faq.component.scss'
})
export class AddUpdateFaqComponent implements AfterViewInit {

  @ViewChild('categoryCtrl') categoryCtrl!: NgModel;
  @ViewChild('titleCtrl') titleCtrl!: NgModel;

  quillEditor: Quill | undefined;
  previewHtml: any;
  categorylist: any;
  curTab: string = '';
  curSubTab: string = '';

  faqsData: any = {
    title: "",
    description: "",
    category: "app",
    type: "mobile",
    category_id: ""
  };
  isBusy: boolean = false;
  isNew: boolean = true;
  clickOnSave: boolean = false;
  isFieldsValid: any = {
    category: true,
    title: true,
    description: true
  };

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer,
    private apiService: ApiGateWayService,
    private gps: GlobalProviderService,
    private toastr: ToastrService
  ) {
    this.loadFaqCategories();
    const state = this.router.getCurrentNavigation()?.extras?.state;
    this.curTab = this.router.getCurrentNavigation()?.extras?.state?.['tab'];
    this.curSubTab = this.router.getCurrentNavigation()?.extras?.state?.['subTab'];

    if (state?.['faqData']) { this.isNew = false; }
    this.faqsData = state?.['faqData'] || {
      category: 'app',
      title: '',
      type: 'mobile',
      description: ''
    };
  }

  ngAfterViewInit(): void {
    this.quillEditor = new Quill('#editor-container', {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ font: [] }, { size: ['small', false, 'large', 'huge'] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ align: [] }],
          ['link', 'image'],
          ['clean']
        ]
      }
    });

    if (this.faqsData.description) {
      this.quillEditor.root.innerHTML = this.faqsData.description;
      this.updatePreview();
    }

    this.quillEditor.on('text-change', () => {
      this.faqsData.description = this.quillEditor?.root.innerHTML;
      this.updatePreview();
      this.isFieldsValid.description = true;
    });
  }

  updatePreview() {
    this.previewHtml = this.sanitizer.bypassSecurityTrustHtml(this.faqsData.description);
  }

  back() {
    this.router.navigate(['/faq-section'], { state: { tab: this.curTab, subTab: this.curSubTab, child: "faqs" } } );
  }

  changeValidity(field: string) {
    this.isFieldsValid[field] = true;
  }

  loadFaqCategories() {
    this.apiService.get(globals.getFaqCategoriesEndpoint).subscribe({
      next: (response: any) => {
        this.categorylist = response.data.filter((x: any) => x.isactive === 1);
      },
      error: (err: any) => console.error('Error loading FAQ categories:', err)
    });
  }

  save() {
    this.clickOnSave = true;
    this.isFieldsValid.category = true;
    this.isFieldsValid.title = true;
    this.isFieldsValid.description = true;

    if (!this.runValidations()) return;

    const isCreating = this.isNew;
    const endpoint = isCreating ? globals.createFaqEndpoint : globals.updateFaqEndpoint;
    const payload: any = {
      ...this.faqsData,
      title: this.faqsData.title.trim(),
      description: this.quillEditor?.root.innerHTML.trim(),
      category_id: this.faqsData.category_id,
    };
    if (isCreating) { payload.createdby = this.gps.usersID; payload.isactive = 1; }
    else { payload.faq_id = this.faqsData.faq_id; }

    this.isBusy = true;
    this.apiService.post(endpoint, JSON.parse(JSON.stringify(payload))).subscribe({
      next: () => {
        this.toastr.success(`FAQ ${isCreating ? 'created' : 'updated'} successfully!`);
        this.isBusy = false;
        this.back();
      },
      error: (error: any) => {
        console.error(`Error ${isCreating ? 'creating' : 'updating'} FAQ:`, error);
        this.toastr.error(`Failed to ${isCreating ? 'create' : 'update'} FAQ. Please try again.`);
        this.isBusy = false;
      }
    });
  }

  private runValidations(): boolean {
  const description = this.quillEditor?.root.innerHTML?.trim();


  if (!this.faqsData.category_id) {
    this.isFieldsValid.category = false;
    this.toastr.error('Please select a category.');
    return false;
  } else {
    this.isFieldsValid.category = true;
  }

  if (!this.faqsData.title?.trim()) {
    this.isFieldsValid.title = false;
    this.toastr.error('Title is required.');
    return false;
  } else {
    this.isFieldsValid.title = true;
  }

  if (!description || description === '<p><br></p>') {
    this.isFieldsValid.description = false;
    this.toastr.error('Description is required.');
    return false;
  } else {
    this.isFieldsValid.description = true;
  }

  return true;
}
}
