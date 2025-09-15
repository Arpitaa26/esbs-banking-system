import { Component, ViewChild, Input, Output, EventEmitter, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { PaginationComponent } from '../pagination/pagination.component';
import { UploadButtonComponent } from '../upload-button/upload-button.component';
import moment from 'moment';

@Component({
  selector: 'table',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent, UploadButtonComponent],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  @ViewChild("searchBar") searchBar: any;
  @ViewChild(PaginationComponent) paginationComp!: PaginationComponent;

  @Output() pageChange = new EventEmitter<any>();
  @Output() sortChange = new EventEmitter<any>();
  @Output() searchFilter = new EventEmitter<any>();
  @Output() download = new EventEmitter<any>();

  @Input() downloadLoader: any = { json: false, csv: false };
  @Input() options: any = {
    data: [],
    totalCount: null,
    serverMode: true,
    filteredData: [],
    pagination: true,
    search: true,
    filter: null,
    select: true,
    download: true,
    btnSize: "small",
    pageSize: 13,
    columns: [],
    selectedActions: [],
    allActions: [],
    rowActions: [],
    rowClass: "table-row",
    columnClass: "table-column",
    add: {
      addActionTitle: null,
      addAction: null,
    },
    button1: {
      buttonTitle: null,
      buttonAction: null,
    },
    button2: {
      buttonTitle: null,
      buttonAction: null,
    },
    tapRow: null,
    resetFilter: null,
    uploadOptions: {},
    loading: true
  };

  csvFileName = "export-" + new Date().getTime() + ".csv";
  jsonFileName = "export-" + new Date().getTime() + ".json";

  pageSize = 10;
  selectAllRecords = false;
  filteredData: any = [];
  selected = false;
  selectedCount = 0;

  paginationInfo: any = {
    page: 1,
    pageSize: 50,
    rowCount: 0,
    pageCount: 1
  };

  pageData: any = [];
  selectPage = false;
  sortColumns: any = {};
  valid = true;
  msg: any = [];
  actionCols = "";
  columnKeys: any = [];
  sortType = 'asc';
  searchValue: any;
  sortColumn: any;

  private blurEvent: any;

  constructor(
    public domSanitizer: DomSanitizer,
    public cdr: ChangeDetectorRef
  ) {
    this.options.loading = true;
  }

  getColumnFields(): string[] {
    try {
      const keys: string[] = [];
      if (this.options.columns) {
        for (const key of Object.keys(this.options.columns)) {
          if (this.options.columns[key].hide === undefined || !this.options.columns[key].hide) {
            keys.push(key);
          }
        }
      }
      return keys;
    } catch (error) {
      console.error('Error in getColumnFields:', error);
      return [];
    }
  }

  ngOnInit(): void {
    try {
      this.initializeOptions();
      this.validateInputs();
      this.columnKeys = this.getColumnFields();
    } catch (error) {
      console.error('Error in ngOnInit:', error);
    }
  }

  private initializeOptions(): void {
    try {
      this.options.allActions = this.options.allActions || [];
      this.options.add = this.options.add || { addActionTitle: "", addAction: "" };
      this.options.button1 = this.options.button1 || { buttonTitle: "", buttonAction: "" };
      this.options.button2 = this.options.button2 || { buttonTitle: "", buttonAction: "" };
      this.pageSize = this.options.pageSize ? Number(this.options.pageSize) : 10;
      this.pageSize = [5, 10, 20, 50, 100].includes(this.pageSize) ? this.pageSize : 10;
    } catch (error) {
      console.error('Error in initializeOptions:', error);
    }
  }

  private validateInputs(): void {
    try {
      if (!this.options.columns) {
        this.valid = false;
        this.msg.push("No Columns");
      } else if (!this.options.data) {
        this.valid = false;
        this.msg.push("No Data");
      } else if (typeof this.options.data !== 'object') {
        this.valid = false;
        this.msg.push("Data not an array of objects");
      }
    } catch (error) {
      console.error('Error in validateInputs:', error);
    }
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    try {
      if (this.options.groupColumn) {
        await this.groupColumnData();
      }
      this.options.loading = false;
      this.filterData(this.options.filter);
    } catch (error) {
      console.error('Error in ngOnChanges:', error);
    }
  }

  ngAfterViewInit(): void {
    try {
      this.options.loading = false;
    } catch (error) {
      console.error('Error in ngAfterViewInit:', error);
    }
  }

  getRowClass(item: any): string {
    try {
      if (typeof this.options.rowClass === "function") {
        return this.options.rowClass(item) || 'table-row';
      }
      return this.options.rowClass || '';
    } catch (error) {
      console.error('Error in getRowClass:', error);
      return 'table-row';
    }
  }

  async groupColumnData(): Promise<void> {
    try {
      return new Promise((resolve) => {
        try {
          if (this.options.data.length > 0) {
            if (this.options && typeof this.options.groupColumn !== "string") {
              console.error("Group column requires string type");
              return;
            }

            const groupColumns = this.options.groupColumn.split(",");
            const groupedData: Record<string, any[]> = {};

            for (const item of this.options.data) {
              let groupKey = "";
              for (const col of groupColumns) {
                if (item[col]) {
                  const colName = this.options.columns[col]?.title?.toUpperCase() || col.toUpperCase();
                  const colValue = item[col].toString().toUpperCase().trim();
                  groupKey = groupKey ? `${groupKey} | ${colName}: ${colValue}` : `${colName}: ${colValue}`;
                }
              }

              if (groupedData[groupKey]) {
                groupedData[groupKey].push(item);
              } else {
                groupedData[groupKey] = [item];
              }
            }

            this.options.data = [];
            for (const [key, items] of Object.entries(groupedData)) {
              this.options.data.push({ groupColumndata: key });
              this.options.data.push(...items);
            }
          }
          resolve();
        } catch (error) {
          console.error('Error in groupColumnData promise:', error);
          resolve();
        }
      });
    } catch (error) {
      console.error('Error in groupColumnData:', error);
      return Promise.resolve();
    }
  }


  addActionClicked(action: () => void): void {
    try {
      action();
    } catch (error) {
      console.error('Error in addActionClicked:', error);
    }
  }

  pageSizeChanged(size: number): void {
    try {
      if (this.options.serverMode) this.options.loading = true;

      this.pageSize = size;
      this.paginationInfo.page = 1;
      this.paginationInfo.pageSize = size;

      this.filterData('');

      clearTimeout(this.searchValue);
      this.searchValue = setTimeout(() => {
        this.pageChange.emit(this.paginationInfo);
      }, 900);
    } catch (error) {
      console.error('Error in pageSizeChanged:', error);
    }
  }

  changePage(page: any): void {
    try {
      if (this.options.serverMode) this.options.loading = true;
      this.paginationInfo.page = page;
      this.setPageInfo(page);

      clearTimeout(this.searchValue);
      this.searchValue = setTimeout(() => {
        this.pageChange.emit(this.paginationInfo);
      }, 900);
    } catch (error) {
      console.error('Error in changePage:', error);
    }
  }

  setPageInfo(page: number): void {
    try {
      this.paginationInfo.rowCount = this.options.totalCount !== undefined ?
        this.options.totalCount : this.options.filteredData.length;
      this.paginationInfo.pageSize = this.pageSize;
      this.paginationInfo.pageCount = Math.ceil(this.paginationInfo.rowCount / this.paginationInfo.pageSize) || 1;

      const startIndex = (page - 1) * this.paginationInfo.pageSize;
      this.pageData = this.options.serverMode ?
        this.options.filteredData :
        this.options.filteredData.slice(startIndex, startIndex + this.paginationInfo.pageSize);
    } catch (error) {
      console.error('Error in setPageInfo:', error);
    }
  }

  filterData(filterValue: string | null = null): void {
    try {
      if (!this.options.serverMode) {
        const searchValue = filterValue || this.options.filter || '';

        if (searchValue.trim()) {
          const searchTerms = searchValue.trim().split(' ');
          const newFilterArray: any[] = [];
          let groupColumnItem: any = null;

          this.options.data.filter((item: any) => {
            if (item.groupColumndata && this.options.groupColumn) {
              groupColumnItem = item;
              return false;
            }

            const matchResults: Record<string, boolean> = {};
            for (const term of searchTerms) {
              matchResults[term] = false;

              for (const [key, column] of Object.entries(this.options.columns) as [any, any][]) {
                if (column.search && item[key] !== null && item[key] !== undefined) {
                  if (Array.isArray(item[key])) {
                    matchResults[term] = this.searchArray(item[key], term) || matchResults[term];
                  } else {
                    const strValue = item[key].toString().toLowerCase();
                    matchResults[term] = strValue.includes(term.toLowerCase()) || matchResults[term];
                  }
                }
              }
            }

            const allTermsMatch = Object.values(matchResults).every(Boolean);
            if (allTermsMatch) {
              if (groupColumnItem) {
                newFilterArray.push(groupColumnItem);
                groupColumnItem = null;
              }
              newFilterArray.push(item);
            }
            return allTermsMatch;
          });

          this.options.filteredData = newFilterArray;
        } else {
          this.options.filteredData = [...this.options.data];
        }

        this.sort();
        this.paginationInfo.page = 1;
        this.setPageInfo(this.paginationInfo.page);
      } else {
        this.options.filteredData = this.options.data ? [...this.options.data] : [];
        this.paginationInfo.page = this.options.serverParams?.pageDetail?.page || this.paginationInfo.page;
        this.setPageInfo(this.paginationInfo.page);
      }

      this.selectAll();
    } catch (error) {
      console.error('Error in filterData:', error);
    }
  }

  private searchArray(array: any[], term: string): boolean {
    try {
      return array.some(item => {
        if (Array.isArray(item)) {
          return this.searchArray(item, term);
        }
        return item.toString().toLowerCase().includes(term.toLowerCase());
      });
    } catch (error) {
      console.error('Error in searchArray:', error);
      return false;
    }
  }

  searchEvent(event: Event): void {
    try {
      const input = event.target as HTMLInputElement;
      const value = input.value;

      if (!this.options.serverMode) {
        this.filterData(value);
        clearTimeout(this.blurEvent);
        this.blurEvent = setTimeout(() => input.blur(), 5000);
      } else {
        this.paginationInfo.page = 1;
        const searchData: Record<string, any> = {};

        for (const [key, column] of Object.entries(this.options.columns) as [any, any][]) {
          if (column.search) {
            if (column.format === 'yesno' && ['yes', 'no'].includes(this.options.filter.toLowerCase())) {
              searchData[key] = this.options.filter.toLowerCase() === 'no' ? '0' : 'all';
            } else if (column.format === 'date') {
              searchData[key] = this.options.filter;
            } else if (parseInt(this.options.filter) && key === 'id') {
              searchData[key] = this.options.filter;
            } else if (column.format !== 'date' && key !== 'id' && column.format !== 'yesno') {
              searchData[key] = this.options.filter;
            }
          }
        }
        clearTimeout(this.searchValue);
        const timer = this.options.searchTimeout || 1200;
        this.searchValue = setTimeout(() => {
          this.searchFilter.emit(searchData);
        }, timer);
      }
    } catch (error) {
      console.error('Error in searchEvent:', error);
    }
  }

  clearFilter(): void {
    try {
      this.options.filter = null;
      this.options.resetFilter?.emit();
    } catch (error) {
      console.error('Error in clearFilter:', error);
    }
  }

  selectAll(): void {
    try {
      this.selectedCount = 0;

      if (this.options.multiSelect !== undefined) {
        this.options.multiSelect = this.selectAllRecords;
      }

      for (const item of this.options.filteredData) {
        item.selected = this.selectAllRecords;
        if (item.selected) this.selectedCount++;
      }
    } catch (error) {
      console.error('Error in selectAll:', error);
    }
  }

  selectRecord(event: Event, index: number): void {
    try {
      this.selected = false;
      this.selectedCount = 0;

      for (const item of this.options.filteredData) {
        if (item.selected) {
          this.selected = true;
          this.selectedCount++;
        }
      }
    } catch (error) {
      console.error('Error in selectRecord:', error);
    }
  }

  sort(): void {
    try {
      for (const [key, direction] of Object.entries(this.sortColumns) as [any, any][]) {
        if (direction !== 0) {
          this.options.filteredData.sort((a: any, b: any) => {
            const column = this.options.columns[key];
            const aValue = a[key];
            const bValue = b[key];

            if (column.format === 'date') {
              return direction * (new Date(aValue).getTime() - new Date(bValue).getTime());
            } else if (column.format === 'number') {
              return direction * (Number(aValue) - Number(bValue));
            } else {
              return direction * String(aValue).localeCompare(String(bValue));
            }
          });
        }
      }
    } catch (error) {
      console.error('Error in sort:', error);
    }
  }

  sortClicked(field: string): void {
    try {
      if (!this.options.serverMode) {
        for (const key of Object.keys(this.options.columns)) {
          this.sortColumns[key] = key === field ?
            (this.sortColumns[key] === 1 ? -1 : 1) : 0;
        }

        this.filterData(this.searchBar?.value);
        this.sort();
        this.setPageInfo(1);
      } else {
        this.options.loading = true;
        this.sortType = this.sortType === 'asc' ? 'desc' : 'asc';
        this.sortColumns = { field, type: this.sortType };

        clearTimeout(this.searchValue);
        this.searchValue = setTimeout(() => {
          this.sortChange.emit(this.sortColumns);
        }, 900);
      }
    } catch (error) {
      console.error('Error in sortClicked:', error);
    }
  }

  allAction(action: any): void {
    try {
      action.action();
    } catch (error) {
      console.error('Error in allAction:', error);
    }
  }

  selectedAction(action: any): void {
    try {
      const selectedItems = this.options.filteredData.filter((item: any) => item.selected);
      action.action(selectedItems);
      this.selectAllRecords = false;
      this.selectAll();
    } catch (error) {
      console.error('Error in selectedAction:', error);
    }
  }

  setDynamicButtonTitle(action: any, item: any): string {
    try {
      return typeof action.title === "function" ?
        action.title(item, action) :
        action.title || '';
    } catch (error) {
      console.error('Error in setDynamicButtonTitle:', error);
      return '';
    }
  }

  getValue(value: any, format: string, column: any, item: any): any {
    try {
      switch (format) {
        case 'date':
          if (!value) return '';
          return moment(value).format(column.formatString || "DD/MM/YYYY HH:mm");

        case 'currency':
          if (value === null) return '';
          return new Number(value).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: false,
            style: 'currency',
            currency: 'GBP'
          });

        case 'count':
          if (value === null) return '';
          return Array.isArray(value) ? value.length : 0;

        case 'yesno':
          return [0, '0', false, 'false', null, undefined].includes(value) ? 'No' : 'Yes';

        case 'number':
          if (value === null) return '';
          return Number(value).valueOf();

        case 'function':
          return column.fn ? column.fn(value, column, item) : value;

        default:
          return value;
      }
    } catch (error) {
      console.error('Error in getValue:', error);
      return value;
    }
  }

  getColor(color: any, item: any, action: any): string {
    try {
      if (typeof color === "function") {
        const data = color(item);
        action.title = data.title;
        return data.color;
      }
      return color || 'primary';
    } catch (error) {
      console.error('Error in getColor:', error);
      return 'primary';
    }
  }

  rowAction(action: any, item: any): void {
    try {
      action.action(item);
    } catch (error) {
      console.error('Error in rowAction:', error);
    }
  }

  btnRowAction(action: any, item: any): void {
    try {
      action.action(item);
    } catch (error) {
      console.error('Error in btnRowAction:', error);
    }
  }

  private getCustomerHeadersAndData(): { customHeader: string[], customData: any[] } {
    try {
      const customHeader: string[] = [];
      const customData: any[] = [];
      const keys = Object.keys(this.options.columns);

      for (const key of keys) {
        customHeader.push(this.options.columns[key].title);
      }

      for (const item of this.options.filteredData) {
        const json: Record<string, any> = {};
        for (const key of keys) {
          json[key] = item[key];
        }
        customData.push(json);
      }

      return { customHeader, customData };
    } catch (error) {
      console.error('Error in getCustomerHeadersAndData:', error);
      return { customHeader: [], customData: [] };
    }
  }

  async downloadCsv(data: any = null): Promise<void> {
    try {
      if (this.options.serverMode && this.options.serverDownload && !data) {
        const colarray = Object.keys(this.options.columns)
          .filter(key => this.options.columns[key].fileformatfn)
          .map(key => ({
            colname: key,
            fileformatfn: this.options.columns[key].fileformatfn.replace(/\+/g, " plussign ")
          }));

        if (!this.downloadLoader.csv) {
          this.download.emit({ type: "csv", formatfn: colarray });
        }
      } else {
        let csvContent = "";
        const { customHeader, customData } = await this.getCustomerHeadersAndData();
        const filterdata = data || customData;

        if (filterdata.length > 0) {
          csvContent += customHeader.join(',') + "\r";
          const keys = Object.keys(filterdata[0]);

          for (const item of filterdata) {
            const row = keys.map(key =>
              item[key] !== undefined ? `"${item[key]}"` : '""'
            ).join(',');
            csvContent += row + "\r";
          }

          this.triggerDownload(csvContent, 'text/csv', this.getCsvFileName());
        }
      }
    } catch (error) {
      console.error('Error in downloadCsv:', error);
    }
  }

  downloadJson(data: any = null): void {
    try {
      if (this.options.serverMode && this.options.serverDownload && !data) {
        const colarray = Object.keys(this.options.columns)
          .filter(key => this.options.columns[key].fileformatfn)
          .map(key => ({
            colname: key,
            fileformatfn: this.options.columns[key].fileformatfn.replace(/\+/g, " plussign ")
          }));

        if (!this.downloadLoader.json) {
          this.download.emit({ type: "json", formatfn: colarray });
        }
      } else {
        const jsonContent = JSON.stringify(data || this.options.filteredData);
        this.triggerDownload(jsonContent, 'application/json', this.getJsonFileName());
      }
    } catch (error) {
      console.error('Error in downloadJson:', error);
    }
  }

  private triggerDownload(content: string, mimeType: string, fileName: string): void {
    try {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error in triggerDownload:', error);
    }
  }

  private getCsvFileName(): string {
    try {
      return `export-${new Date().getTime()}.csv`;
    } catch (error) {
      console.error('Error in getCsvFileName:', error);
      return 'export.csv';
    }
  }

  private getJsonFileName(): string {
    try {
      return `export-${new Date().getTime()}.json`;
    } catch (error) {
      console.error('Error in getJsonFileName:', error);
      return 'export.json';
    }
  }

  getRowClasses(item: any): { [key: string]: boolean } {
    try {
      return {
        'blocked-row': item.status === 'BLOCKED',
        [this.getRowClass(item)]: true
      };
    } catch (error) {
      console.error('Error in getRowClasses:', error);
      return { 'table-row': true };
    }
  }

  getColumnFlex(key: string): string {
    try {
      return this.options.columns[key]?.flex || '1';
    } catch (error) {
      console.error('Error in getColumnFlex:', error);
      return '1';
    }
  }

  filterGroupColumn(keys: string[], item: any): string[] {
    try {
      if (item.groupColumndata) {
        return [];
      }
      return keys;
    } catch (error) {
      console.error('Error in filterGroupColumn:', error);
      return keys;
    }
  }
  onNextPage(): void {
    try {
      if (this.paginationInfo.page < this.paginationInfo.pageCount) {
        this.changePage(this.paginationInfo.page + 1);
      }
    } catch (error) {
      console.error('Error in onNextPage:', error);
    }
  }

  onPreviousPage(): void {
    try {
      if (this.paginationInfo.page > 1) {
        this.changePage(this.paginationInfo.page - 1);
      }
    } catch (error) {
      console.error('Error in onPreviousPage:', error);
    }
  }

  onFirstPage(): void {
    try {
      this.changePage(1);
    } catch (error) {
      console.error('Error in onFirstPage:', error);
    }
  }

  onLastPage(): void {
    try {
      this.changePage(this.paginationInfo.pageCount);
    } catch (error) {
      console.error('Error in onLastPage:', error);
    }
  }
  getColumnClass(key: any): any {
    const column = this.options.columns[key];
    if (column?.col) {
      return column.col;
    }
    else { return 'col-auto'; }
  }
}
