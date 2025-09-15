import { ChangeDetectorRef, Component } from '@angular/core';
import { TableComponent } from 'app/components/table/table.component';
import { FormsModule } from '@angular/forms';
import { SegmentComponent } from '../../components/segment/segment.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as globals from '../../globals';
import { ApiGateWayService } from 'app/services/apiGateway.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalProviderService } from 'app/services/global-provider.service';

@Component({
  selector: 'app-existing-customer-product-application',
  imports: [SegmentComponent, CommonModule, FormsModule, TableComponent],
  templateUrl: './existing-customer-product-application.component.html',
  styleUrl: './existing-customer-product-application.component.scss'
})
export class ExistingCustomerProductApplicationComponent {
  currentTab: string = 'existing_customer_product_application';
  segbuttonConfig: any = [
   
    { name: 'Existing Customer Product Application', functionName: 'existing_customer_product_application' },
    { name: 'Existing Customer Product Application Letters', functionName: 'existing_customer_product_application_letters' },
  ];
  
  existingCustomerProductAppOptions: any = {
    data: [],
    filteredData: [],
    totalCount: null,
    serverMode: true,
    serverDownload: false,
    columns: {
      "firstname": { title: "First Name", search: true, col: 1, format: 'function', fn: this.commonFunction.bind(this) },
      "lastname": { title: "Last Name", search: true, col: 1, format: 'function', fn: this.commonFunction.bind(this) },
      "mobileno": { title: "Mobile No.", tooltip: "Mobile Number", search: true, col: 1, format: 'function', fn: this.commonFunction.bind(this) },
      "sopra_reference_num": { title: "ProVision ID", search: true, col: 2, format: 'function', fn: this.commonFunction.bind(this) },
      "modified_date": { title: "Date", search: true, col: 1, format: 'date', formatString: "DD/MM/YYYY HH:mm" },
      "nationalinsuranceno": { title: "NI No.", tooltip: "National Insurance Number", search: true, col: 1, format: 'function', fn: this.commonFunction.bind(this) },
      "nominatedbankno": { title: "NBA", tooltip: "Nominated Bank Account", search: true, col: 1, format: 'function', fn: this.commonFunction.bind(this) },
      "state_status": { title: "Status", search: true, col: 1 },
      "eid": {
        title: "Identity",
        search: false,
        format: "yesno",
        fn: this.commonFunction.bind(this)
      }
    },
    pagination: true,
    filter: null,
    search: true,
    select: true,
    selectedActions: [
      {
        title: "Delete",
        // action: this.deleteSelectedProductApplication.bind(this),
        color: 'red'
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
    tapRow: this.editExistingAccount.bind(this),
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
        field: "product_application.modified_date", type: "desc"
      },
      where: {
      }
    },
  };
  
  existingCustomerProductApplettersOptions: any = {
    data: [],
    filteredData: [],
    totalCount: null,
    serverMode: true,
    serverDownload: false,
    columns: {
      "mailer_pin": { title: "ProVision ID", search: true, format: 'function', fn: this.commonFunction.bind(this) },
      "accountno": { title: "Account No.", search: true, format: 'function', fn: this.commonFunction.bind(this) },
      "firstname": { title: "First Name", search: true, format: 'function', fn: this.commonFunction.bind(this) },
      "lastname": { title: "Last Name", search: true, format: 'function', fn: this.commonFunction.bind(this) },
      "mobileno": { title: "Mobile No.", tooltip: "Mobile Number", search: true, format: 'function', fn: this.commonFunction.bind(this) },
      "devicetype": { title: "Device", search: false, format: 'function', fn: this.commonFunction.bind(this) },
      "dob": { title: "DOB", tooltip: "Date of Birth", format: 'date', formatString: "DD/MM/YYYY", search: true },
      "lastaccess": { title: "Date", format: 'date', formatString: "DD/MM/YYYY HH:mm", search: true },
      "state_status": { title: "OS", tooltip: "Onboarding Status", search: true },
      "mailer_status": { title: "Mailer Status", format: 'function', fn: this.commonFunctionSystemDfined.bind(this), search: true }
    },
    pagination: true,
    filter: null,
    search: true,
    select: true,
    selectedActions: [
      {
        title: "Mark as Sent",
        // action: this.letterDelivered1.bind(this),
        color: 'green'
      }
    ],
    allActions: [
      {
        title: "Download All Generated Letters",
        // action: this.allExistingLetters.bind(this),
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
        field: "product_application.product_application_id",
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
    this.getProductApplicationApi()
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
      
      case 'existing_customer_product_application':
        this.getProductApplicationApi();
        break;
      case 'existing_customer_product_application_letters':
        this.getProductApplicationMailerApi();
        break;
      
    }
  }
  editNewAccount(data: any) {
    this.router.navigate(['/product-application-details'], { state: { userData: data } });
  }
  mailerAccount(data: any) {
    this.router.navigate(['/product-application-details'], { state: { userData: data } });
  }
  editExistingAccount(data: any) {
    this.router.navigate(['/product-application-details'], { state: { userData: data } });
  }
  
  getProductApplicationApi() {
    try {
      const apiUrl = globals.getProductApplicationApi(this.existingCustomerProductAppOptions.serverParams);
      this.apiService.get(apiUrl).subscribe({
        next: (res) => {
          this.existingCustomerProductAppOptions.data = res.data;
          this.existingCustomerProductAppOptions = { ...this.existingCustomerProductAppOptions };
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
  getProductApplicationMailerApi() {
    try {
      const apiUrl = globals.getProductApplicationMailerApi(this.existingCustomerProductApplettersOptions.serverParams);
      this.apiService.get(apiUrl).subscribe({
        next: (res) => {
          this.existingCustomerProductApplettersOptions.data = res.data;
          this.existingCustomerProductApplettersOptions = { ...this.existingCustomerProductApplettersOptions };
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
      
      case 2:
        this.getProductApplicationApi();
        break;
     
      case 4:
        this.getProductApplicationMailerApi();
        break;
    }
  }
  updateParams(newProps: any, tableIndex: number) {
    switch (tableIndex) {
     
      case 2:
        this.existingCustomerProductAppOptions.serverParams = Object.assign({}, this.existingCustomerProductAppOptions.serverParams, newProps);
        break;
      
      case 4:
        this.existingCustomerProductApplettersOptions.serverParams = Object.assign({}, this.existingCustomerProductApplettersOptions.serverParams, newProps);
        break;
    }
  }
  onSortChange(params: any, tableIndex: number) {
    this.updateParams({ pageDetail: params }, tableIndex);
    switch (tableIndex) {
     
      case 2:
        this.getProductApplicationApi();
        break;
      
      case 4:
        this.getProductApplicationMailerApi();
        break;
    }
  }
  onSearchFilter(params: any, tableIndex: number) {
    this.updateParams({ pageDetail: params }, tableIndex);
    switch (tableIndex) {
      
      case 2:
        this.getProductApplicationApi();
        break;
      
      case 4:
        this.  getProductApplicationMailerApi();
        break;
    }
  }
}
