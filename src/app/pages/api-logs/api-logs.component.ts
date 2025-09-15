import { ChangeDetectorRef, Component } from '@angular/core';
import { TableComponent } from '../../components/table/table.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiGateWayService } from 'app/services/apiGateway.service';
import * as globals from 'app/globals';
@Component({
  selector: 'app-api-logs',
  imports: [FormsModule, CommonModule, TableComponent],
  templateUrl: './api-logs.component.html',
  styleUrl: './api-logs.component.scss',
  standalone: true
})
export class ApiLogsComponent {
  apilogsOptions: any = {
    data: [],
    filteredData: [],
    serverMode: true,
    serverDownload: false,
    columns: {
      "id": { title: "ID", search: true, col: "col-1", format: 'function', fn: this.commonFunction.bind(this) },
      "type": { title: "Type", search: true, col: "col-1", format: 'function', fn: this.commonFunction.bind(this) },
      "url": { title: "URL", search: true, col: "col-2", format: 'function', fn: this.commonFunction.bind(this) },
      "requestbody": { title: "Request Body", search: true, col: "col-2", format: 'function', fn: this.commonFunction.bind(this) },
      "responsebody": { title: "Response Body", search: true, col: "col-2", format: 'function', fn: this.commonFunction.bind(this) },
      "headers": { title: "Headers", search: true, col: "col-2", format: 'function', fn: this.commonFunction.bind(this) },
      "created_date": { title: "Created date", col: "col-1", search: false, format: 'date', fn: this.commonFunction.bind(this) },
    },
    pagination: true,
    filter: null,
    search: false,
    select: true,
    tapRow: this.viewapilogs.bind(this),
    rowActions: [],
    download: true,
    btnSize: "small",
    pageSize: 50,
    totalCount: true,
    rowClass: "table-row",
    columnClass: "table-column",
    uploadOptions: {
    },
    serverParams: {
      pageDetail: {
        page: 1,
        pageSize: 50,
        rowCount: 0,
        pageCount: 1,
        type: "",
        name: ""
      },
      sortDetail: {
        field: "id",
        type: "desc",
      },
      where: {},
    },
  };
  type: string = "";
  name: string = "";
  fromDate: string = "";
  toDate: string = "";
  API_Types: any[] = [];

  constructor(
    private router: Router,
    private api: ApiGateWayService,
    private cdr: ChangeDetectorRef
  ) {
    this.getAPItypes();
    this.loadApiLogs();
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

  searchLogs() {
    let payload: any = {};
    if (this.type) payload['type'] = this.type; else payload['type'] = "";
    if (this.name) payload['name'] = this.name; else payload['name'] = "";
    if (this.fromDate) payload['fromDate'] = this.fromDate + " 00:00:00"; else payload['fromDate'] = "";
    if (this.toDate) payload['toDate'] = this.toDate + " 23:59:59"; else payload['toDate'] = "";
    if (this.fromDate && this.toDate && (new Date(this.fromDate) > new Date(this.toDate))) {
      alert("From date cannot be greater than To date.");
      return;
    }
    this.apilogsOptions.serverParams = { ...this.apilogsOptions.serverParams, ...payload };
    this.apilogsOptions = { ...this.apilogsOptions };
    this.api.get(globals.getAPIlogs(this.apilogsOptions.serverParams)).subscribe({
      next: (res: any) => {
        this.apilogsOptions.data = res.data;
        const totalCount = (res.totalcount && res.totalcount.length > 0) ? res.totalcount[0].count : 0;
        this.apilogsOptions.totalCount = totalCount;
        this.apilogsOptions.serverParams.pageDetail = {
          ...this.apilogsOptions.serverParams.pageDetail,
          rowCount: totalCount,
          pageCount: Math.ceil(totalCount / this.apilogsOptions.serverParams.pageDetail.pageSize)
        };
        this.apilogsOptions = { ...this.apilogsOptions };
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading APIs Logs:', err);
      }
    });
  }

  loadApiLogs() {
    this.api.get(globals.getAPIlogs(this.apilogsOptions.serverParams)).subscribe({
      next: (res: any) => {
        this.apilogsOptions.data = res.data;
        const totalCount = (res.totalcount && res.totalcount.length > 0) ? res.totalcount[0].count : 0;
        this.apilogsOptions.totalCount = totalCount;
        this.apilogsOptions.serverParams.pageDetail = {
          ...this.apilogsOptions.serverParams.pageDetail,
          rowCount: totalCount,
          pageCount: Math.ceil(totalCount / this.apilogsOptions.serverParams.pageDetail.pageSize)
        };
        this.apilogsOptions = { ...this.apilogsOptions };
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading APIs Logs:', err);
      }
    });
  }
  getAPItypes() {
    this.api.get(globals.getAPItypes).subscribe({
      next: (res: any) => {
        this.API_Types = res.data;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error loading API types:', err);
      }
    });
  }
  viewapilogs(data: any) {
    this.router.navigate(['/api-logs-details'], { state: { apilogDetail: data } });
  }

  onPageChange(params: any) {
    this.updateServerParams({ pageDetail: params });
    this.loadApiLogs();
  }

  onSortChange(params: any) {
    this.updateServerParams({ sortDetail: params });
    this.loadApiLogs();
  }

  onSearchFilter(params: any) {
    this.updateServerParams({ pagedetail: params });
    this.loadApiLogs();
  }

  updateServerParams(newProps: any) {
    this.apilogsOptions.serverParams = Object.assign({}, this.apilogsOptions.serverParams, newProps);
  }

}


