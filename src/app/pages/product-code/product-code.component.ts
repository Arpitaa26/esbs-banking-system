import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SegmentComponent } from 'app/components/segment/segment.component';
import { TableComponent } from 'app/components/table/table.component';

@Component({
  selector: 'app-product-code',
  imports: [ CommonModule, FormsModule, TableComponent],
  templateUrl: './product-code.component.html',
  styleUrl: './product-code.component.scss'
})
export class ProductCodeComponent {
segbuttonConfig2: any = [
    { name: 'Active', functionName: 'active' },
      ];

  campaignArchiveOptions: any;
  currentTab: string = 'Active';

  seghandleClick(data:any){
    console.log(data);
  }
  seghandleClick1(functionName: string) {
    console.log(functionName, 'Save button clicked3');
    switch (functionName) {
      case 'user_role':
        this.currentTab = 'user_role';
        console.log('Save button clicked');
        break;
      case 'staff_users':
        this.currentTab = 'staff_users';
        console.log('Save button clicked2');
        break;
    }
  }
  seghandleClick2(functionName: string) {
    console.log(functionName, 'Save button clicked3');
    switch (functionName) {
      case 'onSave1':
        console.log('Save button clicked');
        break;
      case 'onDelete':
        console.log('Save button clicked2');
        break;
      case 'onUpdate':
        console.log('Save button clicked3');
        break;
    }
  }
    product_code: any = {
    data: [],
    filteredData: [],
    columns: {
      Code: {
        title: "Code",
        search: true,
        format: "function",
        },
      Product: {
        title: "Product",
        search: true,
        format: "function",
      },
       ProductType: {
        title: "Product Type",
        search: true,
        format: "function",
      },
       CustomerType: {
        title: "Customer Type",
        search: true,
        format: "function",
      },
       transferin: {
        title: "Transfer In",
        search: true,
        format: "function",
      },
      transferout: {
        title: "Transfer Out",
        search: true,
        format: "function",
      },

    },
    pagination: true,
    fitler: null,
    search: true,
    select: true,

    selectedActions: [
      {
        title: "Delete",
        // action: this.deleteSelectedRoles.bind(this),
        color: "red",
      }
    ],
    rowActions: [],
    download: true,
    btnSize: "small",
    pageSize: 50,
    rowClass: "table-row",
    columnClass: "table-column",
    add: {
      addActionTitle: "Add Product",
      // addAction: this.createUser.bind(this),
    },
    // tapRow: this.editUser.bind(this),
    resetFilter: null,
    uploadOptions: {},
    serverParams: {
      pageDetail: {
        page: 1,
        pageSize: 50,
        rowCount: 0,
        pageCount: 1,
      },
    },
  };
constructor(){
  this.product_code.data=[
        // {
        //     "id": 103,
        //     "Code": "TEST07052025",
        //     "Product": "TEST 07 May 2025",
        //     "CustomerType": "Business",
        //     "ProductType": "Bonds",
        //     "transferin": 1,
        //     "transferout": 1
        // },
        // {
        //     "id": 99,
        //     "Code": "SA0286",
        //     "Product": "Two Year Fixed Rate Bond (Issue 3)",
        //     "CustomerType": "Personal",
        //     "ProductType": "Bonds",
        //     "transferin": 0,
        //     "transferout": 0
        // },
        // {
        //     "id": 98,
        //     "Code": "SA0285",
        //     "Product": "One Year Fixed Rate Bond (Issue 2)",
        //     "CustomerType": "Personal",
        //     "ProductType": "Bonds",
        //     "transferin": 0,
        //     "transferout": 0
        // },
        // {
        //     "id": 97,
        //     "Code": "SA0231",
        //     "Product": "60 Day Account",
        //     "CustomerType": "Personal",
        //     "ProductType": "Savings",
        //     "transferin": 1,
        //     "transferout": 1
        // },
        // {
        //     "id": 95,
        //     "Code": "BDI002",
        //     "Product": "Buy to Let Discount",
        //     "CustomerType": "Personal",
        //     "ProductType": "Mortgage",
        //     "transferin": 0,
        //     "transferout": 0
        // },
        // {
        //     "id": 94,
        //     "Code": "SA0230",
        //     "Product": "Instant Access",
        //     "CustomerType": "Personal",
        //     "ProductType": "Savings",
        //     "transferin": 1,
        //     "transferout": 1
        // },
        // {
        //     "id": 88,
        //     "Code": "SA0274",
        //     "Product": "Fixed Rate 12 Month ISA (Issue 20)",
        //     "CustomerType": "Personal",
        //     "ProductType": null,
        //     "transferin": 1,
        //     "transferout": 1
        // },
        // {
        //     "id": 87,
        //     "Code": "SA273B",
        //     "Product": "Fixed Rate 12 Month ISA (Issue 19)",
        //     "CustomerType": "Personal",
        //     "ProductType": null,
        //     "transferin": 1,
        //     "transferout": 1
        // },
        // {
        //     "id": 86,
        //     "Code": "SA0267",
        //     "Product": "Base Rate Tracker Bond (Issue 1)",
        //     "CustomerType": "Personal",
        //     "ProductType": null,
        //     "transferin": 0,
        //     "transferout": 0
        // },
        // {
        //     "id": 85,
        //     "Code": "SA0264",
        //     "Product": "12 Month Fixed Rate Loyalty Bond Issue 3",
        //     "CustomerType": "Personal",
        //     "ProductType": null,
        //     "transferin": 0,
        //     "transferout": 0
        // },
        // {
        //     "id": 84,
        //     "Code": "SA0261",
        //     "Product": "Fixed Rate 24 Month ISA (Issue 2)",
        //     "CustomerType": "Personal",
        //     "ProductType": "Savings",
        //     "transferin": 1,
        //     "transferout": 0
        // },
        // {
        //     "id": 83,
        //     "Code": "SA0259",
        //     "Product": "24 Month Fixed Rate Loyalty Bond Issue 1",
        //     "CustomerType": "Personal",
        //     "ProductType": null,
        //     "transferin": 0,
        //     "transferout": 0
        // },
        // {
        //     "id": 82,
        //     "Code": "DA0228",
        //     "Product": "Client Instant",
        //     "CustomerType": "Client",
        //     "ProductType": "Savings",
        //     "transferin": 0,
        //     "transferout": 0
        // },
        // {
        //     "id": 81,
        //     "Code": "SM076C",
        //     "Product": "Redswan 90 Day SIPP Monthly",
        //     "CustomerType": "Pensions",
        //     "ProductType": null,
        //     "transferin": 0,
        //     "transferout": 0
        // },
        // {
        //     "id": 80,
        //     "Code": "SM071D",
        //     "Product": "Redswan SIPP Monthly",
        //     "CustomerType": "Pensions",
        //     "ProductType": null,
        //     "transferin": 0,
        //     "transferout": 0
        // },
        // {
        //     "id": 79,
        //     "Code": "SA283D",
        //     "Product": "Fixed Rate 24 Month ISA (Issue 5) D",
        //     "CustomerType": "Personal",
        //     "ProductType": null,
        //     "transferin": 0,
        //     "transferout": 0
        // },
        // {
        //     "id": 78,
        //     "Code": "SA284D",
        //     "Product": "Fixed Rate 12 Month ISA (Issue 23) D",
        //     "CustomerType": "Personal",
        //     "ProductType": null,
        //     "transferin": 0,
        //     "transferout": 0
        // },
        // {
        //     "id": 77,
        //     "Code": "SA283C",
        //     "Product": "Fixed Rate 24 Month ISA (Issue 5) C",
        //     "CustomerType": "Personal",
        //     "ProductType": null,
        //     "transferin": 0,
        //     "transferout": 0
        // },
        // {
        //     "id": 76,
        //     "Code": "SA284C",
        //     "Product": "Fixed Rate 12 Month ISA (Issue 23) C",
        //     "CustomerType": "Personal",
        //     "ProductType": null,
        //     "transferin": 0,
        //     "transferout": 0
        // },
        // {
        //     "id": 75,
        //     "Code": "SA0288",
        //     "Product": "1 Year Fixed Rate ISA (Issue 24)",
        //     "CustomerType": "Personal",
        //     "ProductType": null,
        //     "transferin": 0,
        //     "transferout": 0
        // },
        // {
        //     "id": 74,
        //     "Code": "SA0287",
        //     "Product": "2 Year Fixed Rate ISA (Issue 6)",
        //     "CustomerType": "Personal",
        //     "ProductType": null,
        //     "transferin": 0,
        //     "transferout": 0
        // },
        // {
        //     "id": 72,
        //     "Code": "SA0285",
        //     "Product": "1 Year Fixed Rate Bond (Issue 2)",
        //     "CustomerType": "Personal",
        //     "ProductType": "Bonds",
        //     "transferin": 1,
        //     "transferout": 1
        // },
        // {
        //     "id": 71,
        //     "Code": "SA284B",
        //     "Product": "Fixed Rate 12 Month ISA (Issue 23) B",
        //     "CustomerType": "Personal",
        //     "ProductType": null,
        //     "transferin": 0,
        //     "transferout": 0
        // },
        // {
        //     "id": 70,
        //     "Code": "SA283B",
        //     "Product": "Fixed Rate 24 Month ISA (Issue 5) B",
        //     "CustomerType": "Personal",
        //     "ProductType": null,
        //     "transferin": 0,
        //     "transferout": 0
        // },
        // {
        //     "id": 69,
        //     "Code": "SA0277",
        //     "Product": "Base Rate Tracker Bond (Issue 2)",
        //     "CustomerType": "Personal",
        //     "ProductType": null,
        //     "transferin": 0,
        //     "transferout": 0
        // },
        // {
        //     "id": 68,
        //     "Code": "SA0278",
        //     "Product": "24 Month Fixed Rate Loyalty Bond Issue 3",
        //     "CustomerType": "Personal",
        //     "ProductType": null,
        //     "transferin": 0,
        //     "transferout": 0
        // },
        // {
        //     "id": 67,
        //     "Code": "SA0282",
        //     "Product": "2 Year Fixed Rate Bond (Issue 2)",
        //     "CustomerType": "Personal",
        //     "ProductType": "Bonds",
        //     "transferin": 1,
        //     "transferout": 1
        // },
        // {
        //     "id": 66,
        //     "Code": "SA0279",
        //     "Product": "2 Year Fixed Rate Bond (Issue 1)",
        //     "CustomerType": "Personal",
        //     "ProductType": null,
        //     "transferin": 0,
        //     "transferout": 0
        // },
        // {
        //     "id": 65,
        //     "Code": "SA0281",
        //     "Product": "Fixed Rate 12 Month ISA (Issue 22)",
        //     "CustomerType": "Personal",
        //     "ProductType": null,
        //     "transferin": 0,
        //     "transferout": 0
        // },
        // {
        //     "id": 64,
        //     "Code": "SA0280",
        //     "Product": "1 Year Fixed Rate Bond (issue 1)",
        //     "CustomerType": "Personal",
        //     "ProductType": "Bonds",
        //     "transferin": 1,
        //     "transferout": 1
        // },
        // {
        //     "id": 63,
        //     "Code": "DA0229",
        //     "Product": "Client 100",
        //     "CustomerType": "Client",
        //     "ProductType": null,
        //     "transferin": 0,
        //     "transferout": 0
        // },
        // {
        //     "id": 62,
        //     "Code": "SA0181",
        //     "Product": "SSAS Fixed Term Deposit - 6 Months",
        //     "CustomerType": "Pensions",
        //     "ProductType": null,
        //     "transferin": 0,
        //     "transferout": 0
        // },
        // {
        //     "id": 61,
        //     "Code": "DA0174",
        //     "Product": "Business Direct Fixed Term Dep 6 Months",
        //     "CustomerType": "Business",
        //     "ProductType": null,
        //     "transferin": 0,
        //     "transferout": 0
        // },
        // {
        //     "id": 60,
        //     "Code": "SA0284",
        //     "Product": "Fixed ISA 12 Month (Issue 23)",
        //     "CustomerType": "Personal",
        //     "ProductType": null,
        //     "transferin": 1,
        //     "transferout": 1
        // },
        // {
        //     "id": 59,
        //     "Code": "SA0283",
        //     "Product": "Fixed ISA 24 Month (Issue 5)",
        //     "CustomerType": "Personal",
        //     "ProductType": null,
        //     "transferin": 1,
        //     "transferout": 1
        // },
        // {
        //     "id": 58,
        //     "Code": "UFC002",
        //     "Product": "Buy for Uni Fixed Rate",
        //     "CustomerType": "Personal",
        //     "ProductType": "Mortgage",
        //     "transferin": 0,
        //     "transferout": 0
        // },
        // {
        //     "id": 57,
        //     "Code": "UDI002",
        //     "Product": "Buy for Uni Discount",
        //     "CustomerType": "Personal",
        //     "ProductType": "Mortgage",
        //     "transferin": 0,
        //     "transferout": 0
        // },
        // {
        //     "id": 56,
        //     "Code": "UDC002",
        //     "Product": "Buy for Uni Discount",
        //     "CustomerType": "Personal",
        //     "ProductType": "Mortgage",
        //     "transferin": 0,
        //     "transferout": 0
        // },
        // {
        //     "id": 55,
        //     "Code": "RVI002",
        //     "Product": "Residential Standard",
        //     "CustomerType": "Personal",
        //     "ProductType": "Mortgage",
        //     "transferin": 0,
        //     "transferout": 0
        // },
        // {
        //     "id": 54,
        //     "Code": "RVC002",
        //     "Product": "Residential Standard",
        //     "CustomerType": "Personal",
        //     "ProductType": null,
        //     "transferin": 0,
        //     "transferout": 0
        // },
        // {
        //     "id": 53,
        //     "Code": "RFI002",
        //     "Product": "Residential Fixed Rate",
        //     "CustomerType": "Personal",
        //     "ProductType": "Mortgage",
        //     "transferin": 0,
        //     "transferout": 0
        // },
        // {
        //     "id": 52,
        //     "Code": "RFC002",
        //     "Product": "Residential Fixed Rate",
        //     "CustomerType": "Personal",
        //     "ProductType": "Mortgage",
        //     "transferin": 0,
        //     "transferout": 0
        // },
        // {
        //     "id": 51,
        //     "Code": "RDI002",
        //     "Product": "Residential Discount",
        //     "CustomerType": "Personal",
        //     "ProductType": "Mortgage",
        //     "transferin": 0,
        //     "transferout": 0
        // },
        // {
        //     "id": 50,
        //     "Code": "RDC002",
        //     "Product": "Residential Discount",
        //     "CustomerType": "Personal",
        //     "ProductType": "Mortgage",
        //     "transferin": 0,
        //     "transferout": 0
        // },
        // {
        //     "id": 49,
        //     "Code": "HFI002",
        //     "Product": "Holiday Let Fixed Rate",
        //     "CustomerType": "Personal",
        //     "ProductType": "Mortgage",
        //     "transferin": 0,
        //     "transferout": 0
        // },
        // {
        //     "id": 48,
        //     "Code": "HFC002",
        //     "Product": "Holiday Let Fixed Rate",
        //     "CustomerType": "Personal",
        //     "ProductType": "Mortgage",
        //     "transferin": 0,
        //     "transferout": 0
        // },
        // {
        //     "id": 47,
        //     "Code": "HDI002",
        //     "Product": "Holiday Let Discount",
        //     "CustomerType": "Personal",
        //     "ProductType": "Mortgage",
        //     "transferin": 0,
        //     "transferout": 0
        // },
        // {
        //     "id": 46,
        //     "Code": "HDC002",
        //     "Product": "Holiday Let Discount",
        //     "CustomerType": "Personal",
        //     "ProductType": "Mortgage",
        //     "transferin": 0,
        //     "transferout": 0
        // },
        // {
        //     "id": 45,
        //     "Code": "CVI002",
        //     "Product": "Commercial Standard",
        //     "CustomerType": "Personal",
        //     "ProductType": "Mortgage",
        //     "transferin": 0,
        //     "transferout": 0
        // },
        // {
        //     "id": 44,
        //     "Code": "CVC002",
        //     "Product": "Commercial Standard",
        //     "CustomerType": "Personal",
        //     "ProductType": "Mortgage",
        //     "transferin": 0,
        //     "transferout": 0
        // }
    ]
}
}
