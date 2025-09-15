import { ChangeDetectorRef, Component } from '@angular/core';
import { TableComponent } from '../../components/table/table.component';
import { FormsModule } from '@angular/forms';
import { SegmentComponent } from '../../components/segment/segment.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as globals from '../../globals';
import { ApiGateWayService } from 'app/services/apiGateway.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalProviderService } from 'app/services/global-provider.service';


@Component({
  selector: 'app-product-application',
  imports: [SegmentComponent, CommonModule, FormsModule, TableComponent],
  templateUrl: './product-application.component.html',
  styleUrl: './product-application.component.scss',
  standalone: true
})
export class ProductApplicationComponent {
  currentTab: string = 'new_customer_product_application';
  segbuttonConfig: any = [
    { name: 'New Customer Onboarding ', functionName: 'new_customer_product_application' },
    { name: 'New Customer Welcome Letters', functionName: 'new_customer_welcome_letters' },

  ];
  newCustomerProductAppOptions: any = {
    data: [],
    filteredData: [],
    totalCount: null,
    serverMode: true,
    serverDownload: false,
    columns: {
      "firstname": { title: "First Name", tooltip: "First Name", search: true, col: 1, format: 'function', fn: this.commonFunction.bind(this) },
      "lastname": { title: "Last Name", tooltip: "Last Name", search: true, col: 1, format: 'function', fn: this.commonFunction.bind(this) },
      "mobileno": { title: "Mobile No", tooltip: "Mobile Number", search: true, col: 1, format: 'function', fn: this.commonFunction.bind(this) },
      "devicetype": { title: "Platform", col: 1, search: false, format: 'function', fn: this.commonFunction.bind(this) },
      "dob": { title: "DOB", search: true, col: 1, format: 'date', formatString: "DD/MM/YYYY" },
      "nationalinsuranceno": { title: "NI No.", search: true, tooltip: "National Insurance Number", col: 1, format: 'function', fn: this.commonFunction.bind(this) },
      "nominatedbankno": { title: "NBA", tooltip: "Nominated Bank Account", search: true, col: 1, format: 'function', fn: this.commonFunction.bind(this) },
      "state_status": { title: "Status", search: true, col: 1, format: 'function', fn: this.commonFunction.bind(this) },
      "modified_date": { title: "Date", search: true, col: 1, format: 'date', formatString: "DD/MM/YYYY HH:mm" },
      "isaddressproofverified": { title: "Add Verified", tooltip: "Address Proof Verified", mobile: true, search: false, format: 'function', fn: this.commonFunctionNull.bind(this) }
    },
    pagination: true,
    filter: null,
    search: true,
    select: true,
    selectedActions: [
      {
        title: "Delete",
        color: 'red'
      },
    ],
    rowActions: [
    ],
    download: true,
    btnSize: "small",
    pageSize: 50,
    rowClass: "table-row",
    columnClass: "table-column",
    add: {
      addActionTitle: "",
      addAction: "",
    },
    tapRow: this.editNewAccount.bind(this),
    uploadOptions: {
    },
    serverParams: {
      "pageDetail": {
        page: 1,
        pageSize: 50,
        rowCount: 0,
        pageCount: 1
      },
      "sortDetail": {
        field: "new_accounts.modified_date", type: "desc"
      },
      where: {
        "flow": "NCAO"
      }
    },
  };

  newCustomerProductAppWelcomelettersOptions: any = {
    data: [],
    filteredData: [],
    totalCount: null,
    serverMode: true,
    serverDownload: false,
    columns: {
      "memberid": { title: "ProVision ID", tooltip: "ProVision ID", search: true, format: 'function', fn: this.commonFunction.bind(this), col: 1 },
      "accountno": { title: "AN", tooltip: "Account Number", search: true, format: 'function', fn: this.commonFunction.bind(this), col: 1 },
      "firstname": { title: "First Name", tooltip: "First Name", search: true, mobile: true, format: 'function', fn: this.commonFunction.bind(this), col: 1 },
      "lastname": { title: "Last Name", tooltip: "Last Name", search: true, format: 'function', fn: this.commonFunction.bind(this), col: 1 },
      "mobileno": { title: "Mobile No", tooltip: "Mobile Number", search: true, format: 'function', fn: this.commonFunction.bind(this), col: 1 },
      "devicetype": { title: "Device Type", tooltip: "Device Type", search: true, format: 'function', fn: this.commonFunction.bind(this), col: 1 },
      "dob": { title: "DOB", tooltip: "Date of Birth", format: 'date', formatString: "DD/MM/YYYY", search: true, col: 1 },
      "lastaccess": { title: "Date", format: 'date', formatString: "DD/MM/YYYY HH:mm", search: true, col: 1 },
      "state_status": { title: "OS", tooltip: "Onboarding Status", search: true, col: 1 },
      "mailer_status": { title: "MS", tooltip: "Mailer Status", format: 'function', fn: this.commonFunctionSystemDfined.bind(this), search: true, col: 1 },
      "isaddressproofverified": { title: "AV", tooltip: "Address Proof Verified", mobile: true, format: 'function', fn: this.commonFunctionNull.bind(this), col: 1 }
    },
    pagination: true,
    filter: null,
    search: true,
    select: true,
    selectedActions: [
      {
        title: "Mark as Sent",
        // action: this.letterDelivered.bind(this),
        color: 'green'
      }
    ],
    allActions: [
      {
        title: "Download All Generated Letters",
        // action: this.allLetters.bind(this),
        color: 'green'
      }
    ],
    rowActions: [
    ],
    download: true,
    btnSize: "small",
    pageSize: 50,
    rowClass: "table-row",
    columnClass: "table-column",
    add: {
      addActionTitle: "",
      addAction: "",
    },
    tapRow: this.mailerAccount.bind(this),
    uploadOptions: {
    },
    serverParams: {
      "pageDetail": {
        page: 1,
        pageSize: 50,
        rowCount: 0,
        pageCount: 1
      },
      sortDetail: {
        field: "new_accounts.new_accounts_id",
        type: "desc"
      },
      where: {
        isactive: 1
      }
    },
  };

  constructor(
    private router: Router,
    private apiService: ApiGateWayService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private gps: GlobalProviderService
  ) {
    const state = this.router.getCurrentNavigation()?.extras?.state;

    if (state?.['tab']) {
      this.currentTab = state['tab'];
    }

    if(this.currentTab == "new_customer_product_application")
      this.getNewAccountOnboardingApi()
    else
      this.getNewAccountOnboardingMailerApi()
  }
  commonFunction(nullData: any) {
    try {
      let str = "";
      if (nullData == 0 || nullData == null || nullData == undefined) {
        str = '--';
      } else {
        str = nullData;
      }
      return str;
    } catch (error) {
      console.log(error);
      return '--';
    }
  }
  commonFunctionNull(nullData: any) {
    try {
      let str = "";
      if (nullData === null || nullData === 0) {
        str = '<img class="imgUpload"  style="width:50%; height:50%;margin-left:29px" src ="image/close.jpg" alt="" width="14px" height="14px">';
      } else {
        str = '<img class="imgUpload"  style="width:50%; height:50%;margin-left:29px" src ="image/1398911.png" alt=""  width="14px" height="14px">';
      }
      return (str)
    } catch (error) {
      console.log(error);
      return '--';
    }
  }
  commonFunctionSystemDfined(data: any) {
    try {
      let str = "";
      if (data == "Existing Customer Mailer" || data == "New Customer Mailer") {
        str = '<img class="imgUpload"  style="width:50%; height:50%;margin-left:29px" src ="image/close.jpg" alt="" width="14px" height="14px">';
      } else if (data == "New Customer Mailer Send" || data == "Existing Customer Mailer Send") {
        str = '<img class="imgUpload"  style="width:50%; height:50%;margin-left:29px" src ="image/1398911.png" alt=""  width="14px" height="14px">';
      } else {
        str = '<img class="imgUpload"  style="width:50%; height:50%;margin-left:29px" src ="image/close.jpg" alt="" width="14px" height="14px">';
      }
      return (str);
    } catch (error) {
      console.log(error);
      return '--';
    }
  }
  seghandleClick(functionName: string) {
    this.currentTab = functionName;
    switch (functionName) {
      case 'new_customer_product_application':
        this.getNewAccountOnboardingApi();
        break;
      case 'new_customer_welcome_letters':
        this.getNewAccountOnboardingMailerApi();
        break;
    }
  }
  editNewAccount(data: any) {
    this.router.navigate(['/product-application-details'], { state: { userData: data, tab: this.currentTab } });
  }
  mailerAccount(data: any) {
    this.router.navigate(['/product-application-details'], { state: { userData: data, tab: this.currentTab} });
  }
  editExistingAccount(data: any) {
    this.router.navigate(['/product-application-details'], { state: { userData: data } });
  }
  getNewAccountOnboardingApi() {
    try {
      const apiUrl = globals.getNewAccountOnboardingApi(this.newCustomerProductAppOptions.serverParams);
      this.apiService.get(apiUrl).subscribe({
        next: (res) => {
          this.newCustomerProductAppOptions.data = res.data;
          const totalCount = (res.totalcount && res.totalcount.length > 0) ? res.totalcount[0].count : 0;
          this.newCustomerProductAppOptions.totalCount = totalCount;
          this.newCustomerProductAppOptions.serverParams.pageDetail = {
            ...this.newCustomerProductAppOptions.serverParams.pageDetail,
            rowCount: totalCount,
            pageCount: Math.ceil(totalCount / this.newCustomerProductAppOptions.serverParams.pageDetail.pageSize)
          };
          this.newCustomerProductAppOptions = { ...this.newCustomerProductAppOptions };
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(`load failed:`, err);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
  getNewAccountOnboardingMailerApi() {
    try {
      const apiUrl = globals.getNewAccountOnboardingMailerApi(this.newCustomerProductAppWelcomelettersOptions.serverParams);
      this.apiService.get(apiUrl).subscribe({
        next: (res) => {
          this.newCustomerProductAppWelcomelettersOptions.data = res.data;
          this.newCustomerProductAppWelcomelettersOptions = { ...this.newCustomerProductAppWelcomelettersOptions };
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
  onPageChange(params: any, tableIndex: number) {
    this.updateParams({ pageDetail: params }, tableIndex);
    switch (tableIndex) {
      case 1:
        this.getNewAccountOnboardingApi();
        break;
      case 3:
        this.getNewAccountOnboardingMailerApi();
        break;
    }
  }
  updateParams(newProps: any, tableIndex: number) {
    switch (tableIndex) {
      case 1:
        this.newCustomerProductAppOptions.serverParams = Object.assign({}, this.newCustomerProductAppOptions.serverParams, newProps);
        break;

      case 3:
        this.newCustomerProductAppWelcomelettersOptions.serverParams = Object.assign({}, this.newCustomerProductAppWelcomelettersOptions.serverParams, newProps);
        break;

    }
  }
  onSortChange(params: any, tableIndex: number) {
    this.updateParams({ sortDetail: params }, tableIndex);
    switch (tableIndex) {
      case 1:
        this.getNewAccountOnboardingApi();
        break;
      case 3:
        this.getNewAccountOnboardingMailerApi();
        break;
      case 4:
        this.getNewAccountOnboardingMailerApi();
        break;
    }
  }
  onSearchFilter(params: any, tableIndex: number) {
    this.updateParams({ searchDetail: params }, tableIndex);
    switch (tableIndex) {
      case 1:
        this.getNewAccountOnboardingApi();
        break;

      case 3:
        this.getNewAccountOnboardingMailerApi();
        break;
      case 4:
        this.getNewAccountOnboardingMailerApi();
        break;
    }
  }
}
