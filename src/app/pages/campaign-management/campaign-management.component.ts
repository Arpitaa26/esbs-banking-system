import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiGateWayService } from 'app/services/apiGateway.service';
import { SegmentComponent } from 'app/components/segment/segment.component';
import { TableComponent } from 'app/components/table/table.component';
import * as globals from '../../globals';
@Component({
  selector: 'app-campaign-management',
  standalone: true,
  imports: [SegmentComponent, CommonModule, FormsModule, TableComponent],
  templateUrl: './campaign-management.component.html',
  styleUrl: './campaign-management.component.scss',
})
export class CampaignManagementComponent {
  segbuttonConfig2: any[] = [
    { name: 'Active', functionName: 'active' },
    { name: 'Archived', functionName: 'archived' },
  ];
  currentTab: string = 'active';
  campaignActiveOptions: any = {
    data: [],
    filteredData: [],
    serverMode: true,
    totalCount: null,
    columns: {
      campaign_title: { title: 'Campaign Title', search: true },
      type: { title: 'Type', search: true },
      title: { title: 'Message', search: true },
      start_date: { title: 'Start Date', search: true },
      end_date: { title: 'End Date', search: true },
    },
    pagination: true,
    filter: null,
    search: true,
    select: true,
    selectedActions: [
      {
        title: 'Delete',
        color: 'red',
      },
    ],
    rowActions: [],
    download: true,
    btnSize: 'small',
    pageSize: 50,
    rowClass: 'table-row',
    columnClass: 'table-column',
    add: {
      addActionTitle: 'Add Campaign Master',
      addAction: this.createCampaign.bind(this),
    },
    tapRow: this.updateCampaign.bind(this),
    resetFilter: null,
    uploadOptions: {},
    serverParams: {
      pageDetail: {
        page: 1,
        pageSize: 50,
        rowCount: 0,
        pageCount: 1,
      },
      sortDetail: { field: "created_at", type: "desc" },
      where: { isactive: 1 }
    },
  };
  campaignArchivedOptions: any = {
    data: [],
    filteredData: [],
    columns: {
      campaign_title: { title: 'Campaign Title', search: true },
      type: { title: 'Type', search: true },
      title: { title: 'Message', search: true },
      start_date: { title: 'Start Date', search: true },
      end_date: { title: 'End Date', search: true },
    },
    pagination: true,
    filter: null,
    search: true,
    select: true,
    selectedActions: [
      {
        title: 'Delete',
        color: 'red',
      },
    ],
    rowActions: [],
    download: true,
    btnSize: 'small',
    pageSize: 50,
    rowClass: 'table-row',
    columnClass: 'table-column',
    add: {
      addActionTitle: 'Add Campaign Master',
      addAction: this.createCampaign.bind(this),
    },
    tapRow: this.updateCampaign.bind(this),
    resetFilter: null,
    uploadOptions: {},
    serverMode: true,
    serverParams: {
      pageDetail: {
        page: 1,
        pageSize: 50,
        rowCount: 0,
        pageCount: 1,
      },
      sortDetail: { field: "created_at", type: "desc" },
      where: { isactive: 0 }

    },
  };

  constructor(
    private router: Router,
    private api: ApiGateWayService,
    private cdr: ChangeDetectorRef
  ) {
    const state = this.router.getCurrentNavigation()?.extras?.state;
    this.currentTab = state?.['tab'] || 'active';
    this.seghandleClick(this.currentTab);
  }

  seghandleClick(tab: string) {
    this.currentTab = tab;
    if (tab === 'active') {
      this.getCampaignList();
    } else {
      this.getArchivedCampaignList();
    }
  }
  openCampaignDetails(campaign: any) {
    this.router.navigate(['/add-update-campaign'], {
      state: { data: campaign, tab: this.currentTab }
    });
  }

  getCampaignList() {
    const apiUrl = globals.getAllCampaignMasterEndpoint(this.campaignActiveOptions.serverParams);
    this.api.get(apiUrl).subscribe({
      next: (res: any) => {
        const campaignList = res?.data || [];
        const activeList = JSON.parse(JSON.stringify(res.data.filter((x: any) => x.isactive == 1)));;
        this.campaignActiveOptions.data = activeList;
        const totalCount = (res.totalcount && res.totalcount.length > 0) ? res.totalcount[0].count : 0;
        this.campaignActiveOptions.totalCount = totalCount;
        this.campaignActiveOptions.serverParams.pageDetail = {
          ...this.campaignActiveOptions.serverParams.pageDetail,
          rowCount: totalCount,
          pageCount: Math.ceil(totalCount / this.campaignActiveOptions.serverParams.pageDetail.pageSize)
        };

        this.campaignActiveOptions = {
          ...this.campaignActiveOptions,
          data: activeList,
          filteredData: [...activeList],
          selectedActions: [

            { title: 'Archive', color: 'red', action: this.archivedCampaign.bind(this) },
          ],
        };
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching campaign data', err);
      }
    });
  }
  getArchivedCampaignList() {
    const apiUrl = globals.getAllArchivedCampaignMasterEndpoint(this.campaignArchivedOptions.serverParams);
    this.api.get(apiUrl).subscribe({
      next: (res: any) => {
        const campaignList = res?.data || [];
        const archivedList = JSON.parse(JSON.stringify(res.data.filter((x: any) => x.isactive == 0)));
        this.campaignArchivedOptions = {
          ...this.campaignArchivedOptions,
          data: archivedList,
          filteredData: [...archivedList],
          selectedActions: [

            { title: 'Active', color: 'green', action: this.activeCampaign.bind(this) },
          ],
        };
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching archived campaigns', err);
      }
    });
  }
  updateCampaign(data: any) {
    this.router.navigate(['/add-update-campaign'], {
      state: { campaignData: data, tab: this.currentTab },

    });
  }
  createCampaign() {
    this.router.navigate(['/add-update-campaign'], { state: { tab: this.currentTab } });
    this.router.navigate(['/add-update-campaign'], { state: { tab: this.currentTab } });
  }

  archivedCampaign(selectedRows: any[]) {
    try {
      const campaignIds = selectedRows.map((item: any) => item.id).join(',');
      const payload = { id: campaignIds, isactive: 0 };
      this.api.post(globals.updateCampaignStatusEndpoint, payload).subscribe({
        next: () => {
          this.getCampaignList();
          this.getArchivedCampaignList();
        },
        error: (err) => console.error('Error archiving campaign:', err),
      });
    } catch (error) {
      console.error('Exception in archiveCampaign:', error);
    }
  }
  activeCampaign(selectedRows: any[]) {
    try {
      const campaignIds = selectedRows.map((item: any) => item.id).join(',');
      const payload = { id: campaignIds, isactive: 1 };
      this.api.post(globals.activeCampaignMasterEndpoint, payload).subscribe({
        next: () => {
          this.getCampaignList();
          this.getArchivedCampaignList();
        },
        error: (err) => console.error('Error activating campaign:', err),
      });
    } catch (error) {
      console.error('Exception in activateCampaign:', error);
    }
  }


  onPageChange(params: any, tableIndex: number) {
    this.updateParams({ pageDetail: params }, tableIndex);
    switch (tableIndex) {
      case 1:
        this.getCampaignList();
        break;
      case 2:
        this.getArchivedCampaignList();
        break;
    }
  }
  onSortChange(params: any, tableIndex: number) {
    this.updateParams({ sortDetail: params }, tableIndex);
    switch (tableIndex) {
      case 1:
        this.getCampaignList();
        break;
      case 2:
        this.getArchivedCampaignList();
        break;
    }
  }
  onSearchFilter(params: any, tableIndex: number) {
    this.updateParams({ filter: params }, tableIndex);
    switch (tableIndex) {
      case 1:
        this.getCampaignList();
        break;
      case 2:
        this.getArchivedCampaignList();
        break;
    }
  }
  updateParams(newProps: any, tableIndex: number) {
    switch (tableIndex) {
      case 1:
        this.campaignActiveOptions.serverParams = Object.assign({}, this.campaignActiveOptions.serverParams, newProps);
        break;
      case 2:
        this.campaignArchivedOptions.serverParams = Object.assign({}, this.campaignArchivedOptions.serverParams, newProps);
        break;
    }
  }
}


