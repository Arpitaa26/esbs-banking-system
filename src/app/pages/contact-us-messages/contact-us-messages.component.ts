import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TableComponent } from 'app/components/table/table.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SegmentComponent } from 'app/components/segment/segment.component';
import { Router } from '@angular/router';
import * as globals from '../../globals';
import { ApiGateWayService } from 'app/services/apiGateway.service';

@Component({
  selector: 'app-contact-us-messages',
  standalone: true,
  imports: [SegmentComponent, CommonModule, FormsModule, TableComponent],
  templateUrl: './contact-us-messages.component.html',
  styleUrl: './contact-us-messages.component.scss'
})
export class ContactUsMessagesComponent implements OnInit {
  currentTab: string = 'active_messages';

  segbuttonConfig: any = [
    { name: 'Active', functionName: 'active_messages' },
    { name: 'Archive', functionName: 'drafted_messages' }
  ];

  activeMessagingOptions: any = {
    data: [],
    serverMode: true,
    columns: {
      sopra_reference_num: {
        title: 'Member ID',
        col: 1,
        search: true,
        format: 'function',
        fn: this.commonFunction.bind(this)
      },
      firstname: {
        title: 'Firstname',
        format: 'function',
        fn: this.commonFunction.bind(this)
      },

      description: {
        title: 'Message',
        search: true,
        format: 'function',
        fn: this.commonFunction.bind(this)
      },
      create_date: {
        title: 'Date',
        col: 1,
        search: true,
        format: 'date',
        formatString: 'DD/MM/YYYY HH:mm'
      },
      readby: {
        title: 'Read By',
        col: 1,
        search: true,
        format: 'function',
        fn: this.commonFunction.bind(this)
      }
    },
    pagination: true,
    fitler: null,
    search: true,
    select: true,
    selectedActions: [
      {
        title: "Archive",
        color: "red",
        action: this.deleteMessage.bind(this)
      },
    ],
    rowActions: [],
    download: true,
    btnSize: "small",
    pageSize: 50,
    rowClass: "table-row",
    columnClass: "table-column",
    tapRow: this.updateMessgae.bind(this),
    uploadOptions: {},
    serverParams: {
      pageDetail: {
        page: 1,
        pageSize: 50,
        rowCount: 0,
        pageCount: 1,
      },
      sortDetail: {
        field: "contact-us-messages.customer_complaint_id",
        type: "desc",
      },
      listDetail: {
        type: "active"
      },
      where: {},
    },
  };

  draftMessagingOptions: any = {
    data: [],
    columns: {
      sopra_reference_num: {
        title: 'Member ID',
        col: 1,
        search: true,
        format: 'function',
        fn: this.commonFunction.bind(this)
      },
      firstname: {
        title: 'Firstname',
        search: true,
        format: 'function',
        fn: this.commonFunction.bind(this)
      },
      subject: {
        title: 'Subject',
        search: false,
        format: 'function',
        fn: this.commonFunction.bind(this)
      },
      description: {
        title: 'Message',
        search: true,
        format: 'function',
        fn: this.commonFunction.bind(this)
      },
      create_date: {
        title: 'Date',
        col: 1,
        search: true,
        format: 'date',
        formatString: 'DD/MM/YYYY HH:mm'
      },
      readby: {
        title: 'Read By',
        col: 1,
        search: true,
        format: 'function',
        fn: this.commonFunction.bind(this)
      }
    },
    pagination: true,
    fitler: null,
    search: true,
    select: true,
    selectedActions: [
      {
        title: "Active",
        color: "green",
        action: this.activeMessage.bind(this)
      },
    ],
    rowActions: [],
    download: true,
    btnSize: "small",
    pageSize: 50,
    rowClass: "table-row",
    columnClass: "table-column",
    add: {},
    uploadOptions: {},
  };

  constructor(
    private router: Router,
    private apiService: ApiGateWayService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadContactUsMessages();
  }

  loadContactUsMessages(): void {
    const apiUrl = globals.getContactApi(this.activeMessagingOptions.serverParams);
    // globals.contactusEndpoint
    this.apiService.get(apiUrl).subscribe({
      next: (response: any) => {
        const allMessages = response?.data || [];

        const activeMessages = allMessages.filter((msg: any) => msg.isactive === 1);
        const draftedMessages = allMessages.filter((msg: any) => msg.isactive !== 1);

        this.activeMessagingOptions = {
          ...this.activeMessagingOptions,
          data: activeMessages
        };

        this.draftMessagingOptions = {
          ...this.draftMessagingOptions,
          data: draftedMessages
        };

        this.cdr.detectChanges();
      },
      error: err => console.error('Error loading messages:', err)
    });
  }

  deleteMessage(data: any): void {
    let id = data[0].customer_complaint_id;

    let payload = {
      customer_complaint_id: id.toString(),
      isactive: 0
    }

    this.apiService.post(globals.archiveEndpoint, payload).subscribe({
      next: (response: any) => {
        if (response.status === true) {
          this.loadContactUsMessages();
        } else {
          console.error('Error archiving message:', response);
        }
      },
      error: err => console.error('Error archiving message:', err)
    });

  }

  activeMessage(data: any): void {
    let id = data[0].customer_complaint_id;

    let payload = {
      customer_complaint_id: id.toString(),
      isactive: 1
    }

    this.apiService.post(globals.archiveEndpoint, payload).subscribe({
      next: (response: any) => {
        if (response.status === true) {
          this.loadContactUsMessages();
        } else {
          console.error('Error archiving message:', response);
        }
      },
      error: err => console.error('Error archiving message:', err)
    });

  }

  seghandleClick(functionName: string) {
    switch (functionName) {
      case functionName:
        this.currentTab = functionName;
        break;
    }
  }

  commonFunction(nullData: any) {
    try {
      let str = "";
      if (nullData == 0 || nullData == null || nullData == undefined) {
        str = "--";
      } else {
        str = nullData;
      }
      return str;
    } catch (error) {
      console.error("Error in commonFunction:", error);
      return "--";
    }
  }

  DraftcommonFunction(nullData: any) {
    try {
      let str = "";
      if (nullData == 0 || nullData == null || nullData == undefined) {
        str = "--";
      } else if (nullData === "Authoriser_Approved") {
        str = 'Compliance_Approved';
      } else if (nullData === "Compliance_Approved") {
        str = 'Authoriser_Approved';
      } else if (nullData === "Compliance_Rejected") {
        str = 'Authoriser_Rejected';
      } else if (nullData === "Authoriser_Rejected") {
        str = 'Compliance_Rejected';
      } else {
        str = nullData;
      }
      return str;
    } catch (error) {
      console.error("Error in DraftcommonFunction:", error);
      return "--";
    }
  }

  updateMessgae(data: any) {
    const id = data?.customer_complaint_id;
    if (!id) return;

    this.router.navigate(['/contact-us-messages-details'], {
      state: { chatData: data }
    });
  }

  onPageChange(params: any, tableIndex: number) {
    this.activeMessagingOptions.serverParams = Object.assign({},this.activeMessagingOptions.serverParams,{ pageDetail: params });
    this.loadContactUsMessages();
  }

  onSearchFilter(params: any, tableIndex: number) {
    this.activeMessagingOptions.serverParams = Object.assign({},this.activeMessagingOptions.serverParams,{ searchDetail: params });
    this.loadContactUsMessages();
  }
}
