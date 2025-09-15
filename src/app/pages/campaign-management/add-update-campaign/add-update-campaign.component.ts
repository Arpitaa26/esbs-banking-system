import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiGateWayService } from 'app/services/apiGateway.service';
import * as globals from 'app/globals';
import { GlobalProviderService } from 'app/services/global-provider.service';
import { ToastrService } from 'app/services/toastr.service';

@Component({
  selector: 'app-add-update-campaign',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-update-campaign.component.html',
  styleUrls: ['./add-update-campaign.component.scss'],
})
export class AddUpdateCampaignComponent {
  @ViewChild('campaignTitleCtrl') campaignTitleCtrl!: NgModel;
  @ViewChild('typeCtrl') typeCtrl!: NgModel;
  @ViewChild('productCtrl') productCtrl!: NgModel;
  @ViewChild('marketingCtrl') marketingCtrl!: NgModel;
  @ViewChild('startDateCtrl') startDateCtrl!: NgModel;
  @ViewChild('endDateCtrl') endDateCtrl!: NgModel;
 curTab: string = '';
  campaign: any = {};
  productsList: any[] = [];
  marketingList: any[] = [];
  isBusy = false;
  isEdit = false;
  clickOnSave = false;

  isFieldsValid: any = {
    campaign_title: true,
    type: true,
    products_id: true,
    pushmessages_id: true,
    start_date: true,
    end_date: true
  };

  constructor(
    private router: Router,
    private api: ApiGateWayService,
    private gps: GlobalProviderService,
    private toastr: ToastrService
  ) {
    const nav = this.router.getCurrentNavigation()?.extras?.state;
  this.curTab = nav?.['tab'] || 'active';

  const data = nav?.['campaignData'];
    if (data) {
      this.isEdit = true;
      const formattedStartDate = this.formatDateString(data.start_date);
      const formattedEndDate = this.formatDateString(data.end_date);
      this.campaign = {
        ...data,
        pushmessages_id: data.pushmessage_id,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
      };
    } else {
      this.campaign = {
        campaign_title: '',
        type: '',
        products_id: 0,
        pushmessage_id: 0,
        start_date: '',
        end_date: '',
        title: '',
        allcustomers: true,
      };
    }
    this.loadDropdowns();
  }

  formatDateString(date: string | Date): string {
    if (!date) return '';
    if (typeof date === 'string') {
      const parts = date.split('-');
      if (parts.length === 3) {
        const [dd, mm, yyyy] = parts;
        const isoFormatted = `${yyyy}-${mm}-${dd}`;
        const parsed = new Date(isoFormatted);
        return isNaN(parsed.getTime()) ? '' : parsed.toISOString().split('T')[0];
      } else {
        const parsed = new Date(date);
        return isNaN(parsed.getTime()) ? '' : parsed.toISOString().split('T')[0];
      }
    } else if (date instanceof Date) {
      return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
    }
    return '';
  }

  loadDropdowns() {
    this.api.get(globals.getCampaignDropdownEndpoint).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.productsList = res.products || [];
          this.marketingList = res.marketing || [];
        }
      },
      error: (err) => {
        console.error('Dropdown error:', err);
        this.toastr.error('Failed to fetch dropdown data');
      },
    });
  }

  onTypeChange() {
    this.campaign.products_id = null;
    this.campaign.pushmessages_id = null;
  }

  changeValidity(field: string) {
    this.isFieldsValid[field] = true;
  }

  runValidations(): boolean {
    this.isFieldsValid = {
      campaign_title: true,
      type: true,
      products_id: true,
      pushmessages_id: true,
      start_date: true,
      title: true,
      end_date: true
    };

    if (!this.campaign.campaign_title?.trim()) {
      this.isFieldsValid.campaign_title = false;
      this.toastr.error('Campaign title is required.');
      return false;
    }

    if (!this.campaign.type) {
      this.isFieldsValid.type = false;
      this.toastr.error('Campaign type is required.');
      return false;
    }

    if (this.campaign.type === 'Product' && !this.campaign.products_id) {
      this.isFieldsValid.products_id = false;
      this.toastr.error('Please select a product.');
      return false;
    }

    if (this.campaign.type === 'Marketing' && !this.campaign.pushmessages_id) {
      this.isFieldsValid.pushmessages_id = false;
      this.toastr.error('Please select a marketing message.');
      return false;
    }

    if (!this.campaign.start_date) {
      this.isFieldsValid.start_date = false;
      this.toastr.error('Start date is required.');
      return false;
    }

    if (!this.campaign.end_date) {
      this.isFieldsValid.end_date = false;
      this.toastr.error('End date is required.');
      return false;
    }
    return true;
  }

  submit() {
    this.clickOnSave = true;
    if (!this.runValidations()) return;

    const selectedMessage =
      this.campaign.type === 'Product'
        ? this.productsList.find((p) => p.products_id == this.campaign.products_id)?.title
        : this.marketingList.find((m) => m.pushmessages_id == this.campaign.pushmessages_id)?.title;

    if (!selectedMessage?.trim()) {
      this.isFieldsValid.title = false;
      this.toastr.error(
        this.campaign.type === 'Product'
          ? 'Selected product has no title.'
          : 'Selected marketing message has no title.'
      );
      return;
    }

    const payload: any = {
      campaign_title: this.campaign.campaign_title.trim(),
      type: this.campaign.type,
      start_date: new Date(this.campaign.start_date).toISOString(),
      end_date: new Date(this.campaign.end_date).toISOString(),
      products_id: this.campaign.type === 'Product' ? Number(this.campaign.products_id) : 0,
      pushmessage_id: this.campaign.type === 'Marketing' ? Number(this.campaign.pushmessages_id) : 0,
      title: selectedMessage.trim(),
      allcustomers: this.campaign.allcustomers ? true : undefined,
    };

    if (this.isEdit) {
      payload.id = this.campaign.id;
    }

    const apiUrl = this.isEdit
      ? globals.updateCampaignMasterEndpoint
      : globals.addCampaignMasterEndpoint;

    this.isBusy = true;
    this.api.post(apiUrl, payload).subscribe({
      next: () => {
        this.isBusy = false;
        this.toastr.success(`Campaign ${this.isEdit ? 'updated' : 'saved'} successfully!`);
        this.router.navigate(['/campaign-management'], { state: { refresh: true , tab: this.curTab } });
      },
      error: (err) => {
        this.isBusy = false;
        console.error('Save failed:', err);
        this.toastr.error('Failed to save campaign.');
      },
    });
  }

  back() {
    this.router.navigate(['/campaign-management'],{ state: { tab: this.curTab } });
  }
}
