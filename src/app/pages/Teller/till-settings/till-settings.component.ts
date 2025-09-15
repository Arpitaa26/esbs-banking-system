import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { TellerCommanSettingConfigComponent } from '../teller-comman-setting-config/teller-comman-setting-config.component';
import { FormsModule } from '@angular/forms';
import * as globals from '../../../globals';
import { ApiGateWayService } from '../../../services/apiGateway.service';
import { ToastrService } from '../../../services/toastr.service';

@Component({
  selector: 'app-till-settings',
  imports: [CommonModule, TellerCommanSettingConfigComponent, FormsModule],
  templateUrl: './till-settings.component.html',
  styleUrl: './till-settings.component.scss'
})
export class TillSettingsComponent {
  reconcileOptions = [
  { value: 'start_of_day', label: 'Start of Day' },
  { value: 'every_txn', label: 'Log Off' }
];
  form = {
    auto_logout: 10,
    reconcile: 'start_of_day',
    third_party_enabled: true,
    junior_account_threshold: 18,
    restricted_countries: [{ name: 'North Korea' }, { name: 'Iran' }],
    address_proff: [
      { name: 'UK Driving Licence (Photo)' },
      { name: 'UK Driving Licence (Old)' },
      { name: 'Council Tax Bill (Current)' },
      { name: 'HMRC Document (12 months)' },
      { name: 'DWP Document (12 months)' },
      { name: 'Bank/Insurance Statement (3 months)' },
      { name: 'Utility Bill (3 months)' }
    ],

    id_proff: [
      { name: 'Passport' },
      { name: 'UK Driving Licence (Photo)' },
      { name: 'UK Driving Licence (Old)' },
      { name: 'HMRC Document (12 months)' },
      { name: 'DWP Document (12 months)' }
    ],

    junior_Address_proff: [
      { name: "Parent's Address Proof" },
      { name: "School/College Letter" }
    ],

    junior_id_proff: [
      { name: 'Birth/Adoption Certificate' },
      { name: 'NHS Medical Card' },
      { name: 'School/College Letter' }
    ],
    third_party: {
      cash_allowed: true,
      cheque_allowed: false,
      cash_deposit: {
        label: "Cash Deposit",
        customer_signature_thresholdcustomer: 0,
        source_of_fund: {
          dropdownlist_for_source_of_funds: [{ name: 'Gambling or Lottery Winnings' }, { name: 'Sale of Property or Assets' }],
          enabled: true,
          more_than: 1000
        },
        id_threshold: [
          {
            more_than: 4000,

            message: 'You need to collect DL/Passport/Utility bill as the amount is above £4000',
            documents: 1,
            documnentCount: [
              {
                name: "Document type 1",
                list: [{ name: 'Driving licence' }],
                sms: false,
                email: false,
                " app_notification": false,
              }

            ],
            optVerification: [
              { isSms: false },
              { isEmail: false },
              { isAppNotify: false },
            ],

            is_sms_equivalent_to_all: false,
            is_email_equivalent_to_all: false,
            is_app_notification_equivalent_to_all: false,


          },
          {
            more_than: 10000,
            documnentCount: [
              {
                name: "Document type 1",
                list: [{ name: 'Driving licence' }],
                sms: false,
                email: false,
                " app_notification": false,
              },
              {
                name: "Document type 2",
                list: [{ name: 'Driving licence' }, { name: 'Passport' }],
                sms: false,
                email: false,
                " app_notification": false,
              },

            ],
            message: 'You need to collect two forms of ID',
            documents: 2,
            optVerification: [
              { isSms: false },
              { isEmail: false },
              { isAppNotify: false },
            ],

            is_sms_equivalent_to_all: false,
            is_email_equivalent_to_all: false,
            is_app_notification_equivalent_to_all: false,


          }
        ]
      },
      cheque_deposit: {
        label: "Cheque Deposit",
        source_of_fund: {
          dropdownlist_for_source_of_funds: [{ name: 'Gambling or Lottery Winnings' }, { name: 'Sale of Property or Assets' }],
          enabled: true,
          more_than: 1000
        },
        customer_signature_thresholdcustomer: 0,
        id_threshold: [
          {
            more_than: 4000,

            message: 'You need to collect DL/Passport/Utility bill as the amount is above £4000',
            documents: 1,
            documnentCount: [
              {
                name: "Document type 1",
                list: [{ name: 'Driving licence' }],
                sms: false,
                email: false,
                " app_notification": false,
              }

            ],

            optVerification: [
              { isSms: false },
              { isEmail: false },
              { isAppNotify: false },
            ],

            is_sms_equivalent_to_all: false,
            is_email_equivalent_to_all: false,
            is_app_notification_equivalent_to_all: false,


          },
          {
            more_than: 10000,
            documnentCount: [
              {
                name: "Document type 1",
                list: [{ name: 'Driving licence' }],
                sms: false,
                email: false,
                " app_notification": false,
              },
              {
                name: "Document type 2",
                list: [{ name: 'Driving licence' }, { name: 'Passport' }],
                sms: false,
                email: false,
                " app_notification": false,
              },

            ],
            message: 'You need to collect two forms of ID',
            documents: 2,

            optVerification: [
              { isSms: false },
              { isEmail: false },
              { isAppNotify: false },
            ],

            is_sms_equivalent_to_all: false,
            is_email_equivalent_to_all: false,
            is_app_notification_equivalent_to_all: false,


          }
        ]
      }
    },
    customer: {
      cash_deposit: {
        label: "Cash Deposit",
        source_of_fund: {
          dropdownlist_for_source_of_funds: [{ name: 'Gambling or Lottery Winnings' }, { name: 'Sale of Property or Assets' }],
          enabled: true,
          more_than: 1000
        },
        customer_signature_thresholdcustomer: 0,
        id_threshold: [
          {
            more_than: 4000,

            message: 'You need to collect DL/Passport/Utility bill as the amount is above £4000',
            documents: 1,
            documnentCount: [
              {
                name: "Document type 1",
                list: [{ name: 'Driving licence' }],
                sms: false,
                email: false,
                " app_notification": false,
              }

            ],
            optVerification: [
              { isSms: false },
              { isEmail: false },
              { isAppNotify: false },
            ],

            is_sms_equivalent_to_all: false,
            is_email_equivalent_to_all: false,
            is_app_notification_equivalent_to_all: false,

          },
          {
            more_than: 10000,
            documnentCount: [
              {
                name: "Document type 1",
                list: [{ name: 'Driving licence' }],
                sms: false,
                email: false,
                " app_notification": false,
              },
              {
                name: "Document type 2",
                list: [{ name: 'Driving licence' }, { name: 'Passport' }],
                sms: false,
                email: false,
                " app_notification": false,
              },

            ],
            message: 'You need to collect two forms of ID',
            documents: 2,

            optVerification: [
              { isSms: false },
              { isEmail: false },
              { isAppNotify: false },
            ],

            is_sms_equivalent_to_all: false,
            is_email_equivalent_to_all: false,
            is_app_notification_equivalent_to_all: false,


          }
        ]
      },
      cheque_deposit: {
        label: "Cheque Deposit",
        source_of_fund: {
          dropdownlist_for_source_of_funds: [{ name: 'Gambling or Lottery Winnings' }, { name: 'Sale of Property or Assets' }],
          enabled: true,
          more_than: 1000
        },
        customer_signature_thresholdcustomer: 0,
        id_threshold: [
          {
            more_than: 4000,

            message: 'You need to collect DL/Passport/Utility bill as the amount is above £4000',
            documents: 1,
            documnentCount: [
              {
                name: "Document type 1",
                list: [{ name: 'Driving licence' }],
                sms: false,
                email: false,
                " app_notification": false,
              }

            ],

            optVerification: [
              { isSms: false },
              { isEmail: false },
              { isAppNotify: false },
            ],

            is_sms_equivalent_to_all: false,
            is_email_equivalent_to_all: false,
            is_app_notification_equivalent_to_all: false,


          },
          {
            more_than: 10000,
            documnentCount: [
              {
                name: "Document type 1",
                list: [{ name: 'Driving licence' }],
                sms: false,
                email: false,
                "app_notification": false,
              },
              {
                name: "Document type 2",
                list: [{ name: 'Driving licence' }, { name: 'Passport' }],
                sms: false,
                email: false,
                " app_notification": false,
              },

            ],
            message: 'You need to collect two forms of ID',
            documents: 2,

            optVerification: [
              { isSms: false },
              { isEmail: false },
              { isAppNotify: false },
            ],

            is_sms_equivalent_to_all: false,
            is_email_equivalent_to_all: false,
            is_app_notification_equivalent_to_all: false,


          }
        ]
      },
      cash_withdrwal: {
        label: "Cash Withdrwal",
        dropdown_label: "Purpose of funds",
        source_of_fund: {
          dropdownlist_for_source_of_funds: [{ name: 'Purchase of car' }],
          enabled: true,
          more_than: 1000
        },
        customer_signature_thresholdcustomer: 0,
        id_threshold: [
          {
            more_than: 4000,

            message: 'You need to collect DL/Passport/Utility bill as the amount is above £4000',
            documents: 1,
            documnentCount: [
              {
                name: "Document type 1",
                list: [{ name: 'Driving licence' }],
                sms: false,
                email: false,
                " app_notification": false,
              }

            ],
            optVerification: [
              { isSms: false },
              { isEmail: false },
              { isAppNotify: false },
            ],

            is_sms_equivalent_to_all: false,
            is_email_equivalent_to_all: false,
            is_app_notification_equivalent_to_all: false,


          },
          {
            more_than: 10000,
            documnentCount: [
              {
                name: "Document type 1",
                list: [{ name: 'Driving licence' }],
                sms: false,
                email: false,
                " app_notification": false,
              },
              {
                name: "Document type 2",
                list: [{ name: 'Driving licence' }, { name: 'Passport' }],
                sms: false,
                email: false,
                " app_notification": false,
              },

            ],
            message: 'You need to collect two forms of ID',
            documents: 2,
            optVerification: [
              { isSms: false },
              { isEmail: false },
              { isAppNotify: false },
            ],

            is_sms_equivalent_to_all: false,
            is_email_equivalent_to_all: false,
            is_app_notification_equivalent_to_all: false,


          }
        ]
      },
      cheque_withdrawal: {
        label: "Cheque Withdrwal",
        dropdown_label: "Purpose of funds",
        source_of_fund: {
          dropdownlist_for_source_of_funds: [{ name: 'Purchase of car' }],
          enabled: true,
          more_than: 1000
        },
        customer_signature_thresholdcustomer: 0,
        id_threshold: [
          {
            more_than: 4000,

            message: 'You need to collect DL/Passport/Utility bill as the amount is above £4000',
            documents: 1,
            documnentCount: [
              {
                name: "Document type 1",
                list: [{ name: 'Driving licence' }],
                sms: false,
                email: false,
                " app_notification": false,
              }

            ],
            optVerification: [
              { isSms: false },
              { isEmail: false },
              { isAppNotify: false },
            ],

            is_sms_equivalent_to_all: false,
            is_email_equivalent_to_all: false,
            is_app_notification_equivalent_to_all: false,

          },
          {
            more_than: 10000,
            documnentCount: [
              {
                name: "Document type 1",
                list: [{ name: 'Driving licence' }],
                sms: false,
                email: false,
                " app_notification": false,
              },
              {
                name: "Document type 2",
                list: [{ name: 'Driving licence' }, { name: 'Passport' }],
                sms: false,
                email: false,
                " app_notification": false,
              },

            ],
            message: 'You need to collect two forms of ID',
            documents: 2,
            optVerification: [
              { isSms: false },
              { isEmail: false },
              { isAppNotify: false },
            ],

            is_sms_equivalent_to_all: false,
            is_email_equivalent_to_all: false,
            is_app_notification_equivalent_to_all: false,


          }
        ]
      },
      transfer_saving_transfer: {
        label: "Saving Transfer",
        customer_signature_thresholdcustomer: 0,
        id_threshold: [
          {
            more_than: 4000,
            message: 'You need to collect DL/Passport/Utility bill as the amount is above £4000',
            documents: 1,
            documnentCount: [
              {
                name: "Document type 1",
                list: [{ name: 'Driving licence' }],
                sms: false,
                email: false,
                " app_notification": false,
              }

            ],
            optVerification: [
              { isSms: false },
              { isEmail: false },
              { isAppNotify: false },
            ],

            is_sms_equivalent_to_all: false,
            is_email_equivalent_to_all: false,
            is_app_notification_equivalent_to_all: false,

          },
          {
            more_than: 10000,
            documnentCount: [
              {
                name: "Document type 1",
                list: [{ name: 'Driving licence' }],
                sms: false,
                email: false,
                " app_notification": false,
              },
              {
                name: "Document type 2",
                list: [{ name: 'Driving licence' }, { name: 'Passport' }],
                sms: false,
                email: false,
                " app_notification": false,
              },

            ],
            message: 'You need to collect two forms of ID',
            documents: 2,
            optVerification: [
              { isSms: false },
              { isEmail: false },
              { isAppNotify: false },
            ],

            is_sms_equivalent_to_all: false,
            is_email_equivalent_to_all: false,
            is_app_notification_equivalent_to_all: false,

          }
        ]
      },
      transfer_mortgage_transfer: {
        label: "Mortgage Transfer",
        customer_signature_thresholdcustomer: 0,
        id_threshold: [
          {
            more_than: 4000,

            message: 'You need to collect DL/Passport/Utility bill as the amount is above £4000',
            documents: 1,
            documnentCount: [
              {
                name: "Document type 1",
                list: [{ name: 'Driving licence' }],
                sms: false,
                email: false,
                " app_notification": false,
              }

            ],
            optVerification: [
              { isSms: false },
              { isEmail: false },
              { isAppNotify: false },
            ],

            is_sms_equivalent_to_all: false,
            is_email_equivalent_to_all: false,
            is_app_notification_equivalent_to_all: false,


          },
          {
            more_than: 10000,
            documnentCount: [
              {
                name: "Document type 1",
                list: [{ name: 'Driving licence' }],
                sms: false,
                email: false,
                " app_notification": false,
              },
              {
                name: "Document type 2",
                list: [{ name: 'Driving licence' }, { name: 'Passport' }],
                sms: false,
                email: false,
                " app_notification": false,
              },

            ],
            message: 'You need to collect two forms of ID',
            documents: 2,
            optVerification: [
              { isSms: false },
              { isEmail: false },
              { isAppNotify: false },
            ],

            is_sms_equivalent_to_all: false,
            is_email_equivalent_to_all: false,
            is_app_notification_equivalent_to_all: false,


          }
        ]
      },
      transfer_nba_transfer: {
        label: "NBA Transfer",
        customer_signature_thresholdcustomer: 0,
        id_threshold: [
          {
            more_than: 4000,

            message: 'You need to collect DL/Passport/Utility bill as the amount is above £4000',
            documents: 1,
            documnentCount: [
              {
                name: "Document type 1",
                list: [{ name: 'Driving licence' }],
                sms: false,
                email: false,
                " app_notification": false,
              }

            ],
            optVerification: [
              { isSms: false },
              { isEmail: false },
              { isAppNotify: false },
            ],

            is_sms_equivalent_to_all: false,
            is_email_equivalent_to_all: false,
            is_app_notification_equivalent_to_all: false,


          },
          {
            more_than: 10000,
            documnentCount: [
              {
                name: "Document type 1",
                list: [{ name: 'Driving licence' }],
                sms: false,
                email: false,
                " app_notification": false,
              },
              {
                name: "Document type 2",
                list: [{ name: 'Driving licence' }, { name: 'Passport' }],
                sms: false,
                email: false,
                " app_notification": false,
              },

            ],
            message: 'You need to collect two forms of ID',
            documents: 2,
            optVerification: [
              { isSms: false },
              { isEmail: false },
              { isAppNotify: false },
            ],

            is_sms_equivalent_to_all: false,
            is_email_equivalent_to_all: false,
            is_app_notification_equivalent_to_all: false,

          }
        ]
      },
      transfer_external_transfer: {
        label: "External Transfer",
        customer_signature_thresholdcustomer: 0,
        id_threshold: [
          {
            more_than: 4000,

            message: 'You need to collect DL/Passport/Utility bill as the amount is above £4000',
            documents: 1,
            documnentCount: [
              {
                name: "Document type 1",
                list: [{ name: 'Driving licence' }],
                sms: false,
                email: false,
                " app_notification": false,
              }

            ],
            optVerification: [
              { isSms: false },
              { isEmail: false },
              { isAppNotify: false },
            ],

            is_sms_equivalent_to_all: false,
            is_email_equivalent_to_all: false,
            is_app_notification_equivalent_to_all: false,


          },
          {
            more_than: 10000,
            documnentCount: [
              {
                name: "Document type 1",
                list: [{ name: 'Driving licence' }],
                sms: false,
                email: false,
                " app_notification": false,
              },
              {
                name: "Document type 2",
                list: [{ name: 'Driving licence' }, { name: 'Passport' }],
                sms: false,
                email: false,
                " app_notification": false,
              },

            ],
            message: 'You need to collect two forms of ID',
            documents: 2,
            optVerification: [
              { isSms: false },
              { isEmail: false },
              { isAppNotify: false },
            ],

            is_sms_equivalent_to_all: false,
            is_email_equivalent_to_all: false,
            is_app_notification_equivalent_to_all: false,
          }
        ]
      }
    }
  };
  newSharedSource = '';
  newSharedPurpose = '';
  newSharedDocument = '';
  allCountries: any[] = [];
  filteredCountries: any[] = [];
  showCountryDropdown: boolean = false;
  optionsList: any = [];
  activeTab: string = 'general';

  availableSources: any = [
    { name: 'Salary or Wages', selected: false },
    { name: 'Business Income', selected: false },
    { name: 'Sale of Property or Assets', selected: false },
    { name: 'Savings Over Time', selected: false },
    { name: 'Inheritance', selected: false },
    { name: 'Pension or Retirement Lump Sum', selected: false },
    { name: 'Gifts from Family Loan', selected: false },
    { name: 'Proceeds Insurance Payouts', selected: false },
    { name: 'Gambling or Lottery Winnings', selected: false }
  ];

  availablePurpose: any = [
    { name: 'Purchase of car', selected: false },
    { name: 'Purchase of furniture', selected: false },
    { name: 'Gift', selected: false },
    { name: 'Donation', selected: false },
    { name: 'Other', selected: false },
  ];

  availableDocuments: any = [
    { name: 'Driving licence', selected: false },
    { name: 'Passport', selected: false },
    { name: 'Utility bill', selected: false },
    { name: 'UK ID Card', selected: false },
    { name: 'PASSCARD', selected: false },
    { name: 'Older Person Bus Pass', selected: false },
  ];

  tabs = [
    { name: 'General', value: 'general', active: true },
    { name: 'Third party', value: 'third party', active: false },
    { name: 'Customer deposit', value: 'customer deposit', active: false },
    { name: 'Customer withdrawal', value: 'customer withdrawal', active: false },
    { name: 'Transfer', value: 'transfer', active: false },
  ];

  newThreshold: number | null = null;
  newRestrictedCountry: string = '';
  storeevent: any = [];
  newAddressProof = '';
  newIdProof = '';
  newJuniorAddressProof = '';
  newJuniorIdProof = '';

  constructor(
    public apiGatewayService: ApiGateWayService,
    private toastr: ToastrService
  ) {
    this.getBranchConfig();
  }

  ngOnInit() {
    this.getCountriesList();
  }

  getCountriesList() {
    this.apiGatewayService.get(globals.getcountrylist)
      .subscribe({
        next: (res) => {
          this.allCountries = res.data;
          this.filteredCountries = this.allCountries;
        }
      })
  }

  // onToggleAccordion(key: string) {
  //   this.accordionState[key] = !this.accordionState[key];
  // }

  onConfigChange(newConfig: any) {
    // this.cashDepositConfig = newConfig;
    // Save to backend or perform other actions
  }

  onAddSource(event: { list: any[], path: string, type: string }) { }

  onRemoveSource(event: { list: any[], index: number }) {
    event.list.splice(event.index, 1);
  }

  onAddThreshold(list: any[]) {
    list.push({
      more_than: 0,
      documnentCount: [
        {
          name: "Document type 1",
          list: [{ name: 'Driving licence' }],
        }
      ],
      documents: 1,
      optVerification: [
        { isSms: false },
        { isEmail: false },
        { isAppNotify: false }
      ],
      is_sms_equivalent_to_all: false,
      is_email_equivalent_to_all: false,
      is_app_notification_equivalent_to_all: false
    });
  }

  onRemoveThreshold(event: { list: any[], index: number }) {
    event.list.splice(event.index, 1);
  }

  onAddDocument(event: { list: any[], path: string, type: string, thresholdIndex: number, docTypeIndex: number }) {
    // const newDoc = { name: 'New Document' }; // Get from modal
    // event.list.push(newDoc);
  }

  onRemoveDocument(event: { list: any[], index: number }) {
    event.list.splice(event.index, 1);
  }

  onThresholdDocChange(event: { docCount: any[], documents: any }) {
    if (event.documents === '1' && event.docCount.length > 1) {
      event.docCount.splice(1);
    } else if (event.documents === '2' && event.docCount.length < 2) {
      event.docCount.push({
        name: "Document type 2",
        list: []
      });
    }
  }

  selectTab(tabValue: string): void {
    this.activeTab = tabValue;
    this.tabs.forEach(tab => {
      tab.active = tab.value === tabValue;
    });
  }

  onInputFocus() {
    this.showCountryDropdown = true;
    this.filterCountryList();
  }

  filterCountryList() {
    const value = this.newRestrictedCountry.toLowerCase();
    this.filteredCountries = this.allCountries
      .filter(c => c.name.toLowerCase().includes(value))
      .filter(c => !this.form.restricted_countries.some(existing => existing.name.toLowerCase() === c.name.toLowerCase()));
  }

  selectCountry(country: string) {
    this.form.restricted_countries.push({ name: country });
    this.newRestrictedCountry = '';
    this.filteredCountries = [];
  }

  hideCountryDropdown() {
    setTimeout(() => this.showCountryDropdown = false, 200);
  }

  removeSource(index: number) {
    this.availableSources.splice(index, 1);
  }

  removePurpose(index: number) {
    this.availablePurpose.splice(index, 1);
  }

  addSharedSource() {
    const value = this.newSharedSource.trim();
    if (value && !this.availableSources.find((src: any) => src.name === value)) {
      this.availableSources.push({ name: value });
      this.newSharedSource = '';
    }
  }

  addSharedPurpose() {
    const value = this.newSharedPurpose.trim();
    if (value && !this.availablePurpose.find((src: any) => src.name === value)) {
      this.availablePurpose.push({ name: value });
      this.newSharedPurpose = '';
    }
  }

  addSharedDocument() {
    const name = this.newSharedDocument.trim();
    if (name && !this.availableDocuments.find((d: any) => d.name === name)) {
      this.availableDocuments.push({ name });
    }
    this.newSharedDocument = '';
  }

  removeDocument(index: number) {
    this.availableDocuments.splice(index, 1);
  }

  addRestrictedCountry() {
    const name = this.newRestrictedCountry.trim();
    if (name && !this.form.restricted_countries.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      this.form.restricted_countries.push({ name });
      this.newRestrictedCountry = '';
    }
  }

  removeRestrictedCountry(index: number) {
    this.form.restricted_countries.splice(index, 1);
  }


  saveConfigjson() {
    const data = {
      config: this.form
    }
    this.apiGatewayService.post(globals.postBranchConfig, data)
      .subscribe({
        next: (res) => {
          this.toastr.success(res.message);
        }
      })
  }

  getBranchConfig() {
    this.apiGatewayService.get(globals.getBranchConfig)
      .subscribe({
        next: (res) => {
          this.form = res.data.config;
        }
      })
  }

  addAddressProof() {
    const trimmed = this.newAddressProof.trim();
    if (trimmed) {
      this.form.address_proff.push({ name: trimmed });
      this.newAddressProof = '';
    }
  }

  removeAddressProof(index: number) {
    this.form.address_proff.splice(index, 1);
  }

  addIdProof() {
    const trimmed = this.newIdProof.trim();
    if (trimmed) {
      this.form.id_proff.push({ name: trimmed });
      this.newIdProof = '';
    }
  }

  removeIdProof(index: number) {
    this.form.id_proff.splice(index, 1);
  }

  addJuniorAddressProof() {
    const trimmed = this.newJuniorAddressProof.trim();
    if (trimmed) {
      this.form.junior_Address_proff.push({ name: trimmed });
      this.newJuniorAddressProof = '';
    }
  }

  removeJuniorAddressProof(index: number) {
    this.form.junior_Address_proff.splice(index, 1);
  }

  addJuniorIdProof() {
    const trimmed = this.newJuniorIdProof.trim();
    if (trimmed) {
      this.form.junior_id_proff.push({ name: trimmed });
      this.newJuniorIdProof = '';
    }
  }

  removeJuniorIdProof(index: number) {
    this.form.junior_id_proff.splice(index, 1);
  }
}
