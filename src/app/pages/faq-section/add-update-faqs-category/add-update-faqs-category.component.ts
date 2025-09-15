import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiGateWayService } from 'app/services/apiGateway.service';
import * as globals from 'app/globals';
import { GlobalProviderService } from 'app/services/global-provider.service';
import { ToastrService } from 'app/services/toastr.service';

@Component({
  selector: 'app-add-update-faqs-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-update-faqs-category.component.html',
  styleUrl: './add-update-faqs-category.component.scss'
})
export class AddUpdateFaqsCategoryComponent {
  @ViewChild('categoryCtrl') categoryCtrl!: NgModel;

  category: any = { categoryname: '' };
  isNew: boolean = true;
  isBusy: boolean = false;
  clickOnSave: boolean = false;
  isFieldsValid: any = { category: true };
  curTab: string = '';
  curSubTab: string = '';

  constructor(
    private router: Router,
    private api: ApiGateWayService,
    private gps: GlobalProviderService,
    private toastr: ToastrService
  ) {
    const state = this.router.getCurrentNavigation()?.extras?.state;
     this.curTab = this.router.getCurrentNavigation()?.extras?.state?.['tab'];
     this.curSubTab = this.router.getCurrentNavigation()?.extras?.state?.['subTab'];

    if (state?.['faqsCategoryData']) {
      this.isNew = false;
      this.category = { ...state['faqsCategoryData'] };
    }
  }

  back() {
    this.router.navigate(['/faq-section'], { state: { tab: this.curTab, subTab: this.curSubTab, child: "faqs_categroy" } });
  }

  changeValidity(field: string) {
    this.isFieldsValid[field] = true;
  }

  save() {
    this.clickOnSave = true;
    this.isFieldsValid.category = true;

    if (!this.runValidations()) return;

    const name = this.category.categoryname?.trim();
    const userId = this.gps.usersID;
    const payload: any = { categoryname: name, isactive: 1 };

    if (this.isNew) {
      payload.createdby = userId;
      payload.created_date = new Date().toISOString();
    } else {
      payload.category_id = this.category.category_id;
      payload.modifiedby = userId;
      payload.modified_date = new Date().toISOString();
    }

    const endpoint = this.isNew
      ? globals.createFaqCategoryEndpoint
      : globals.updateFaqCategoryEndpoint;

    this.isBusy = true;
    this.api.post(endpoint, payload).subscribe({
      next: () => {
        this.isBusy = false;
        this.toastr.success(`FAQ Category ${this.isNew ? 'created' : 'updated'} successfully!`);
        this.back();
      },
      error: (err) => {
        this.isBusy = false;
        console.error('API Error:', err);
        this.toastr.error('Save failed. Check if all fields are valid and try again.');
      }
    });
  }

  private runValidations(): boolean {
    let valid = true;
    if (!this.category.categoryname?.trim()) {
      this.isFieldsValid.category = false;
      valid = false;
      this.toastr.error('Category name is required.');
    }
    return valid;
  }
}
