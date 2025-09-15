import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SegmentComponent } from 'app/components/segment/segment.component';
import { TableComponent } from 'app/components/table/table.component';
import { ApiGateWayService } from 'app/services/apiGateway.service';
import * as globals from 'app/globals';
@Component({
  selector: 'app-faq-section',
  standalone: true,
  imports: [SegmentComponent, CommonModule, FormsModule, TableComponent],
  templateUrl: './faq-section.component.html',
  styleUrl: './faq-section.component.scss'
})
export class FaqSectionComponent {
  activeFaqs: any;
  nonactiveFaqs: any;
  activeFaqCategory: any;
  nonactiveFaqCategory: any;
  segbuttonConfig1: any = [
    { name: 'FAQs Category', functionName: 'faqs_categroy' },
    { name: 'FAQs', functionName: 'faqs' }
  ];
  segbuttonConfig3: any = [
    { name: 'Active', functionName: 'activeFaqs' },
    { name: 'Archive', functionName: 'archiveFaqs' }
  ];
  segbuttonConfig2: any = [
    { name: 'Active', functionName: 'activeFaqCategory' },
    { name: 'Archive', functionName: 'archiveFaqCategory' }
  ];
  currentTab1: any = 'faqs_categroy';
  currentTab2: any = 'activeFaqCategory';
  currentTab3: any = 'activeFaqs';

  faqCategory: any = {
    data: [],
    filteredData: [],
    serverMode: false,
    columns: {
      categoryname: {
        title: "Category",
        search: true,
        format: "function",
        fn: this.commonFunction.bind(this),
      },
      created_date: {
        title: "Created Date",
        search: true,
        format: "date",
        fn: this.commonFunction.bind(this),
      },
    },
    pagination: true,
    fitler: null,
    search: true,
    select: true,
    selectedActions: [
      { title: "Delete", color: "red", action: this.deletefaqCategory.bind(this) },
    ],
    rowActions: [],
    download: true,
    btnSize: "small",
    pageSize: 50,
    rowClass: "table-row",
    columnClass: "table-column",
    add: {
      addActionTitle: "Add FAQ Category",
      addAction: this.AddFaqs_category.bind(this),
    },
    tapRow: this.updateFaqs_category.bind(this),
    resetFilter: null,
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
  faq: any = {
    data: [],
    filteredData: [],
    serverMode: false,
    columns: {
      categoryname: { title: "Category", search: true, mobile: true, format: 'function', fn: this.commonFunction.bind(this) },
      title: { title: "Title", search: true, mobile: true, format: 'function', fn: this.commonFunction.bind(this) },
      type: { title: "Type", mobile: true, format: 'function', fn: this.commonFunction.bind(this) },
    },
    pagination: true,
    fitler: null,
    search: true,
    select: true,
    selectedActions: [
      { title: "Delete", color: 'red', action: this.deleteFaq.bind(this) }
    ],
    rowActions: [],
    download: true,
    btnSize: "small",
    pageSize: 50,
    rowClass: "table-row",
    columnClass: "table-column",
    add: {
      addActionTitle: "Add FAQs",
      addAction: this.AddFaqs.bind(this),
    },
    tapRow: this.UpdateFaqs.bind(this),
    resetFilter: null,
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

  constructor(private router: Router, private api: ApiGateWayService, private cdr: ChangeDetectorRef) {
    this.loadFaqCategories();
    this.loadFaqs();

    const state = this.router.getCurrentNavigation()?.extras?.state;

    if (state?.['tab']) {
      this.currentTab1 = state['tab'];

      if(state['child'] == 'faqs_categroy')
          this.currentTab2 = state['subTab'];
      else
          this.currentTab3 = state['subTab'];
    }

    this.faqCategory.data = [];
    if(this.currentTab1 == 'faqs_categroy')
      this.loadFaqCategories()
    else
      this.loadFaqs()
  }

  loadFaqCategories() {
    const apiurl = globals.getFaqCatApi(this.faqCategory.serverParams)
    this.api.get(apiurl).subscribe({
      next: (response: any) => {
        this.activeFaqCategory = response.data.filter((x: any) => x.isactive === 1);
        this.nonactiveFaqCategory = response.data.filter((y: any) => y.isactive === 0);
        this.faqCategory.selectedActions[1] = this.currentTab2 === 'activeFaqCategory' ? { title: "Archive", action: this.faqCategoryArchive.bind(this), color: "red" } : { title: "Active", action: this.faqCategoryActive.bind(this), color: "green" };
        const Option = { ...this.faqCategory, data: this.currentTab2 === 'activeFaqCategory' ? this.activeFaqCategory : this.nonactiveFaqCategory, ...this.faqCategory.selectedActions[1] };
        this.faqCategory = Option;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading FAQ categories:', err);
      }
    });
  }
  loadFaqs() {
    const apiurl = globals.getFaqApi(this.faq.serverParams);
    this.api.get(apiurl).subscribe({
      next: (response: any) => {
        this.activeFaqs = response.data.filter((x: any) => x.isactive === 1);
        this.nonactiveFaqs = response.data.filter((y: any) => y.isactive === 0);
        this.faq.selectedActions[1] = this.currentTab3 === 'activeFaqs' ? { title: "Archive", action: this.faqArchive.bind(this), color: "red" } : { title: "Active", action: this.faqActive.bind(this), color: "green" };
        const Option = { ...this.faq, data: this.currentTab3 === 'activeFaqs' ? this.activeFaqs : this.nonactiveFaqs, ...this.faq.selectedActions[1] };
        this.faq = Option;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading FAQs:', err);
      }
    });
  }
  seghandleClick1(functionName: string) {
    this.currentTab1 = functionName;
  }
  seghandleClick2(functionName: string) {
    try {
      this.currentTab2 = functionName;
      this.loadFaqCategories();
    } catch (error) { console.error("Error in seghandleClick2:", error); }
  }
  seghandleClick3(functionName: string) {
    try {
      this.currentTab3 = functionName;
      this.loadFaqs();
    } catch (error) { console.error("Error in seghandleClick2:", error); }
  }
  commonFunction(nullData: any) {
    try {
      let str = "";
      if (nullData === 0 || nullData == null || nullData === undefined) {
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
  updateFaqs_category(data: any) {
    this.router.navigate(['/add-update-faqs-category'], { state: { faqsCategoryData: data , tab: this.currentTab1, subTab: this.currentTab2 } });
  }
  AddFaqs_category(data: any) {
    this.router.navigate(['/add-update-faqs-category'] ,  { state: { tab: this.currentTab1, subTab: this.currentTab2 } } );
  }
  UpdateFaqs(data: any) {
    this.router.navigate(['/add-update-faq'], { state: { faqData: data , tab: this.currentTab1, subTab: this.currentTab3 } });
  }
  AddFaqs(data: any) {
    this.router.navigate(['/add-update-faq'] , { state: { tab: this.currentTab1, subTab: this.currentTab3 } });
  }

  updateFaqCategoryStatus(data: any, isActive: number) {
    try {
      const categoryIds = data.map((item: any) => item.category_id).join(',');
      const payload = {
        category_id: categoryIds,
        isactive: isActive,
      };
      this.api.post(globals.updateFaqCategoryEndpoint, payload).subscribe({
        next: () => this.loadFaqCategories(),
        error: (err) => console.error('Error updating FAQs:', err),
      });
    } catch (error) {
      console.error('Exception in updateFaqCategoryStatus:', error);
    }
  }

  faqCategoryArchive(data: any) {
    try {
      this.updateFaqCategoryStatus(data, 0);
    } catch (error) {
      console.error('Exception in faqCategoryArchive:', error);
    }
  }

  faqCategoryActive(data: any) {
    try {
      this.updateFaqCategoryStatus(data, 1);
    } catch (error) {
      console.error('Exception in faqCategoryActive:', error);
    }
  }

  updateFaqStatus(data: any, isActive: number) {
    try {
      const FaqIds = data.map((item: any) => item.faq_id).join(',');
      const payload = {
        faq_id: FaqIds,
        isactive: isActive,
      };
      this.api.post(globals.updateFaqStatusEndpoint, payload).subscribe({
        next: () => this.loadFaqs(),
        error: (err) => console.error('Error updating FAQs:', err),
      });
    } catch (error) {
      console.error('Exception in updateFaqStatus:', error);
    }
  }

  faqArchive(data: any) {
    try {
      this.updateFaqStatus(data, 0);
    } catch (error) {
      console.error('Exception in faqArchive:', error);
    }
  }

  faqActive(data: any) {
    try {
      this.updateFaqStatus(data, 1);
    } catch (error) {
      console.error('Exception in faqActive:', error);
    }
  }

  deletefaqCategory(data: any) {
    try {
      const categoryIds = data.map((item: any) => item.category_id).join(',');
      this.api.post(globals.deleteFaqCategoryEndpoint, { category_id: categoryIds }).subscribe({
        next: () => {
          this.loadFaqCategories();
        },
        error: (err) => console.error('Error deleting FAQ category:', err),
      });
    } catch (error) {
      console.error('Exception in deletefaqCategory:', error);
    }
  }

  deleteFaq(data: any) {
    try {
      const faqIds = data.map((item: any) => item.faq_id).join(',');
      this.api.post(globals.deleteFaqEndpoint, { faq_id: faqIds }).subscribe({
        next: () => {
          this.loadFaqs();
        },
        error: (err) => console.error('Error deleting FAQ:', err),
      });
    } catch (error) {
      console.error('Exception in deleteFaq:', error);
    }
  }


  onPageChangefaqc(params: any, tableIndex: number) {
    this.faqCategory.serverParams = Object.assign({},this.faqCategory.serverParams,{ pageDetail: params });
    this.loadFaqCategories();
  }

  onPageChangefaq(params: any, tableIndex: number) {
    this.faq.serverParams = Object.assign({},this.faq.serverParams,{ pageDetail: params });
    this.loadFaqs();
  }

  onSearchfaqc(params: any, tableIndex: number) {
    this.faqCategory.serverParams = Object.assign({},this.faqCategory.serverParams,{ searchDetail: params });
    this.loadFaqCategories();
  }
  onSearchfaq(params: any, tableIndex: number) {
    this.faq.serverParams = Object.assign({},this.faq.serverParams,{ searchDetail: params });
    this.loadFaqs();
  }
}
