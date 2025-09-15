import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SegmentComponent } from 'app/components/segment/segment.component';
import { TableComponent } from 'app/components/table/table.component';
import { ApiGateWayService } from 'app/services/apiGateway.service';
import { GlobalProviderService } from 'app/services/global-provider.service';
import moment from 'moment';
import * as globals from '../../../globals';
import Quill from 'quill';
import { Subscription } from 'rxjs';
interface QuillEditors {
  product?: Quill;
  isaProduct?: Quill;
  isaDeclaration?: Quill;
}

interface MaturityType {
  type: boolean;
  name: string;
  value: string;
  products: any[];
}

interface MaturityTypes {
  new_products: MaturityType;
  part_withdrawal: MaturityType;
  close_account: MaturityType;
  automatic_rollover: MaturityType;
}

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableComponent,
    SegmentComponent
  ]
})
export class ProductComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly DEFAULT_PRODUCT_DESCRIPTION = '<p>Product description goes here</p>';
  private readonly DEFAULT_PRODUCT_TITLE = 'New Product';
  private readonly DEFAULT_PRODUCT_SUBTITLE = 'Product Subtitle';
  private readonly DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';

  title = 'Create New Product';
  new = true;
  isAddProduct = true;
  isAddChild = false;
  isAddParent = false;
  isarchived = false;
  dirtyFlag = false;
  isAllowedtoEdit = true;
  canSelectAccount = true;
  canSelectParent = true;
  isActive = false;
  isActives = false;
  is_sopra = false;
  isParentProductOfOthers = false;
  allowTargetCustomer = false;
  filenames: string | null = null;
  fromdate: string = moment().format(this.DEFAULT_DATE_FORMAT);
  todate: string = moment().format(this.DEFAULT_DATE_FORMAT);
  existing_attachments: any[] = [];
  productType: string[] = [];
  existing_greater_yes = false;
  existing_greater_no = false;
  existing_lower_yes = false;
  existing_lower_no = false;
  passbook_allowed_yes = false;
  passbook_allowed_no = false;
  product: any = {};
  parentProduct: any = [];
  productTypes_2: any = [];
  productTypOptn: string[] = [];
  allActiveProducts: any[] = [];
  error: any = {};
  statusData: string | null = null;
  deviceType = 'ios';
  previewHtml: SafeHtml = '';
  isupdate = false;
  selectedOptions: string[] = [];
  customerCount = 0;

  isProductTitleChanged = false;
  isProductSubTitleChanged = false;
  curTab: string = '';

  productAuditTrails = {
    data: [] as any[],
    filteredData: [] as any[],
    columns: {
      trail_date: {
        title: "Date",
        format: "date",
        formatString: "DD/MM/YYYY HH:mm",
        col: 5,
      },
      trail_details: { title: "Trail Details", search: true },
    },
    pagination: true,
    search: false,
    select: false,
    download: true,
    pageSize: 50,
    rowClass: "table-row",
    add: {
      addActionTitle: "",
      addAction: null,
    },
    rowActions: [] as any[],
    columnClass: "table-column",
    tapRow: null,
    resetFilter: null,
    uploadOptions: {},
  };

  maturityTypes: MaturityTypes = {
    new_products: {
      type: false,
      name: "transfer",
      value: "",
      products: []
    },
    part_withdrawal: {
      type: false,
      name: "part",
      value: "",
      products: []
    },
    close_account: {
      type: false,
      name: "close",
      value: "",
      products: []
    },
    automatic_rollover: {
      type: false,
      name: "rollover",
      value: "",
      products: []
    }
  };

  segbuttonConfig = [
    { name: 'iOS', functionName: 'ios' },
    { name: 'Android', functionName: 'android' }
  ];

  private quillEditors: QuillEditors = {};
  private subscriptions: Subscription[] = [];
  selected_product_sopra: any;

  constructor(
    private domSanitizer: DomSanitizer,
    private router: Router,
    public gps: GlobalProviderService,
    public apiGatewayService: ApiGateWayService
  ) {

    this.curTab = this.router.getCurrentNavigation()?.extras?.state?.['tab'];

    this.initializeFromNavigation();
    this.getMainProduct();
    this.getProductType();
    this.getParentProduct();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    Object.values(this.quillEditors).forEach(editor => {
      if (editor) {
        editor.off('text-change');
      }
    });
  }

  private createDefaultProduct(): any {
    return {
      id: new Date().getTime().toString(),
      title: this.DEFAULT_PRODUCT_TITLE,
      accountTypeIdentifier: "",
      interestrate: null,
      sub_title: this.DEFAULT_PRODUCT_SUBTITLE,
      description: this.DEFAULT_PRODUCT_DESCRIPTION,
      bannerurl: null,
      imagepath: null,
      productbutton: [],
      start_date: moment().format(this.DEFAULT_DATE_FORMAT),
      end_date: moment().format(this.DEFAULT_DATE_FORMAT),
      target: 0,
      total: this.customerCount,
      account_types_id: 1,
      accountname: "",
      parentid: null,
      ismatured_product: false,
      maturity_options: null,
      maturityTypes: { ...this.maturityTypes },
      isAlert: false,
      alertValue: null,
      alertMessage: null,
      isRestrict: false,
      restrictValue: null,
      restrictMessage: null,
      product_visiblity: "all",
      customers_ids: "",
      sopra_product_code: "",
      bespoke: [],
      min_age: null,
      is_parent: this.isAddParent ? 1 : 0,
      max_age: null,
      min_credit: null,
      max_credit: null,
      is_joint: null,
      is_isa: null,
      isa_tandc: null,
      isa_declaration: null,
      types: [],
      payment_type: "",
      max_account_holders: null,
      society_end_date: null,
      existing_ba_address: null,
      existing_greater_twelve: null,
      existing_lower_twelve: null,
      deposit_frequency: null,
      min_monthly_deposit: null,
      max_monthly_deposit: null,
      passbook_allowed: null,
      numberofaccountsacustomercanhold: null,
      attachments: null,
      existing_attachments: "",
      pt_code: null,
      pt_id: null,
      pt_title: null,
      user_id: this.gps.usersID,
      isactive: 1,
      isdrafted: 1,
      saveValue: 0,
      lastedit: this.gps.usersID,
      user_roles_id: this.gps.usersRoleID,
      status: "Drafted",
      mode: 0
    };
  }

  private initializeFromNavigation(): void {
    const navState = this.router.getCurrentNavigation()?.extras?.state;
    const data = navState?.['productData'];
    const parentProduct = navState?.['parentProduct'];

    if (!data) {
      this.initializeNewProduct(navState);
    } else {
      if (data.is_new) {
        this.initializeNewProduct(navState);
        this.isAddParent = !!data.is_parent;
        this.isAddChild = !data.is_parent;
        this.product = this.createDefaultProduct();
        if (parentProduct && data.parentid) {
          this.product.parentid = data.parentid;
          this.product.parentname = parentProduct.title;
        }
        this.dirtyFlag = true;
      } else {
        this.initializeExistingProduct(data, navState);
        this.dirtyFlag = false;
      }
    }
  }

  private initializeNewProduct(navState: any): void {
    const isParent = navState?.['actionType'] === 1;
    this.title = isParent ? "Create Group Product" : "Create New Product";
    this.product = this.createDefaultProduct();
  }

  private initializeExistingProduct(data: any, navState: any): void {
    this.new = false;
    const isParent = navState?.['actionType'] === 1;
    this.title = isParent ? "Update Group Product" : "Update Product";

    this.product = { ...data };
    this.statusData = data.status || null;
    this.isAddParent = this.product.is_parent ? true : false;
    this.isAddChild = !this.product.is_parent ? true : false;
    this.isupdate = true;

    this.initializeProductData();
  }

  private initializeProductData(): void {
    this.product.accountTypeIdentifier = this.product.sopra_product_code || "";
    this.isarchived = (this.product.isdrafted === 0 && this.product.isactive === 0);

    this.fromdate = moment(this.product.start_date).format(this.DEFAULT_DATE_FORMAT) || this.fromdate;
    this.todate = moment(this.product.end_date).format(this.DEFAULT_DATE_FORMAT) || this.todate;

    this.initializeMaturityTypes();
    this.initializeCheckboxStates();
    this.initializeProductType();

    if (!this.product.bannerurl) {
      this.product.imagepath = null;
      this.product.bannerurl = null;
    }

    this.allowTargetCustomer = this.gps.usersRoleProductEdit === 1 &&
      this.isAddChild &&
      ((!this.new && (this.statusData === 'Compliance_Rejected' || this.statusData === 'Authoriser_Rejected')) ||
        (!this.new && this.statusData === 'Authoriser_Approved' && this.product.isactive === 1));
  }

  private initializeMaturityTypes(): void {
    this.product.maturityTypes = { ...this.maturityTypes };

    if (typeof this.product.maturity_options === 'string' && this.product.maturity_options) {
      const maturityOptionsArr = this.product.maturity_options.split("\n");

      maturityOptionsArr.forEach((option: string) => {
        const maturityData = option.split("|");
        const type = maturityData[1]?.trim();
        const value = maturityData[0];

        switch (type) {
          case "transfer":
            this.product.maturityTypes.new_products.type = true;
            this.product.maturityTypes.new_products.value = value;
            this.product.maturityTypes.new_products.products = maturityData[2]?.split(',') || [];
            break;
          case "part":
            this.product.maturityTypes.part_withdrawal.type = true;
            this.product.maturityTypes.part_withdrawal.value = value;
            this.product.maturityTypes.part_withdrawal.products = maturityData[2]?.split(',') || [];
            break;
          case "close":
            this.product.maturityTypes.close_account.type = true;
            this.product.maturityTypes.close_account.value = value;
            break;
          case "rollover":
            this.product.maturityTypes.automatic_rollover.type = true;
            this.product.maturityTypes.automatic_rollover.value = value;
            break;
        }
      });
    }
  }

  private initializeCheckboxStates(): void {
    this.existing_greater_yes = this.product.existing_greater_twelve === true;
    this.existing_greater_no = !this.existing_greater_yes;

    this.existing_lower_yes = this.product.existing_lower_twelve === true;
    this.existing_lower_no = !this.existing_lower_yes;

    this.passbook_allowed_yes = this.product.passbook_allowed === true;
    this.passbook_allowed_no = !this.passbook_allowed_yes;
  }

  private initializeProductType(): void {
    this.productType = this.product.types || [];
    if (this.productType.length) {
      this.onProductTypeSelect();
    }
    this.product.parentid = this.product.parentid || null;
  }

  ngOnInit(): void {
    this.updatePreview();
    this.initializeProduct();
  }

  ngAfterViewInit(): void {
    this.initializeEditors();
  }


  private initializeEditors(): void {
    if (this.isAddProduct || this.isAddChild) {
      this.initializeProductEditor();

      if (this.product.is_isa) {
        this.initializeIsaEditors();
      }
    }
  }

  private initializeProductEditor(): void {
    const toolbarOptions = [
      ['bold', 'italic', 'underline'],
      [{ 'header': [1, 2, 3, false] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ];

    const productEditor = new Quill('#productEditor', {
      theme: 'snow',
      modules: { toolbar: toolbarOptions }
    });

    productEditor.on('text-change', () => {
      this.product.description = productEditor.root.innerHTML;
      this.dirty();
    });

    productEditor.root.innerHTML = this.product.description || '';
    this.quillEditors.product = productEditor;
    const productEditor2 = new Quill('#productEditor2', {
      theme: 'snow',
      modules: { toolbar: toolbarOptions }
    });

    productEditor2.on('text-change', () => {
      this.product.product_summary = productEditor2.root.innerHTML;
      this.dirty();
    });

    productEditor2.root.innerHTML = this.product.product_summary || '';
    this.quillEditors.product = productEditor;
    const productEditor3 = new Quill('#productEditor3', {
      theme: 'snow',
      modules: { toolbar: toolbarOptions }
    });

    productEditor3.on('text-change', () => {
      this.product.product_tandc = productEditor3.root.innerHTML;
      this.dirty();
    });

    productEditor3.root.innerHTML = this.product.product_tandc || '';
    this.quillEditors.product = productEditor3;
  }


  private initializeIsaEditors(): void {
    const toolbarOptions = [
      ['bold', 'italic', 'underline'],
      [{ 'header': [1, 2, 3, false] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ];

    const isaProductEditor = new Quill('#isaproductEditor', {
      theme: 'snow',
      modules: { toolbar: toolbarOptions }
    });

    const isaDeclarationEditor = new Quill('#isaDeclarationEditor', {
      theme: 'snow',
      modules: { toolbar: toolbarOptions }
    });

    isaProductEditor.on('text-change', () => {
      this.product.isa_tandc = isaProductEditor.root.innerHTML;
      this.dirty();
    });

    isaDeclarationEditor.on('text-change', () => {
      this.product.isa_declaration = isaDeclarationEditor.root.innerHTML;
      this.dirty();
    });

    if (this.product.isa_tandc) {
      isaProductEditor.root.innerHTML = this.product.isa_tandc;
    }
    if (this.product.isa_declaration) {
      isaDeclarationEditor.root.innerHTML = this.product.isa_declaration;
    }

    this.quillEditors.isaProduct = isaProductEditor;
    this.quillEditors.isaDeclaration = isaDeclarationEditor;
  }

  seghandleClick(functionName: string): void {
    this.deviceType = functionName;
    this.updatePreview();
  }

  onCheckboxChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    this.selectedOptions = target.checked
      ? [...this.selectedOptions, value]
      : this.selectedOptions.filter(opt => opt !== value);

    this.productType = [...this.selectedOptions];
    this.product.types = this.productType;
    this.dirty();
  }

  onProductTypeSelect(): void {
    this.product.is_isa = this.productType.includes("ISA Products");
    this.product.is_junior = this.productType.includes("Junior Products");
  }

  initializeProduct(): void {
    if (this.new) {
      this.product = {
        ...this.product,
        title: this.DEFAULT_PRODUCT_TITLE,
        sub_title: this.DEFAULT_PRODUCT_SUBTITLE,
        description: this.DEFAULT_PRODUCT_DESCRIPTION,
        productbutton: []
      };
    } else if (!this.product.title) {
      this.product = {
        ...this.product,
        title: '',
        sub_title: '',
        description: '',
        productbutton: []
      };
    }
  }

  onAccSelect(): void {
    console.log('Account selected:', this.product.accountTypeIdentifier);
    if (this.product.parentid !== 'selected') {
      const parent = this.parentProduct.find((p: any) => p.products_id == this.product.parentid);
      if (parent) {
        // this.product.accountTypeIdentifier = parent.sopra_product_code;
        this.product.parentname = parent.title;
        // this.canSelectAccount = false;
      }
    } else {
      this.canSelectAccount = true;
      // this.product.accountTypeIdentifier = "selected";
      this.product.parentname = null;
    }
    this.dirty();
  }
  onAccSelect1(): void {
    console.log('Account selected:', this.product.accountTypeIdentifier);
    this.dirty();
  }

  save(mode: number): void {
    this.dirtyFlag = false;
    console.log('Saving product with mode:', mode, this.product);
    if (this.product.title.trim() === '' || this.product.title === this.DEFAULT_PRODUCT_TITLE) {
      this.isProductTitleChanged = true;
      return;
    }
    // sub_title: this.DEFAULT_PRODUCT_SUBTITLE
    if (this.product.sub_title.trim() === '' || this.product.sub_title === this.DEFAULT_PRODUCT_SUBTITLE) {
      this.isProductSubTitleChanged = true;
      return;
    }
    if (mode === 0) { this.AddProduct(); }
    if (mode === 1) {
      this.product.isactive = 1;
      this.product.isdrafted = 1;
      this.product.lastedit = this.gps.usersID;
      this.product.user_id = this.gps.usersID;
      this.product.user_roles_id = this.gps.usersRoleID;
      this.product.status = "Authoriser_Approved";
      this.product.mode = 1;
      this.product.selected = true;
      this.product.saveValue = 1;
      this.Update_Product();
    }
    if (mode === 2) {
      this.product.isdrafted = 0;
      this.product.lastedit = this.gps.usersID;
      this.product.user_id = this.gps.usersID;
      this.product.user_roles_id = this.gps.usersRoleID;
      this.product.status = "Authoriser_Rejected";
      this.product.mode = 0;
      this.product.saveValue = 2;
      this.Update_Product();
    }
    if (mode === 3) {
      this.product.isdrafted = 1;
      this.product.isactive = 1;
      this.product.lastedit = this.gps.usersID;
      this.product.user_id = this.gps.usersID;
      this.product.user_roles_id = this.gps.usersRoleID;
      this.product.status = "Compliance_Approved";
      this.product.mode = 0;
      this.product.saveValue = 3;
      this.product.selected = true;
      this.Update_Product();
    }
    if (mode === 4) {
      this.product.isdrafted = 0;
      this.product.lastedit = this.gps.usersID;
      this.product.user_id = this.gps.usersID;
      this.product.user_roles_id = this.gps.usersRoleID;
      this.product.status = "Compliance_Rejected";
      this.product.mode = 0;
      this.product.saveValue = 4;
      this.Update_Product();
    }
    if (mode === 5) {
      this.product.isdrafted = 0;
      this.product.lastedit = this.gps.usersID;
      this.product.user_id = this.gps.usersID;
      this.product.user_roles_id = this.gps.usersRoleID;
      this.product.status = "Creater_Rejected";
      this.product.mode = 0;
      this.product.saveValue = 5;
      this.Update_Product();
    }
    if (mode === 7) {
      this.product.isdrafted = 0;
      this.product.lastedit = this.gps.usersID;
      this.product.user_id = this.gps.usersID;
      this.product.user_roles_id = this.gps.usersRoleID;
      this.product.status = "Drafted";
      this.product.mode = 0;
      this.product.saveValue = 0;
      this.Update_Product();
    }
  }
  Update_Product() {
    this.product.isRestrict = this.product.isRestrict ? true : false;
    this.product.isAlert = this.product.isAlert ? true : false;
    this.apiGatewayService.post(globals.updateProductApi, this.product).subscribe({
      next: (res) => {
        console.log('Product updated successfully:', res);
        this.router.navigate(['/products']);
      },
      error: (err: any) => {
        console.error('Update product failed:', err);
      }
    });
  }

  AddProduct() {
    if (this.product.is_parent === 1) delete this.product.description;
    this.product.accountTypeIdentifier = this.product.accountTypeIdentifier || "";
    this.product.sopra_product_code = this.product.accountTypeIdentifier;
    this.apiGatewayService.post(globals.createProductApi, this.product).subscribe({
      next: (res) => {
        console.log('Product updated successfully:', res);
        this.router.navigate(['/products']);
      },
      error: (err: any) => {
        console.error('create product failed:', err);
      }
    });
    // alert(`Product saved with mode ${mode}! Check the console for the product data.`);
  }
  hasChanged(param: string): void {
    if (param === 'title') {
      this.isProductTitleChanged = false;
    }
    if (param === 'sub_title') {
      this.isProductSubTitleChanged = false;
    }
  }

  dirty(): void {
    this.dirtyFlag = true;
    this.updatePreview();
  }

  updatePreview(): void {
    const title = this.product?.title ? `<h1>${this.product.title}</h1>` : `<h1>${this.DEFAULT_PRODUCT_TITLE}</h1>`;
    const sub_title = this.product?.sub_title ? `<h5>${this.product.sub_title}</h5>` : `<h5>${this.DEFAULT_PRODUCT_SUBTITLE}</h5>`;
    const body = this.product?.description ? `<div>${this.product.description}</div>` : `<div>${this.DEFAULT_PRODUCT_DESCRIPTION}</div>`;

    const buttons = this.product?.productbutton?.length
      ? this.product.productbutton.map((action: any) =>
        `<button style="padding: 5px 10px; border-radius: 20px; border: 1px solid #0d6efd; background: #0d6efd; color: white; margin: 5px;">${action.title}</button>`
      ).join('')
      : `
        <button style="padding: 5px 10px; border-radius: 20px; border: 1px solid #0d6efd; background: #0d6efd; color: white; margin: 5px;">Apply Now</button>
        <button style="padding: 5px 10px; border-radius: 20px; border: 1px solid #0d6efd; background: #0d6efd; color: white; margin: 5px;">Learn More</button>
      `;

    const html = this.generatePreviewHtml(title, sub_title, body, buttons);
    this.previewHtml = this.domSanitizer.bypassSecurityTrustHtml(html);
  }

  private generatePreviewHtml(title: string, sub_title: string, body: string, buttons: string): string {
    return `
      <html>
      <head>
        <style>
          @font-face {
            font-family: 'muli';
            src: url(assets/fonts/Mulish-ExtraLight.ttf);
          }

          body {
            background-color: white;
            color: black;
            margin: 0;
            font-family: 'muli';
          }

          .nav-bar {
            position: fixed;
            height: 70px;
            background-color: #fefefe;
            text-align: center;
            border-bottom: 1px solid #ccc;
          }

          .logo {
            height: 60%;
            width: auto;
          }

          .content {
            position: fixed;
            height: 444px;
            overflow: scroll;
            margin-top: 50px;
            min-width: 311px;
            scrollbar-width: none;
          }

          .tab-bar {
            position: fixed;
            bottom: 0;
            height: 50px;
          }

          .tab {
            width: 79px;
            height: 100%;
            float: left;
            text-align: center;
          }

          .tab:not(:last-child) {
            border-right: 1px solid #fff;
          }

          .icon {
            margin-top: 5px;
            width: inherit;
            font-size: 1.4em;
            color: #ffffff;
            font-family: "Ionicons";
            height: 30px;
          }

          .tab-title {
            position: absolute;
            bottom: 5px;
            width: inherit;
            font-size: 0.7em;
            color: black;
            font-family: "Ionicons";
          }

          div.icon-home:before {
            content: "\\f015";
          }

          div.icon-switch:before {
            content: "\\f074";
          }

          div.icon-menu:before {
            content: "\\f141";
          }

          div.icon-cash:before {
            content: "\\f143";
          }

          div.icon-pin:before {
            content: "\\f1e4";
          }

          div.icon-pricetags:before {
            content: "\\f48e";
          }

          div.icon-text:before {
            content: "\\f24f";
          }

          div.icon-settings::before {
            content: "\\f20d";
          }

          .padding {
            padding: 10px;
          }

          .card {
            border: 1px solid #dedede;
            overflow: hidden;
            font-family: 'muli';
          }

          .list {
            background-image: url("data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 20'><path d='M2,20l-2-2l8-8L0,2l2-2l10,10L2,20z' fill='%23c8c7cc'/></svg>");
            padding-right: 32px;
            background-position: right 14px center;
            background-repeat: no-repeat;
            background-size: 14px 14px;
            padding-left: 10px;
            padding: 5px;
            border: 1px solid #efefee;
            margin-bottom: 20px;
          }

          h1, h2, p {
            color: black;
            font-family: 'muli';
          }

          div.card h1 {
            font-weight: bold;
          }

          h2 {
            font-weight: bold;
          }

          div.list h1 {
            font-weight: bold;
          }

          button {
            padding: 5px;
            border-radius: 10px;
            background: linear-gradient(135deg, #041643, #3E5ADF);
            color: white;
            display: block;
          }
        </style>
      </head>

      <body>
        <!-- Status Bar -->
        <div class="status-bar d-flex" style="display: flex;">
          <span class="time" style="margin-left: 5%; margin-top: 2%; width: 50%;">9:41 AM</span>
          <div class="icons" style="margin-left: auto; margin-right: 5%; margin-top: 1%; display: inline-flex;">
            <span class="status-bar-icon" style="font-size: 14px; padding-top: 3px; padding-right: 3px;">📶</span>
            <span class="status-bar-icon battery-landscape" style="display: inline-block; transform: rotate(90deg); font-size: 23px;">🔋</span>
          </div>
        </div>

        <!-- Logo -->
        <div class="row justify-content-center">
          <img class="logo" src="/image/small-logo.png" style="width: 50px; height: 50px; margin: 10px auto; display: block;">
        </div>

        <!-- Content -->
        <div class="content padding no-scroll-width">
          <div class="card padding rounded-3" style="border-radius: 10px; border: 1px solid #dedede;box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 12px, rgba(0, 0, 0, 0.24) 0px 1px 21px !important;">
            ${title}
            ${sub_title}
            ${body}
            ${buttons}
            <button style="margin: auto; display: block; padding-left: 20px; padding-right: 20px;">View</button>
          </div>
        </div>

        <!-- Tab Bar -->
        <div class="tab-bar">
          <div class="tab">
            <img class="logo" src="/image/home_tab_outline.png" width="200px">
            <div class="tab-title">Home</div>
          </div>
          <div class="tab">
            <img class="logo" src="/image/product_tab_outline.png" width="200px">
            <div class="tab-title">Products</div>
          </div>
          <div class="tab">
            <img class="logo" src="/image/transfer_tab_outline.png" width="200px">
            <div class="tab-title">Transfer</div>
          </div>
          <div class="tab">
            <img class="logo" src="/image/more_tab_outline.png" width="200px">
            <div class="tab-title">More</div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  deleteAction(action: any, title: string): void {
    if (confirm(`Are you sure you want to delete the feature "${title}"?`)) {
      const index = this.product.productbutton?.indexOf(action) ?? -1;
      if (index > -1) {
        this.product.productbutton?.splice(index, 1);
        this.dirty();
      }
    }
  }

  uploadDocuments(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.filenames = Array.from(input.files).map(file => file.name).join(', ');
    }
  }

  viewFile(file: any): void {
    console.log('Viewing file:', file);
  }

  deleteFile(documentId: string): void {
    if (confirm('Are you sure you want to delete this file?')) {
      console.log('Deleting file with ID:', documentId);
    }
  }

  frdate(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.product.start_date = input.value;
    this.dirty();
  }

  tDate(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.product.end_date = input.value;
    this.dirty();
  }

  updateCheckboxState(property: string, yesProp: string, noProp: string, event: Event, type: string): void {
    const checked = (event.target as HTMLInputElement).checked;
    const isYes = type === 'yes';

    (this as any)[yesProp] = isYes ? checked : !checked;
    (this as any)[noProp] = isYes ? !checked : checked;

    this.product[property] = isYes;
    this.dirty();
  }

  cb_existing_greater_twelve(event: Event, type: string): void {
    this.updateCheckboxState('existing_greater_twelve', 'existing_greater_yes', 'existing_greater_no', event, type);
  }

  cb_existing_lower_twelve(event: Event, type: string): void {
    this.updateCheckboxState('existing_lower_twelve', 'existing_lower_yes', 'existing_lower_no', event, type);
  }

  cb_passbook_allowed(event: Event, type: string): void {
    this.updateCheckboxState('passbook_allowed', 'passbook_allowed_yes', 'passbook_allowed_no', event, type);
  }

  ddlFrequencyChange(): void {
    this.dirty();
  }
  ddlSopraProduct(data: any) {
    this.selected_product_sopra = data;
    console.log('Selected Phoebus Product:', this.selected_product_sopra);
  }

  onlynumber(): void {
    if (this.product.numberofaccountsacustomercanhold) {
      const sanitized = this.product.numberofaccountsacustomercanhold.toString().replace(/[^0-9]/g, '');
      this.product.numberofaccountsacustomercanhold = sanitized ? Number(sanitized) : null;
    }
  }

  addAction(): void {
    this.product.productbutton = this.product.productbutton || [];
    this.product.productbutton.push({ title: 'New Action' });
    this.dirty();
  }

  editAction(action: any, index: number): void {
    const newTitle = prompt('Edit action title:', action.title);
    if (newTitle !== null) {
      this.product.productbutton[index].title = newTitle;
      this.dirty();
    }
  }

  back(): void {
    this.router.navigate(['/products'], { state: { tab: this.curTab } });
  }
  getProductType() {
    this.apiGatewayService.get(globals.productTypeApi).subscribe({
      next: (res) => {
        this.productTypOptn = res.data.map((item: any) => item.title);;
      },
      error: (err) => {
        console.error('Failed to fetch product types:', err);
      }
    });
  }
  getMainProduct() {
    this.apiGatewayService.get(globals.mainProductApi).subscribe({
      next: (res) => {
        this.productTypes_2 = res.data;
        console.log('Available product types:', this.productTypes_2);
        console.log('Current product account identifier:', this.product.sopra_product_code);

        if (this.product.sopra_product_code) {
          // this.product.accountTypeIdentifier = this.product.sopra_product_code;
          console.log('Set accountTypeIdentifier to:', this.product.accountTypeIdentifier);

          // Check if the value exists in productTypes_2
          const exists = this.productTypes_2.some((p: any) => p.accountTypeIdentifier === this.product.accountTypeIdentifier);
          console.log('Value exists in options:', exists);
        }
      },
      error: (err) => {
        console.error('Failed to fetch parent products:', err);
      }
    });
  }
  getParentProduct() {
    this.apiGatewayService.get(globals.parentProductApi).subscribe({
      next: (res) => {
        this.parentProduct = res.data;
      },
      error: (err) => {
        console.error('Failed to fetch parent products:', err);
      }
    });
  }
}
