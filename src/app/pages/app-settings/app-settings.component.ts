import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, AfterViewInit, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SegmentComponent } from 'app/components/segment/segment.component';
import { TableComponent } from 'app/components/table/table.component';
import { ApiGateWayService } from 'app/services/apiGateway.service';
import * as globals from 'app/globals';
import Quill from 'quill';
import { GlobalProviderService } from 'app/services/global-provider.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, TableComponent, SegmentComponent],
  templateUrl: './app-settings.component.html',
  styleUrl: './app-settings.component.scss'
})
export class AppSettingsComponent implements OnInit, AfterViewInit {
  currentTab1 = 'branches';
  currentTab2 = 'active';
  currentTab3 = 'app_tandc';
  quillEditor: Quill | undefined;
  selectedTabContent: string = '';
  tncData: any = {};

  constructor(
    private router: Router,
    private api: ApiGateWayService,
    private cdr: ChangeDetectorRef,
    private gps: GlobalProviderService
  ) {
    const state = this.router.getCurrentNavigation()?.extras?.state;

    if (state?.['tab']) {
      this.currentTab1 = state['tab'];
      this.currentTab2 = state['subTab'];
    }

    if (this.currentTab1 === 'branches') {
      this.loadBranches();
    } else if (this.currentTab1 === 'sms') {
      this.loadSms();
    } else if (this.currentTab1 === 'new_blog_social') {
      this.loadImpInfo();
    }
  }

  ngOnInit(): void {
    if (!this.router.getCurrentNavigation()?.extras?.state?.['tab']) {
      this.loadBranches();
      this.loadSms();
      this.loadImpInfo();
    }
  }

  ngAfterViewInit(): void {
    if (this.currentTab1 === 't&c') {
      setTimeout(() => this.initializeQuill(), 0);
    }
  }

  branchOptions: any = {
    data: [],
    filteredData: [],
    columns: {
      name: { title: 'Name', search: true, mobile: true, format: 'function', fn: this.commonFunction.bind(this) },
      address_line1: { hide: true, search: true, mobile: true },
      address_line2: { hide: true, search: true, mobile: true },
      address_line3: { hide: true, search: true, mobile: true },
      address_line4: { hide: true, search: true, mobile: true },
      opening_hours: {
        title: 'Opening Hours',
        format: 'function',
        fn: (value: any) =>
          value?.map((v: any) => `<div>${v.day || '--'}: ${v.hours || '--'}</div>`).join('') || '--',
        search: true,
        mobile: true,
      },
      tel: { title: 'Telephone', search: true, mobile: true, format: 'function', fn: this.commonFunction.bind(this) },
      fax: { title: 'Fax', search: true, mobile: true, format: 'function', fn: this.commonFunction.bind(this) },
      postalcode: { title: 'Postal Code', search: true, mobile: true, format: 'function', fn: this.commonFunction.bind(this) },
      email: { title: 'Email ID', mobile: true, format: 'function', fn: this.commonFunction.bind(this) },
    },
    pagination: true,
    search: true,
    select: true,
    selectedActions: [{ title: 'Delete', color: 'red', action: this.deleteBranches.bind(this) }],
    rowActions: [],
    download: true,
    btnSize: 'small',
    pageSize: 50,
    rowClass: 'table-row',
    columnClass: 'table-column',
    add: {
      addActionTitle: 'Add Branch',
      addAction: this.addBranch.bind(this),
    },
    tapRow: this.updateBranch.bind(this),
    uploadOptions: {},
  };

  smsOptions: any = {
    data: [],
    filteredData: [],
    totalCount: null,
    serverMode: true,
    columns: {
      type: { title: 'Type', search: true },
      purpose: { title: 'Purpose', search: true },
      msg: { title: 'Message', search: true },
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
      addActionTitle: 'Add SMS',
      addAction: this.create_sms.bind(this),
    },
    tapRow: this.update_sms.bind(this),
    uploadOptions: {},
    serverParams: {
      pageDetail: {
        page: 1,
        pageSize: 50,
        rowCount: 0,
        pageCount: 1,
      },
      sortDetail: {
      },
      where: {},
    },
  };

  importantInfoOptions: any = {
    data: [],
    filteredData: [],
    serverMode: true,
    totalCount: null,
    columns: {
      title: {
        title: 'Title',
        search: true,
        format: 'function',
        fn: this.commonFunction.bind(this)
      },
      product_information_id: {
        title: 'Product Information ID',
        format: 'function',
        search: true,
        fn: this.commonFunction.bind(this)
      },
      create_date: {
        title: 'Date',
        format: 'date',
        search: true,
        formatString: 'DD/MM/YYYY HH:mm'
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
      addActionTitle: 'Add News, Blogs, & Social',
      addAction: this.addImpInfo.bind(this)
    },
    tapRow: this.updateImpInfo.bind(this),
    resetFilter: null,
    uploadOptions: {},
    serverParams: {
      pageDetail: {
        page: 1,
        pageSize: 50,
        rowCount: 0,
        pageCount: 1,
      },
      sortDetail: { field: 'product_information_id', type: 'desc' },
      where: {}
    },
    sortDetail: { field: 'product_information_id', type: 'desc' },
  };
  tooltipMsg = "This feature is not available at the moment; it will be accessible once the transfer feature has been enabled.";
  branchSegButtons = [
    { name: 'Branches', functionName: 'branches' },
    { name: 'Terms & Conditions', functionName: 't&c' },
    { name: 'News, Blogs & Social', functionName: 'new_blog_social' },
    { name: 'SMS', functionName: 'sms' },
  ];
  newsBlogSegButtons = [
    { name: 'Active', functionName: 'active' },
    { name: 'Archive', functionName: 'archive' },
  ];
  termsSegButtons = [
    { name: 'Mobile App Terms & Conditions', functionName: 'app_tandc' },
    { name: 'Online Terms & Conditions', functionName: 'online_tnc' },
    { name: 'FSCS Information', functionName: 'fcss_info' },
    { name: 'Privacy Policy', functionName: 'privacy_notice' },
    { name: 'Transfer Notes', functionName: 'transfer_note', tooltip: this.tooltipMsg },
    { name: 'Transfer Information', functionName: 'transfer_info', tooltip: this.tooltipMsg },
  ];

  onBranchSegClick(functionName: string) {
    this.currentTab1 = functionName;
    if (functionName === 't&c' && !this.quillEditor) {
      setTimeout(() => this.initializeQuill(), 0);
    }
    if (functionName === 'branches') {
      this.loadBranches();
    }
    if (functionName === 'sms') {
      this.loadSms();
    }
    if (functionName === 'new_blog_social') {
      this.currentTab1 = 'new_blog_social';
      this.currentTab2 = 'active';
      this.loadImpInfo();
    }
  }

  onNewsBlogSegClick(functionName: string) {
    this.currentTab2 = functionName;
    this.loadImpInfo();
  }

  onTermsSegClick(functionName: string) {
    this.currentTab3 = functionName;
    this.loadTermsAndConditions(this.currentTab3);
  }

  initializeQuill(): void {
    this.quillEditor = new Quill('#editor-container', {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ font: [] }, { size: ['small', false, 'large', 'huge'] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }],
          [{ script: 'sub' }, { script: 'super' }],
          [{ header: 1 }, { header: 2 }],
          [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
          [{ align: [] }],
          ['blockquote', 'code-block'],
          ['link'],
          ['clean']
        ]
      }
    });
    const editorElem = this.quillEditor.root;
    editorElem.addEventListener('paste', (event: ClipboardEvent) => {
      const items = event.clipboardData?.items || [];
      const hasImage = Array.from(items).some(item => item.type.startsWith('image/'));
      if (hasImage) {
        event.preventDefault();
        event.stopPropagation();
      }
    });
    this.quillEditor.on('text-change', () => {
      const html = this.quillEditor?.root.innerHTML;
    });
    this.loadTermsAndConditions(this.currentTab3);
  }

  loadBranches() {
    this.api.get(globals.getBranchesEndpoint).subscribe({
      next: (res: any) => {
        const branchList = res?.data || [];
        this.branchOptions = {
          ...this.branchOptions,
          data: branchList,
          filteredData: [...branchList],
        };
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Branch Load Error:', err);
      }
    });
  }

  loadSms() {
    const apiUrl = globals.getSmsMessagesEndpoint(this.smsOptions.serverParams);
    this.api.get(apiUrl).subscribe({
      next: (res: any) => {
        this.smsOptions.data = res.data;
        const totalCount = (res.totalcount && res.totalcount.length > 0) ? res.totalcount[0].count : 0;
        this.smsOptions.totalCount = totalCount;
        this.smsOptions.serverParams.pageDetail = {
          ...this.smsOptions.serverParams.pageDetail,
          rowCount: totalCount,
          pageCount: Math.ceil(totalCount / this.smsOptions.serverParams.pageDetail.pageSize)
        };
        this.smsOptions = { ...this.smsOptions };
        this.cdr.detectChanges();
      },
      error: (err) => console.error('SMS Load Error:', err)
    });
  }

  onPageChange(params: any, tableIndex: number) {
    this.updateParams({ pageDetail: params }, tableIndex);
    switch (tableIndex) {
      case 1:
        this.loadSms();
        break;
      case 2:
        this.loadImpInfo();
        break;
    }
  }

  updateParams(newProps: any, tableIndex: number) {
    switch (tableIndex) {
      case 1:
        this.smsOptions.serverParams = Object.assign({}, this.smsOptions.serverParams, newProps);
        break;
      case 2:
        this.importantInfoOptions.serverParams = Object.assign({}, this.importantInfoOptions.serverParams, newProps);
        break;
    }
  }

  onSortChange(params: any, tableIndex: number) {
    this.updateParams({ sortDetail: params }, tableIndex);
    switch (tableIndex) {
      case 1:
        this.loadSms();
        break;
      case 2:
        this.loadImpInfo();
        break;
    }
  }

  onSearchFilter(params: any, tableIndex: number) {
    this.updateParams({ searchDetail: params }, tableIndex);
    switch (tableIndex) {
      case 1:
        this.loadSms();
        break;
      case 2:
        this.loadImpInfo();
        break;
    }
  }

  loadImpInfo() {
    const apiUrl = globals.getProductsInformationEndpoint(this.importantInfoOptions.serverParams);
    this.api.get(apiUrl).subscribe({
      next: (res: any) => {
        const allData = res?.data || [];
        const activeList = allData.filter((x: any) => x.isactive === 1);
        const archivedList = allData.filter((x: any) => x.isactive === 0);
        const selectedAction = this.currentTab2 === 'active'
          ? { title: "Archive", color: "red", action: this.archiveImpInfo.bind(this) }
          : { title: "Activate", color: "green", action: this.activateImpInfo.bind(this) };
        this.importantInfoOptions = {
          ...this.importantInfoOptions,
          data: this.currentTab2 === 'active' ? activeList : archivedList,
          filteredData: this.currentTab2 === 'active' ? [...activeList] : [...archivedList],
          selectedActions: [selectedAction],
        };
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Important Info Load Error:', err);
      }
    });
  }

  updateImpInfoStatus(data: any[], isActive: number) {
    const infoIds = data.map((item: any) => item.product_information_id).join(',');
    const payload = {
      product_information_id: infoIds,
      isactive: isActive,
      modifiedby: this.gps.usersID,
      modified_date: new Date().toISOString()
    };
    this.api.post(globals.updateProductInformationStatusEndpoint, payload).subscribe({
      next: () => {
        alert(`Important Info ${isActive === 1 ? 'activated' : 'archived'} successfully!`);
        this.loadImpInfo();
      },
      error: (err) => {
        console.error('Failed to update status:', err);
        alert('Error updating Important Info status.');
      }
    });
  }

  archiveImpInfo(data: any) {
    this.updateImpInfoStatus(data, 0);
  }

  activateImpInfo(data: any) {
    this.updateImpInfoStatus(data, 1);
  }

  loadTermsAndConditions(tabKey: string = 'app_tandc') {
    const backendKeyMap: Record<string, string> = {
      app_tandc: 'onboarding',
      online_tnc: 'onlinetnc',
      fcss_info: 'newaccount',
      privacy_notice: 'product',
      transfer_note: 'product_notes',
      transfer_info: 'transfer_information',
    };
    const backendField = backendKeyMap[tabKey];
    this.api.get(globals.getTermsAndConditionEndpoint).subscribe({
      next: (res: any) => {
        this.tncData = res?.data || {};
        const html = this.tncData?.[backendField] || '<p>No content available.</p>';
        if (this.quillEditor) {
          this.quillEditor.root.innerHTML = html;
        }
      },
      error: (err) => {
        console.error('Terms API error:', err);
        if (this.quillEditor) {
          this.quillEditor.root.innerHTML = '<p>Error loading content.</p>';
        }
        this.cdr.detectChanges();
      }
    });
  }

  saveTermsAndCondition(): void {
    let content = this.quillEditor?.root.innerHTML || '';
    content = content.replace(/<img[^>]*>/g, '');
    content = content.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    content = content.replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '');
    const fieldMap: Record<string, string> = {
      app_tandc: 'onboarding',
      online_tnc: 'onlinetnc',
      fcss_info: 'newaccount',
      privacy_notice: 'product',
      transfer_note: 'product_notes',
      transfer_info: 'transfer_information',
    };
    const endpointMap: Record<string, string> = {
      app_tandc: globals.updateOnboardingTncEndpoint,
      online_tnc: globals.updateOnlineTncEndpoint,
      fcss_info: globals.updateFcssTermsAndConditionEndpoint,
      privacy_notice: globals.updateProductTncEndpoint,
      transfer_note: globals.updateTransferNoteEndpoint,
      transfer_info: globals.updateTransferInfoTncEndpoint,
    };
    const field = fieldMap[this.currentTab3 as keyof typeof fieldMap];
    const endpoint = endpointMap[this.currentTab3 as keyof typeof endpointMap];
    if (!field || !endpoint) {
      alert('Invalid T&C tab selected');
      return;
    }
    const payload: any = {
      ...this.tncData,
      [field]: content,
      modifiedby: this.gps.usersID,
      modified_date: new Date().toISOString(),
    };
    this.api.post(endpoint, payload).subscribe({
      next: () => {
        alert('Terms & Conditions updated successfully!');
        this.loadTermsAndConditions(this.currentTab3);
      },
      error: (err) => {
        console.error('Failed to update T&C:', err);
        alert('Error while saving changes');
      }
    });
  }

  deleteBranches(data: any) {
    try {
      const branchIds = data.map((item: any) => item.branches_id).join(',');
      const payload = {
        branches_id: branchIds,
        createdby: this.gps.usersID
      };
      this.api.post(globals.deleteBranchesEndpoint, payload).subscribe({
        next: () => {
          alert('Branches deleted successfully!');
          this.loadBranches();
        },
        error: (err) => {
          console.error('Error deleting Branch:', err);
          alert('Failed to delete branch. Please check your permissions.');
        }
      });
    } catch (error) {
      console.error('Exception in deleteBranches:', error);
    }
  }

  deleteSms(data: any) {
    try {
      if (!Array.isArray(data) || data.length === 0) {
        alert('Please select at least one SMS to delete.');
        return;
      }
      const smsIds = data.map((item: any) => item.sms_messages_id);
      if (smsIds.includes(null) || smsIds.length === 0) {
        alert('Selected records are missing valid IDs.');
        return;
      }
      const payload = {
        sms_id: smsIds,
        createdby: this.gps.usersID
      };
      this.api.post(globals.deleteSmsMessageEndpoint, payload).subscribe({
        next: (res: any) => {
          alert('SMS deleted successfully!');
          this.loadSms();
        },
        error: (err) => {
          console.error('Error deleting SMS:', err);
          alert('Failed to delete SMS.');
        }
      });
    } catch (error) {
      console.error('Unexpected error in deleteSms:', error);
      alert('Unexpected error while deleting SMS.');
    }
  }

  updateBranch(data: any) {
    this.router.navigate(['/add-update-branch'], { state: { branchData: data } });
  }

  addBranch() {
    this.router.navigate(['/add-update-branch']);
  }

  updateImpInfo(data: any) {
    this.router.navigate(['/add-update-important-information'], { state: { ImpInfoData: data, tab: this.currentTab1, subTab: this.currentTab2 } });
  }

  addImpInfo() {
    this.router.navigate(['/add-update-important-information'], { state: { tab: this.currentTab1, subTab: this.currentTab2 } });
  }

  create_sms() {
    this.router.navigate(['/add-update-sms']);
  }

  update_sms(data: any) {
    this.router.navigate(['/add-update-sms'], { state: { smsData: data } });
  }

  commonFunction(value: any): string {
    return (value === null || value === undefined || value === 0) ? '--' : value;
  }
}
