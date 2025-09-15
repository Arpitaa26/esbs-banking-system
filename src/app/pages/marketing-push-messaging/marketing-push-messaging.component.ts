import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiGateWayService } from 'app/services/apiGateway.service';
import { SegmentComponent } from 'app/components/segment/segment.component';
import { TableComponent } from 'app/components/table/table.component';
import * as globals from 'app/globals';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-marketing-push-messaging',
  standalone: true,
  imports: [SegmentComponent, CommonModule, FormsModule, TableComponent],
  templateUrl: './marketing-push-messaging.component.html',
  styleUrls: ['./marketing-push-messaging.component.scss'],
})
export class MarketingPushMessagingComponent implements OnInit {
  currentTab: string = 'active_messages';

  segbuttonConfig = [
    { name: 'Active', functionName: 'active_messages' },
    { name: 'Drafted', functionName: 'drafted_messages' },
  ];

  activeMessagingOptions: any = {
    data: [],
    filteredData: [],
    totalCount: null,
    serverMode: true,
    columns: {
      title: {
        title: 'Title',
        search: true,
        mobile: true,
        format: 'function',
        fn: this.commonFunction,
      },
      create_date: {
        title: 'Created Date',
        search: true,
        mobile: true,
        format: 'date',
      },
    },
    pagination: true,
    search: true,
    select: true,
    selectedActions: [],
    rowActions: [],
    download: true,
    btnSize: 'small',
    pageSize: 50,
    rowClass: 'table-row',
    columnClass: 'table-column',
    add: {
      addActionTitle: 'Add Push Message',
      addAction: this.create.bind(this),
    },
    tapRow: this.updateMessage.bind(this),
    uploadOptions: {},
  };

  draftedMessagingOptions: any = {
    data: [],
    filteredData: [],
    totalCount: null,
    serverMode: false,
    serverDownload: false,
    columns: {
      title: {
        title: 'Title',
        search: true,
        mobile: true,
        format: 'function',
        fn: this.commonFunction,
      },
      create_date: {
        title: 'Created Date',
        search: true,
        mobile: true,
        format: 'date',
      },
      status: {
        title: 'Status',
        search: true,
        mobile: true,
        format: 'function',
        fn: this.draftStatusFormatter,
      },
    },
    pagination: true,
    search: true,
    select: true,
    selectedActions: [],
    rowActions: [],
    download: true,
    btnSize: 'small',
    pageSize: 50,
    rowClass: 'table-row',
    columnClass: 'table-column',
    add: {},
    tapRow: this.updateMessage.bind(this),
    uploadOptions: {},
    serverParams: {
      pageDetail: { page: 1, pageSize: 50, rowCount: 0, pageCount: 1 },
      sortDetail: { field: 'create_date', type: 'asc' },
      where: {}
    }
  };

  constructor(
    private router: Router,
    private api: ApiGateWayService,
    private cdr: ChangeDetectorRef
  ) {
    this.draftedMessagingOptions.data = [];
    this.loadDraftedMessages();
  }

  ngOnInit() {
    const openTab = history.state.openTab || 'active_messages';
    this.currentTab = openTab;
    this.fetchMessages(this.currentTab as 'active_messages' | 'drafted_messages');
    if (history.state.reload) {
      this.fetchMessages(this.currentTab as 'active_messages' | 'drafted_messages');
      this.loadActiveMessages();
    }
  }

  seghandleClick(tab: string) {
    this.currentTab = tab;
    this.fetchMessages(tab as 'active_messages' | 'drafted_messages');
  }

  fetchMessages(tab: 'active_messages' | 'drafted_messages') {
    if (tab === 'active_messages') {
      this.loadActiveMessages();
    } else if (tab === 'drafted_messages') {
      this.loadDraftedMessages();
    }
  }

  loadActiveMessages() {
    const apiUrl = globals.getPushMessagesEndpoint(this.activeMessagingOptions.serverParams);
    this.api.get(apiUrl).subscribe({
      next: (res: any) => {
        const list = res?.data || [];
        this.activeMessagingOptions = {
          ...this.activeMessagingOptions,
          data: list,
          filteredData: [...list],
        };
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading active messages:', err);
        this.activeMessagingOptions = {
          ...this.activeMessagingOptions,
          data: [],
          filteredData: [],
        };
        this.cdr.detectChanges();
      },
    });
  }

  loadDraftedMessages() {
    const apiUrl = globals.getDraftedPushMessagesEndpoint(this.draftedMessagingOptions.serverParams);
    this.api.get(apiUrl).subscribe({
      next: (res: any) => {
        this.draftedMessagingOptions.data = res.data;
        //  const totalCount = (res.totalcount && res.totalcount.length > 0) ? res.totalcount[0].count : 0;
        const totalCount = res.data.length;
        this.draftedMessagingOptions.totalCount = totalCount;
        this.draftedMessagingOptions.serverParams.pageDetail = {
          ...this.draftedMessagingOptions.serverParams.pageDetail,
          rowCount: totalCount,
          pageCount: Math.ceil(totalCount / this.draftedMessagingOptions.serverParams.pageDetail.pageSize)
        };
        this.draftedMessagingOptions = { ...this.draftedMessagingOptions };
        this.cdr.detectChanges();
      },
    });
  }



  commonFunction(value: any): string {
    return value == 0 || value == null || value == undefined ? '--' : value;
  }

  draftStatusFormatter(value: string): string {
    switch (value) {
      case 'Authoriser_Approved':
        return 'Compliance Approved ';
      case 'Compliance_Approved':
        return ' Authoriser Approved';
      case 'Compliance_Rejected':
        return 'Authoriser_Rejected';
      case 'Authoriser_Rejected':
        return 'Compliance Rejected';
      default:
        return value ?? '--';
    }
  }

  updateMessage(data: any) {
    this.router.navigate(['/add-update-marketing-push-message'], {
      state: { messageData: data },
    });
  }

  create() {
    this.router.navigate(['/add-update-marketing-push-message'], { state: { is_new_msg: true } });
  }

  onPageChange(params: any, tableIndex: number) {
    this.updateParams({ pageDetail: params }, tableIndex);
    switch (tableIndex) {
      case 1:
        this.loadActiveMessages();
        break;
      case 2:
        this.loadDraftedMessages();
        break;
    }
  }

  updateParams(newProps: any, tableIndex: number) {
    switch (tableIndex) {
      case 1:
        this.activeMessagingOptions.serverParams = Object.assign({}, this.activeMessagingOptions.serverParams, newProps);
        break;
      case 2:
        this.draftedMessagingOptions.serverParams = Object.assign({}, this.draftedMessagingOptions.serverParams, newProps);
        break;
    }
  }

  onSortChange(params: any, tableIndex: number) {
    this.updateParams({ sortDetail: params }, tableIndex);
    switch (tableIndex) {
      case 1:
        this.loadActiveMessages();
        break;
      case 2:
        this.loadDraftedMessages();
        break;
    }
  }

  onSearchFilter(params: any, tableIndex: number) {
    this.updateParams({ searchDetail: params }, tableIndex);
    switch (tableIndex) {
      case 1:
        this.loadActiveMessages();
        break;
      case 2:
        this.loadDraftedMessages();
        break;

    }
  }
}
