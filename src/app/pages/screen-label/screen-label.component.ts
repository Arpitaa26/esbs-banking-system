import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SegmentComponent } from 'app/components/segment/segment.component';
import { ApiGateWayService } from 'app/services/apiGateway.service';
import * as globals from '../../globals';
import { Router } from '@angular/router';
@Component({
  selector: 'app-screen-label',
  imports: [SegmentComponent, CommonModule, FormsModule,],
  templateUrl: './screen-label.component.html',
  styleUrl: './screen-label.component.scss'
})
export class ScreenLabelComponent {

  app_label: { [key: string]: any } = {};
  online_label: { [key: string]: any } = {};
  title_to_key: { [key: string]: any } = {};
  searchBank: any;
  key: string = '';

  constructor(
    public api: ApiGateWayService, private cdr: ChangeDetectorRef, private router: Router
  ) {
    this.key = this.router.getCurrentNavigation()?.extras?.state?.['searchWord'];
    this.getLabelJson();
  }
  segbuttonConfig = [
    { name: 'Mobile App', functionName: 'mobile_app' },
    { name: 'Online App', functionName: 'bank_online' }
  ];
  currentTab = 'mobile_app';

  processes: string[] = ['NCR', 'CMN', 'ECAO'];


  selectedProcessMobile = '';
  pageLabelsMobile: string[] = [];
  pageLabelsMobile2: string[] = [];
  selectedLabelMobile = '';
  formFieldsMobile: any[] = [];


  selectedProcessbank = '';
  pageLabelsbank: string[] = [];
  selectedLabelbank = '';
  formFieldsbank: any[] = [];

  seghandleClick(tab: string) {
    this.currentTab = tab;
    this.selectedProcessMobile = '';
    this.pageLabelsMobile = [];
    this.pageLabelsMobile2 = [];
    this.selectedLabelMobile = '';
    this.formFieldsMobile = [];

    this.selectedProcessbank = '';
    this.pageLabelsbank = [];
    this.selectedLabelbank = '';
    this.formFieldsbank = [];

    if(tab === 'mobile_app'){
      this.getLabelJson();
    }
  }

  onProcessSelect(tab: 'mobile' | 'bank') {
    const labelMap: any = {
      'NCR': ['NCR1', 'NCR2', 'NCR3'],
      'CMN': ['CMN1', 'CMN2'],
      'ECAO': ['ECAO1', 'ECAO2']
    };

    if (tab === 'mobile') {
      this.pageLabelsMobile = labelMap[this.selectedProcessMobile] || [];
      this.selectedLabelMobile = '';
      this.formFieldsMobile = [];
    } else {
      this.pageLabelsbank = labelMap[this.selectedProcessbank] || [];
      this.selectedLabelbank = '';
      this.formFieldsbank = [];
    }
  }

  onLabelSelect(label: string, tab: 'mobile' | 'bank') {
    const fields = [
      { key: 'WELCOME_TEXT1', value: 'Welcome to The App' },
      { key: 'NEW_CUSTOMER_BUTTON', value: 'New Customer' },
      { key: 'EXISTING_CUSTOMER_BUTTON', value: 'Existing Customer' },
      { key: 'ALERT_1', value: 'Error occurred, try again' },
      { key: 'ALERT_TITLE', value: 'Alert' },
      { key: 'ALERT_OK_BUTTON', value: 'OK' }
    ];

    if (tab === 'mobile') {
      this.selectedLabelMobile = label;
      this.formFieldsMobile = fields;
    } else {
      this.selectedLabelbank = label;
      this.formFieldsbank = fields;
    }
  }
  getLabelJson() {
    const apiurl = globals.getScreenLabel;
    this.api.get(apiurl).subscribe({
      next: (response: any) => {
        this.app_label = response.labeldata?.app || {};

        const keys = Object.keys(this.app_label);
        for(let key of keys){
          const props = Object.keys(this.app_label[key].labels_en);
          if(props.includes("PAGE_TITLE") && this.app_label[key].labels_en.PAGE_TITLE !== null && this.app_label[key].labels_en.PAGE_TITLE !== ''){
            this.pageLabelsMobile.push(this.app_label[key].labels_en.PAGE_TITLE);
            this.title_to_key[this.app_label[key].labels_en.PAGE_TITLE] = key;
          } else if(props.includes("PAGE_NAME") && this.app_label[key].labels_en.PAGE_NAME !== null && this.app_label[key].labels_en.PAGE_NAME !== ''){
            this.pageLabelsMobile.push(this.app_label[key].labels_en.PAGE_NAME);
            this.title_to_key[this.app_label[key].labels_en.PAGE_NAME] = key;
          }
        }
        this.pageLabelsMobile2 = [...this.pageLabelsMobile];
        this.filterMobileLabels();

        this.online_label = response.labeldata?.online || {};
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading screen label:', err);
      }
    });
  }

goToDetails(label: string) {

  const keyy = this.title_to_key[label];
  const data = this.app_label[keyy];
  this.router.navigate(['/screen-label-details'], {
    state: { screenData: data, attr: keyy, searchWord: this.key }
  });
}
filteredPageLabelsMobile: string[] = [];


ngOnInit() {
  // Initialize with all labels
  this.filteredPageLabelsMobile = [...this.pageLabelsMobile];

}

filterMobileLabels() {
  // const search = this.searchBank.toLowerCase();
  // this.filteredPageLabelsMobile = this.pageLabelsMobile.filter(label =>
  //   label.toLowerCase().includes(search)
  // );
  this.pageLabelsMobile2 = this.pageLabelsMobile.filter(item =>
  item.toLowerCase().includes(this.key.toLowerCase())
);
}

// filterBankLabels() {
//   const search = this.searchBank.toLowerCase();
//   this.filteredPageLabelsbank = this.pageLabelsbank.filter(label =>
//     label.toLowerCase().includes(search)
//   );
// }


}
