import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SegmentComponent } from 'app/components/segment/segment.component';
import { TableComponent } from 'app/components/table/table.component';
import * as globals from '../../globals';
import { ApiGateWayService } from 'app/services/apiGateway.service';

@Component({
  selector: 'app-existing-customer-onboarding',
  imports: [SegmentComponent, CommonModule, FormsModule, TableComponent],
  templateUrl: './existing-customer-onboarding.component.html',
  styleUrl: './existing-customer-onboarding.component.scss',
  standalone: true
})
export class ExistingCustomerOnboardingComponent {
  currentTab: string = 'onboarding_existing_customer';
  segbuttonConfig: any = [
    { name: 'Onboarding Existing Customer', functionName: 'onboarding_existing_customer' },
    { name: 'Registration Letters', functionName: 'registration_letters' }
  ];
  existing_customer_onboarding_Options: any = {
    data: [],
    filteredData: [],
    totalCount: null,
    serverMode: true,
    serverDownload: false,
    columns: {
      memberid: { title: "Phoebus ID", search: true, col: 1, format: 'function', fn: this.commonFunction.bind(this) },
      "accountno": { "title": "Account No", "tooltip": "Account Number", "search": true, "format": "function", "fn": this.commonFunction.bind(this) },
      "firstname": { "title": "First Name", "tooltip": "First Name", "search": true, col: 1, "mobile": true, "format": "function", "fn": this.commonFunction.bind(this) },
      "lastname": { "title": "Last Name", "tooltip": "Last Name", "search": true, col: 1, "format": "function", "fn": this.commonFunction.bind(this) },
      "newmobileno": { "title": "Mobile No.", "tooltip": "New Mobile Number", "search": true, "col": 1, "format": "function", "fn": this.commonFunction.bind(this) },
      devicetype: { title: "Device", tooltip: "Device Type", search: true, format: 'function', fn: this.commonFunction.bind(this) },
      "dob": { "title": "DOB", "tooltip": "Date of Birth", "format": "date", "formatString": "DD/MM/YYYY", "search": true, "col": 1 },
      "emailid": { "title": "Email", "search": true, "format": "function", "fn": this.commonFunction.bind(this) },
      "lastaccess": { "title": "Modify Date", "tooltip": "Modified Date", "format": "date", "formatString": "DD/MM/YYYY HH:mm", "search": true, "col": 1 },
      "state_status": { "title": "Status", "search": true, "col": 1, "format": "function", "fn": this.commonFunction.bind(this) }
    },
    pagination: true,
    filter: null,
    search: true,
    select: true,
    selectedActions: [
      {
        title: "Delete",
        action: this.deleteSelectedOnboarding.bind(this),
        color: "red"
      }
    ],
    rowActions: [],
    download: true,
    btnSize: "small",
    pageSize: 50,
    rowClass: "table-row",
    columnClass: "table-column",
    add: {
      addActionTitle: "",
      addAction: "",
    },
    tapRow: this.editexitingonboarding.bind(this),
    uploadOptions: {},
    serverParams: {
      "pageDetail": {
        page: 1,
        pageSize: 50,
        rowCount: 0,
        pageCount: 1,
      },
      sortDetail: {
        field: "new_accounts.modified_date",
        type: "desc",
      },
      where: {},
    },
  };

  registration_letters_Options: any = {
    data: [],
    filteredData: [],
    totalCount: null,
    serverMode: true,
    serverDownload: false,
    columns: {
      "memberid": { "title": "Customer ID", "search": true, "col": 1, "format": "function", "fn": this.commonFunction.bind(this) },
      "accountno": { "title": "Account No", "tooltip": "Account Number", "search": true, "col": 1, "format": "function", "fn": this.commonFunction.bind(this) },
      "firstname": { "title": "First Name", "tooltip": "First Name", "search": true, "mobile": true, "format": "function", "fn": this.commonFunction.bind(this) },
      "lastname": { "title": "Last Name", "tooltip": "Last Name", "search": true, "format": "function", "fn": this.commonFunction.bind(this) },
      "mobileno": { "title": "Mobile No.", "tooltip": "Mobile Number", "search": true, "col": 1, "format": "function", "fn": this.commonFunction.bind(this) },
      "devicetype": { "title": "Device", "tooltip": "Device Type", "search": true, "col": 1, "format": "function", "fn": this.commonFunction.bind(this) },
      "dob": { "title": "DOB", "tooltip": "Date of Birth", "format": "date", "fn": this.commonFunction.bind(this), "search": true, "col": 1 },
      "lastaccess": { "title": "Date", "format": "date", "formatString": "DD/MM/YYYY HH:mm", "search": true, "col": 1 },
      "state_status": { "title": "OS", "tooltip": "Onboarding Status", "search": true, "col": 1 },
      "mailer_status": { "title": "MS", "tooltip": "Mailer Status", "format": "function", "search": true, "col": 1 }
    },
    pagination: true,
    filter: null,
    search: true,
    select: true,
    selectedActions: [
      {
        title: "Send Letter",
        // action: this.letterDelivered.bind(this),
        color: "green",
      },
    ],
    allActions: [
      {
        title: "Download All Generated Letters",
        // action: this.allLetters.bind(this),
        color: "green",
      },
    ],
    rowActions: [],
    download: true,
    btnSize: "small",
    pageSize: 50,
    rowClass: "table-row",
    columnClass: "table-column",
    add: {
      addActionTitle: "",
      addAction: "",
    },
    tapRow: this.reg_ltr_details.bind(this),
    uploadOptions: {},
    serverParams: {
      "pageDetail": {
        page: 1,
        pageSize: 50,
        rowCount: 0,
        pageCount: 1,
      },
      sortDetail: {
        field: "new_accounts.new_accounts_id",
        type: "desc",
      },
      where: {
        isactive: 1,
      },
    },
  };
  constructor(private router: Router,
    private apiService: ApiGateWayService,
    private cdr: ChangeDetectorRef) {

    const state = this.router.getCurrentNavigation()?.extras?.state;

    if (state?.['tab']) {
      this.currentTab = state['tab'];
    }

    this.existing_customer_onboarding_Options.data = [];
    if(this.currentTab == 'onboarding_existing_customer')
      this.onboardingCustomerApi()
    else
      this.regLettersApi()
  }
  seghandleClick(functionName: string) {
    this.currentTab = functionName;
    switch (functionName) {
      case 'onboarding_existing_customer':
        this.onboardingCustomerApi();
        break;
      case 'registration_letters':
        this.regLettersApi();
        break;
    }
  }
  commonFunction(nullData: any) {
    try {
      let str = "";
      if (nullData == 0 || nullData == null || nullData == undefined) {
        str = "--";
      }
      else {
        str = nullData;
      }
      return str;
    } catch (error) {
      console.error("Error in commonFunction:", error);
      return "--";
    }
  }

  deleteSelectedOnboarding(item: any) {
    console.log(item);
    try {
      const payload = {
        "new_accounts_id": item[0].new_accounts_id,
        "type": "Customer"
      }
      this.apiService.post(globals.deleteOnboarding, payload).subscribe({
        next: (res) => {
          console.log(res);

        },
        error: (err) => {
          console.error(` load failed:`, err);
        }
      });
    } catch (error) {
      console.log(error);
    }

  }

  onboardingCustomerApi() {
    try {
      const apiUrl = globals.getexistingOnboardingApi(this.existing_customer_onboarding_Options.serverParams);
      this.apiService.get(apiUrl).subscribe({
        next: (res) => {
          this.existing_customer_onboarding_Options.data = res.data;
          const totalCount = (res.totalcount && res.totalcount.length > 0) ? res.totalcount[0].count : 0;
          this.existing_customer_onboarding_Options.totalCount = totalCount;
          this.existing_customer_onboarding_Options.serverParams.pageDetail = {
            ...this.existing_customer_onboarding_Options.serverParams.pageDetail,
            rowCount: totalCount,
            pageCount: Math.ceil(totalCount / this.existing_customer_onboarding_Options.serverParams.pageDetail.pageSize)
          };
          this.existing_customer_onboarding_Options = { ...this.existing_customer_onboarding_Options };
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(` load failed:`, err);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  regLettersApi() {
    try {
      const apiUrl = globals.getRegLetterApi(this.registration_letters_Options.serverParams);
      this.apiService.get(apiUrl).subscribe({
        next: (res) => {
          this.registration_letters_Options.data = res.data;
          const totalCount = (res.totalcount && res.totalcount.length > 0) ? res.totalcount[0].count : 0;
          this.registration_letters_Options.totalCount = totalCount;
          this.registration_letters_Options.serverParams.pageDetail = {
            ...this.registration_letters_Options.serverParams.pageDetail,
            rowCount: totalCount,
            pageCount: Math.ceil(totalCount / this.registration_letters_Options.serverParams.pageDetail.pageSize)
          };
          this.registration_letters_Options = { ...this.registration_letters_Options };
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(` load failed:`, err);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  editexitingonboarding(data: any) {
    this.router.navigate(['/existing-onboarding-customer-detail'], { state: { userData: data, tab: this.currentTab } });
  }
  reg_ltr_details(data: any) {
    this.router.navigate(['/existing-onboarding-customer-detail'], { state: { userData: data, tab: this.currentTab } });
  }

  onPageChange(params: any, tableIndex: number) {
    this.updateParams({ pageDetail: params }, tableIndex);
    switch (tableIndex) {
      case 1:
        this.onboardingCustomerApi();
        break;
      case 2:
        this.regLettersApi();
        break;
    }
  }

  onSortChange(params: any, tableIndex: number) {
    this.updateParams({ sortDetail: params }, tableIndex);
    switch (tableIndex) {
      case 1:
        this.onboardingCustomerApi();
        break;
      case 2:
        this.regLettersApi();
        break;
    }
  }

  onSearchFilter(params: any, tableIndex: number) {
    this.updateParams({ searchDetail : params }, tableIndex);
    switch (tableIndex) {
      case 1:
        this.onboardingCustomerApi();
        break;
      case 2:
        this.regLettersApi();
        break;
    }
  }

  updateParams(newProps: any, tableIndex: number) {
    switch (tableIndex) {
      case 1:
        this.existing_customer_onboarding_Options.serverParams = Object.assign({}, this.existing_customer_onboarding_Options.serverParams, newProps);
        break;
      case 2:
        this.registration_letters_Options.serverParams = Object.assign({}, this.registration_letters_Options.serverParams, newProps);
        break;
    };
  }

}
