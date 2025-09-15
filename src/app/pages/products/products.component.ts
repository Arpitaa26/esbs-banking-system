import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SegmentComponent } from '../../components/segment/segment.component';
import { TableComponent } from '../../components/table/table.component';
import { Router } from '@angular/router';
import { ApiGateWayService } from 'app/services/apiGateway.service';
import * as globals from '../../globals';
import { AddSubProductModal } from './add-sub-product-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalProviderService } from 'app/services/global-provider.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [SegmentComponent, CommonModule, FormsModule, TableComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  parentProductId: any;
  segbuttonConfig1 = [
    { name: 'Active', functionName: 'active_product' },
    { name: 'Drafted', functionName: 'drafted_product' },
    { name: 'Archive', functionName: 'archive_product' }
  ];

  currentTab = 'active_product';
  productOptions: any = {
    data: [],
    filteredData: [],
    totalCount: null,
    serverMode: false,
    serverDownload: true,
    columns: {
      title: {
        title: "Title",
        search: true,
        mobile: true,
        format: "function",
        // fn: this.bindTitle.bind(this),
      },
      sub_title: {
        title: "Sub Title",
        mobile: true,
        format: "function",
        search: true,
        fn: this.commonFunction.bind(this),
      },
      parentname: {
        title: "Group Product",
        mobile: true,
        format: "function",
        fn: this.commonFunction.bind(this),
      },
      ismatured_product: {
        title: "Maturity Product",
        mobile: true,
        format: "function",
        // fn: this.commonFunctionNull.bind(this),
      }
      // "isactive": { title: "Active", mobile: true },
    },
    pagination: true,
    fitler: null,
    search: true,
    select: true,
    selectedActions: [
      {
        title: "Delete",
        action: this.deleteSelectedProduct.bind(this),
        color: "red",
      },
      {
        title: "Archive",
        action: this.ArchiveProducts.bind(this),
        color: "#CD5C5C",
      },
    ],
    rowActions: [],
    download: true,
    btnSize: "small",
    pageSize: 50,
    rowClass: "table-row",
    columnClass: "table-column",
    add: {
      addActionTitle: "Add Product",
      addAction: this.addChildProduct.bind(this),
    },
    button1: {
      buttonTitle: "Add Group Product",
      buttonAction: this.addParentProduct.bind(this),
    },
    tapRow: this.updateProduct.bind(this),
    // resetFilter: null,
    uploadOptions: {},
    serverParams: {
      pageDetail: {
        page: 1,
        pageSize: 50,
        rowCount: 0,
        pageCount: 1,
      },
      sortDetail: {
        field: "products.products_id",
        type: "desc",
      },
      listDetail: {
        type: "active"
      },
      where: {},
    },
  };
  productDraftOptions: any = {
    data: [],
    filteredData: [],
    totalCount: null,
    serverMode: false,
    serverDownload: true,
    columns: {
      title: {
        title: "Title",
        search: true,
        mobile: true,
        format: "function",
        // fn: this.bindTitle.bind(this),
      },
      sub_title: {
        title: "Sub Title",
        mobile: true,
        format: "function",
        fn: this.commonFunction.bind(this),
      },
      parentname: {
        title: "Group Product",
        mobile: true,
        format: "function",
        fn: this.commonFunction.bind(this),
      },
      ismatured_product: {
        title: "Maturity Product",
        mobile: true,
        format: "function",
        // fn: this.commonFunctionNull.bind(this),
      },
      status: {
        title: "Status",
        mobile: true,
        format: "function",
        // fn: this.DraftedcommonFunction.bind(this),
      },
      // "isactive": { title: "Active", mobile: true },
    },
    pagination: true,
    fitler: null,
    search: true,
    select: true,
    selectedActions: [
      {
        title: "Delete",
        action: this.deleteSelectedProduct.bind(this),
        color: "red"
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
      addAction: this.addChildProduct.bind(this),
    },
    button1: {
      buttonTitle: "Add Group Product",
      buttonAction: this.addParentProduct.bind(this),
    },
    tapRow: this.updateProduct.bind(this),
    // resetFilter: null,
    uploadOptions: {},
    serverParams: {
      pageDetail: {
        page: 1,
        pageSize: 50,
        rowCount: 0,
        pageCount: 1,
      },
      sortDetail: {
        field: "products.products_id",
        type: "desc",
      },
      listDetail: {
        type: "drafted"
      },
      where: {},
    },
  };
  productArchiveOptions: any = {
    data: [],
    filteredData: [],
    totalCount: null,
    serverMode: false,
    // serverDownload: true,
    columns: {
      title: {
        title: "Title",
        search: true,
        mobile: true,
        format: "function",
        // fn: this.bindTitle.bind(this),
      },
      sub_title: {
        title: "Sub Title",
        mobile: true,
        format: "function",
        fn: this.commonFunction.bind(this),
      },
      parentname: {
        title: "Group Product",
        mobile: true,
        format: "function",
        fn: this.commonFunction.bind(this),
      },
      ismatured_product: {
        title: "Maturity Product",
        mobile: true,
        format: "function",
        // fn: this.commonFunctionNull.bind(this),
      },
      status: {
        title: "Status",
        mobile: true,
        format: "function",
        fn: this.commonFunction.bind(this),
      }
      // "description": { title: "Description", mobile: true, col: 3, format: 'function', fn: this.commonFunction.bind(this) },
    },
    pagination: true,
    fitler: null,
    search: true,
    select: true,
    selectedActions: [
      {
        title: "Activate",
        action: this.activate.bind(this),
        color: "green",
      },
    ],
    rowActions: [],
    download: true,
    btnSize: "small",
    pageSize: 50,
    rowClass: "table-row",
    columnClass: "table-column",
    add: {
      addActionTitle: "Add Product",
      addAction: this.addChildProduct.bind(this),
    },
    button1: {
      buttonTitle: "Add Group Product",
      buttonAction: this.addParentProduct.bind(this),
    },
    tapRow: this.updateProduct.bind(this),
    serverParams: {
      "pageDetail": {
        page: 1,
        pageSize: 50,
        rowCount: 0,
        pageCount: 1,
      },
      sortDetail: {
        field: "products.products_id",
        type: "desc",
      },
      listDetail: {
        type: "archive"
      },
      where: {},
    },
    uploadOptions: {},
  };


  constructor(
    private router: Router,
    public apiGatewayService: ApiGateWayService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private gps: GlobalProviderService
  ) {
    const state = this.router.getCurrentNavigation()?.extras?.state;

    if (state?.['tab']) {
      this.currentTab = state['tab'];
    }

    this.productDraftOptions.rowActions.push({ title: this.buttonTitle.bind(this), action: this.addSubProducts.bind(this), color: 'linear-gradient(135deg, #041643, #3E5ADF);' })
    this.productOptions.rowActions.push({ title: this.buttonTitle.bind(this), action: this.addSubProducts.bind(this), color: 'linear-gradient(135deg, #041643, #3E5ADF);' })
    this.productDraftOptions.rowClass = this.disableRow.bind(this);
    this.fetchProducts('active_product');
  }

  buttonTitle(item: any) {
    try {
      if ((item.isactive && item.is_parent === 1 && (['Authoriser_Approved']).indexOf(item.status) >= 0 && item.disabled !== undefined) || (item.isdrafted && item.is_parent === 1 && (['Drafted', 'Compliance_Rejected', 'Authoriser_Rejected'].indexOf(item.status) >= 0) && item.updateto === null && item.disabled !== undefined)) {
        return 'Configure sub products'
      } else {
        return
      }
    } catch (error) {
      console.log(error);
      return;
    }
  }

  disableRow(item: any,) {
    try {
      if (item.disabled === undefined) {
        return 'disabled-row'
      } else {
        return 'table-row'
      }
    } catch (error) {
      console.log(error);
      return 'table-row';
    }
  }

  async addSubProducts(product: any) {
    try {
      const modalRef = this.modalService.open(AddSubProductModal);
      modalRef.componentInstance.parentProductId = product.products_id;
      modalRef.componentInstance.parentProductDetails = product;
      const result = await modalRef.result;
      if (result?.action === 'add') {
        this.addSubProduct(product);
      } else if (result?.action === 'create_new') {
        this.createNewSubProduct(result.parentProduct);
      } else if (result?.configuredProducts) {
        this.assignAsSubProducts(result.configuredProducts, result.parentId);
      }
      this.refreshProductList();
    } catch (error) {
      console.log('Modal dismissed', error);
    }
  }

  createNewSubProduct(parentProduct: any) {
    this.router.navigate(['/product'], {
      state: {
        productData: {
          is_parent: false,
          is_new: true,
          parentid: parentProduct.products_id
        },
        actionType: 2,
        parentProduct: parentProduct
      },
    });
  }

  assignAsSubProducts(products: any[], parentId: number) {
    let subProductIds = products.map(product => product.products_id).join(',');
    this.apiGatewayService.post(globals.updateSubProducts, {
      parentProductId: parentId,
      subProducts: subProductIds
    }).subscribe({
      next: (res) => {
        this.fetchProducts(this.currentTab as 'active_product' | 'drafted_product' | 'archive_product');
      },
      error: (err) => {
        console.error('Error assigning sub prodcts:', err);
      }
    });
  }

  private refreshProductList() {
    switch (this.currentTab) {
      case "activeProducts":
        // this.getProducts();
        break;
      case "draftProducts":
        // this.getDraftedProducts();
        break;
      default:
    }
  }

  commonFunction(value: any): string {
    return value == 0 || value == null || value == undefined ? '--' : value;
  }

  seghandleClick(tab: string) {
    this.currentTab = tab;
    this.fetchProducts(tab as 'active_product' | 'drafted_product' | 'archive_product');
    console.log(`${tab} button clicked`);
  }

  updateProduct(data: any) {
    this.router.navigate(['/product'], { state: { productData: data, updateProduct: true, tab: this.currentTab } });
  }

  addParentProduct() {
    this.router.navigate(['/product'], {
      state: { productData: { is_parent: true, is_new: true }, actionType: 1, tab: this.currentTab },
    });
  }

  addChildProduct() {
    this.router.navigate(['/product'], {
      state: { productData: { is_parent: false, is_new: true }, actionType: 2, tab: this.currentTab },
    });
  }
  addSubProduct(parentProduct: any) {
    this.router.navigate(['/product'], {
      state: { productData: { is_parent: true, is_new: true }, actionType: 2, parentProduct: parentProduct },
    });
  }

  private fetchProducts(tab: 'active_product' | 'drafted_product' | 'archive_product') {
    let optionsKey: keyof ProductsComponent;
    switch (tab) {
      case 'active_product':
        optionsKey = 'productOptions';
        break;
      case 'drafted_product':
        optionsKey = 'productDraftOptions';
        break;
      case 'archive_product':
        optionsKey = 'productArchiveOptions';
        break;
    }

    const options = this[optionsKey];
    const apiUrl = globals.getProductApi(options.serverParams);

    this.apiGatewayService.get(apiUrl).subscribe({
      next: (res) => {
        options.data = res.data;
        this[optionsKey] = { ...options };
        this.cdr.detectChanges();
        console.log(`${tab} loaded`, res);
      },
      error: (err) => {
        console.error(`${tab} load failed:`, err);
      }
    });
  }
  deleteSelectedProduct(data: any) {
    try {
      const product_Ids = data.map((item: any) => item.products_id).join(',');
      this.apiGatewayService.post(globals.deleteProductApi, { products_id: product_Ids }).subscribe({
        next: () => {
          this.fetchProducts(this.currentTab as 'active_product' | 'drafted_product' | 'archive_product');
        },
        error: (err) => console.error('Error deleting FAQ category:', err),
      });
    } catch (error) {
      console.error('Exception in deletefaqCategory:', error);
    }
  }
  activate(data: any) {
    try {
      const productIds = data.map((item: any) => item.products_id).join(',');
      this.apiGatewayService.post(globals.updateProductStatus, { products_id: productIds, isactive: 1, users_id: this.gps.usersID }).subscribe({
        next: () => {
          this.fetchProducts(this.currentTab as 'active_product' | 'drafted_product' | 'archive_product');
        },
        error: (err) => console.error('Error activating products:', err),
      });
    } catch (error) {
      console.error('Exception in activate:', error);
    }
  }
  ArchiveProducts(data: any) {
    try {
      const productIds = data.map((item: any) => item.products_id).join(',');
      this.apiGatewayService.post(globals.updateProductStatus, { products_id: productIds, isactive: 0, users_id: this.gps.usersID }).subscribe({
        next: () => {
          this.fetchProducts(this.currentTab as 'active_product' | 'drafted_product' | 'archive_product');
        },
        error: (err) => console.error('Error archiving products:', err),
      });
    } catch (error) {
      console.error('Exception in ArchiveProducts:', error);
    }
  }
  onPageChange(params: any, tableIndex: number) {
    this.updateParams({ pageDetail: params }, tableIndex);

    switch (tableIndex) {
      case 1:
        this.fetchProducts('active_product');
        break;
      case 2:
        this.fetchProducts('drafted_product');
        break;
      case 3:
        this.fetchProducts('archive_product');
        break;
    }
  }

  onSortChange(params: any, tableIndex: number) {
    this.updateParams({ sortDetail: params }, tableIndex);

    switch (tableIndex) {
      case 1:
        this.fetchProducts('active_product');
        break;
      case 2:
        this.fetchProducts('drafted_product');
        break;
      case 3:
        this.fetchProducts('archive_product');
        break;
    }
  }

  onSearchFilter(params: any, tableIndex: number) {
    this.updateParams({ searchDetail: params }, tableIndex);

    switch (tableIndex) {
      case 1:
        this.fetchProducts('active_product');
        break;
      case 2:
        this.fetchProducts('drafted_product');
        break;
      case 3:
        this.fetchProducts('archive_product');
        break;
    }
  }

  updateParams(newProps: any, tableIndex: number) {
    switch (tableIndex) {
      case 1:
        this.productOptions.serverParams = Object.assign({}, this.productOptions.serverParams, newProps);
        break;
      case 2:
        this.productDraftOptions.serverParams = Object.assign({}, this.productDraftOptions.serverParams, newProps);
        break;
      case 3:
        this.productArchiveOptions.serverParams = Object.assign({}, this.productArchiveOptions.serverParams, newProps);
        break;
    }
  }

}

