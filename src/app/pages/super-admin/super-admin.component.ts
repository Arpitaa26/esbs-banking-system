
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SegmentComponent } from '../../components/segment/segment.component';
import { TableComponent } from '../../components/table/table.component';
import { ApiGateWayService } from 'app/services/apiGateway.service';
import { GlobalProviderService } from 'app/services/global-provider.service';
import * as globals from '../../globals';
@Component({
  selector: 'app-super-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, SegmentComponent, TableComponent],
  templateUrl: './super-admin.component.html',
  styleUrl: './super-admin.component.scss'
})
export class SuperAdminComponent {
  currentTab: string = 'function';

  segbuttonConfig: any = [
    { name: 'Functions', functionName: 'function' },
    { name: 'App Version', functionName: 'app_version' }
  ];
  repeatedTags = [
    { label: 'Savings Accounts', key: 'savingsaccount', class: 'bg-purple' },
    { label: 'Mortgage Accounts', key: 'mortgageaccount', class: 'bg-pink' },

  ];

  showSaveButton: boolean = false;

  menuOptions = [
    // { label: 'Accounts', key: 'menu_existing_account', class: 'bg-yellow' },
    { label: 'Products', key: 'menu_prodcuts', class: 'bg-purple' },
    // { label: 'Saver', key: 'menu_saver', class: 'bg-green' },
    // { label: 'Regular Savings', key: 'menu_regularsavings', class: 'bg-pink' },
    // { label: 'Smart Savings', key: 'menu_saver_smart', class: 'bg-yellow' },
    // { label: 'Sweeper', key: 'menu_saver_sweeper', class: 'bg-purple' },
    // { label: 'Member', key: 'menu_members', class: 'bg-green' },
    // { label: 'Messages', key: 'menu_messages', class: 'bg-pink' },
    { label: 'Find a Branch near me', key: 'menu_branches', class: 'bg-yellow' },
    // { label: 'Pay Contacts', key: 'menu_paycontacts', class: 'bg-purple' },
    // { label: 'Deposit a Cheque', key: 'menu_cheque', class: 'bg-green' },
    // { label: '3rd Party Notifications', key: 'menu_thirdparty', class: 'bg-pink' },
    { label: 'Settings', key: 'menu_settings', class: 'bg-yellow' },
    { label: 'Terms & Conditions', key: 'menu_termsconditions', class: 'bg-purple' },
    // { label: 'Savings Analysis', key: 'menu_savinganalysis', class: 'bg-green' },
    // { label: 'Savings Goals', key: 'menu_goals', class: 'bg-pink' },
    // { label: 'Mortgage Calculator', key: 'menu_calculators', class: 'bg-yellow' },
    { label: 'Contact Us Messages', key: 'menu_contactusMessages', class: 'bg-purple' },
    // { label: 'New Product Application', key: 'menu_productApplication', class: 'bg-green' },
    { label: 'Help & Contact Us', key: 'menu_contactus', class: 'bg-purple' },
    { label: 'Statements', key: 'menu_statements', class: 'bg-green' },
    { label: 'Fund Transfer', key: 'menu_transfer', class: 'bg-pink' },
    { label: 'News', key: 'menu_news', class: 'bg-yellow' },
    // { label: 'Update Profile', key: 'menu_updateprofile', class: 'bg-purple' }
  ];

  selectedMenus: { [key: string]: number } = {};

  deviceData: any = {
    data: [],
    filteredData: [],
    totalCount: true,
    columns: {
      devicetype: { title: "Device Type", search: true },
      version: { title: "App Version", search: true },
      appname: { title: "App Name", search: true },
      appurl: { title: "App URL", search: true, col: "col-4" },
      islive: { title: "Live", search: true, format: "yesno" },
      forced: { title: "Forced", search: true, format: "yesno" },
    },
    tapRow: (row: any) => this.updateAppVersion(row),
    pagination: true,
    filter: null,
    search: false,
    select: false,
    selectedActions: [],
    rowActions: [],
    download: true,
    serverMode: true,
    serverParams: {
      "pageDetail": { page: 1, pageSize: 50, totalCount: 0 },
      sortDetail: { field: '', order: 'desc' },
      where: {}
    },
    btnSize: "small",
    pageSize: 50,
    rowClass: "table-row",
    columnClass: "table-column",
    uploadOptions: {},
    resetFilter: null,
  };
  constructor(
    private router: Router,
    private api: ApiGateWayService,
    private gps: GlobalProviderService,
    private cdr: ChangeDetectorRef
  ) {
    this.getBankSettings();
    this.getAppVersionFromApi();

    const state = this.router.getCurrentNavigation()?.extras?.state;

       if (state?.['tab']) {
      this.currentTab = state['tab'];
    }

    this.deviceData.data = [];
    if(this.currentTab == 'faqs_categroy')
      this.getBankSettings()
    else
      this.getAppVersionFromApi()

  }

  seghandleClick(tab: string) {
    this.currentTab = tab;
    if (tab === 'app_version') {
      this.getAppVersionFromApi();
    }
    if (tab === 'function') {
      this.getBankSettings();
    }
  }
  onPageChange(params: any) {
    this.updateParams({ pageDetail: params });
    this.getAppVersionFromApi();
  }

  onSortChange(params: any) {
    this.updateParams({ sortDetail: params });
    this.getAppVersionFromApi();
  }

  onSearchFilter(params: any) {
    this.updateParams({ pageDeatil: params });
    this.getAppVersionFromApi();
  }

  updateParams(newProps: any) {
    this.deviceData.serverParams = Object.assign({}, this.deviceData.serverParams, newProps);
  }
  getAppVersionFromApi() {
    const apiUrl = globals.getAppVersionEndpoint(this.deviceData.serverParams);
    this.api.get(apiUrl).subscribe({
      next: (res: any) => {

        this.deviceData.data = res.data;
        const totalCount = (res.totalcount && res.totalcount.length > 0) ? res.totalcount[0].count : 0;
        this.deviceData.totalCount = totalCount;
        this.deviceData.serverParams.pageDetail = {
          ...this.deviceData.serverParams.pageDetail,
          rowCount: totalCount,
          pageCount: Math.ceil(totalCount / this.deviceData.serverParams.pageDetail.pageSize)
        };
        this.deviceData = { ...this.deviceData };

        this.cdr.detectChanges();
      }

    });
  }

  onCheckboxChange(event: any, key: string) {
    const isChecked = (event.target as HTMLInputElement).checked;

    this.selectedMenus[key] = event.target.checked ? 1 : 0;
    this.showSaveButton = true;
  }

  getBankSettings() {
    const payload = {
      users_id: this.gps.usersID
    };
    this.api.post(globals.getBankSettingsEndpoint, payload).subscribe({
      next: (res: any) => {
        this.selectedMenus = res.data[0];

      },

    });
  }

  updateSettings() {
    const payload = {
      "users_id": this.gps.usersID, "banksettings_id": this.selectedMenus["banksettings_id"], "savingsaccount": this.selectedMenus["savingsaccount"], "mortgageaccount": this.selectedMenus["mortgageaccount"],
      "currentaccount": this.selectedMenus["currentaccount"], "externalaccount": this.selectedMenus["externalaccount"], "menu_new_account": this.selectedMenus["menu_new_account"], "menu_existing_account": this.selectedMenus["menu_existing_account"],
      "menu_prodcuts": this.selectedMenus["menu_prodcuts"], "menu_savinganalysis": this.selectedMenus["menu_savinganalysis"], "menu_goals": this.selectedMenus["menu_goals"], "menu_calculators": this.selectedMenus["menu_calculators"], "menu_cheque": this.selectedMenus["menu_cheque"],
      "menu_contactus": this.selectedMenus["menu_contactus"], "menu_thirdparty": this.selectedMenus["menu_thirdparty"], "menu_settings": this.selectedMenus["menu_settings"], "menu_termsconditions": this.selectedMenus["menu_termsconditions"], "menu_branches": this.selectedMenus["menu_branches"],
      "menu_paycontacts": this.selectedMenus["menu_paycontacts"], "menu_contactusMessages": this.selectedMenus["menu_contactusMessages"], "menu_productApplication": this.selectedMenus["menu_productApplication"], "menu_messages": this.selectedMenus["menu_messages"],
      "menu_members": this.selectedMenus["menu_members"], "menu_saver": this.selectedMenus["menu_saver"], "menu_saver_regular": this.selectedMenus["menu_saver_regular"], "menu_saver_smart": this.selectedMenus["menu_saver_smart"], "menu_saver_sweeper": this.selectedMenus["menu_saver_sweeper"],
      "menu_regularsavings": this.selectedMenus["menu_regularsavings"], "menu_statements": this.selectedMenus["menu_statements"], "menu_transfer": this.selectedMenus["menu_transfer"],
      "menu_news": this.selectedMenus["menu_news"], "menu_updateprofile": this.selectedMenus["menu_updateprofile"]
    }

    this.api.post(globals.updateBankSettings, payload).subscribe({
      next: (res: any) => {

        this.showSaveButton = false;
         this.getBankSettings();

          this.cdr.detectChanges();
      },

    });
  }
  updateAppVersion(data: any) {
    this.router.navigate(['/add-update-super-admin'], {
      state: { appVersionData: data , tab: this.currentTab }
    });
  }
  createAppVersion() {
    this.router.navigate(['/add-update-super-admin'], {
      state: { appVersionData: null , tab: this.currentTab }
    });
  }

  commonFunction(value: any): string {
    return (value === 0 || value == null || value === undefined) ? "--" : value;
  }
}
