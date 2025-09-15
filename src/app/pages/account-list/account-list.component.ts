import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableComponent } from 'app/components/table/table.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-account-list',
  imports: [CommonModule, FormsModule, TableComponent],
  templateUrl: './account-list.component.html',
  styleUrl: './account-list.component.scss'
})
export class AccountListComponent {
 segbuttonConfig2: any = [
    { name: 'Phoebus Account', functionName: 'active' },
  ];

  campaignArchiveOptions: any;
  currentTab: string = 'Active';

  seghandleClick(data: any) {
    console.log(data);
  }

  accountList: any = {
    data: [],
    filteredData: [],
    columns: {
      created_on: {
        title: "Created Date",
        search: true,
        format: "function",
        // fn: this.commonFunction.bind(this),
      },
      account_number: {
        title: "Account Number",
        search: true,
        format: "function",
        // fn: this.commonFunction.bind(this),
      },
      is_used: {
        title: "Used status",
        search: true,
        format: "function",
        // fn: this.commonFunction.bind(this),
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
      addActionTitle: "Upload CSV",
        },
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

  constructor(private router: Router) {
    this.accountList.data = [
        {
            "account_number": "90046695",
            "is_used": 0,
            "created_on": "2025-05-05T10:23:36.000Z"
        },
        {
            "account_number": "90046707",
            "is_used": 0,
            "created_on": "2025-05-05T10:23:37.000Z"
        },

        {
            "account_number": "90048246",
            "is_used": 0,
            "created_on": "2025-05-05T10:26:05.000Z"
        },
        {
            "account_number": "90048254",
            "is_used": 0,
            "created_on": "2025-05-05T10:26:06.000Z"
        },
        {
            "account_number": "90048262",
            "is_used": 0,
            "created_on": "2025-05-05T10:26:07.000Z"
        },
        {
            "account_number": "90048279",
            "is_used": 0,
            "created_on": "2025-05-05T10:26:08.000Z"
        },
        {
            "account_number": "90048287",
            "is_used": 0,
            "created_on": "2025-05-05T10:26:09.000Z"
        },
        {
            "account_number": "90048295",
            "is_used": 0,
            "created_on": "2025-05-05T10:26:09.000Z"
        },
        {
            "account_number": "90048307",
            "is_used": 0,
            "created_on": "2025-05-05T10:26:10.000Z"
        },
        {
            "account_number": "90048315",
            "is_used": 0,
            "created_on": "2025-05-05T10:26:11.000Z"
        },
        {
            "account_number": "90048323",
            "is_used": 0,
            "created_on": "2025-05-05T10:26:12.000Z"
        },
        {
            "account_number": "90048331",
            "is_used": 0,
            "created_on": "2025-05-05T10:26:13.000Z"
        },
        {
            "account_number": "90048348",
            "is_used": 0,
            "created_on": "2025-05-05T10:26:14.000Z"
        },
        {
            "account_number": "90048356",
            "is_used": 0,
            "created_on": "2025-05-05T10:26:15.000Z"
        },
        {
            "account_number": "90048364",
            "is_used": 0,
            "created_on": "2025-05-05T10:26:16.000Z"
        }
    ]
  }
  updateCampaign(data: any) {
    this.router.navigate(['/add-update-campaign'], { state: { campaignData: data } });
  }
  createCampaign() {
    this.router.navigate(['/add-update-campaign'], { state: { campaignData: null } });
  }

}
