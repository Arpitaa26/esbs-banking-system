import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-teller-comman-setting-config',
  imports: [CommonModule, FormsModule],
  templateUrl: './teller-comman-setting-config.component.html',
  styleUrl: './teller-comman-setting-config.component.scss'
})
export class TellerCommanSettingConfigComponent {
  @Input() config: any;
  @Input() accordionState: any = {};
  @Input() sourceOptions: any[] = [];
  @Input() documentOptions: any[] = [];
  @Input() purposeOptions: any[] = [];
  oIndex =0;
  iIndex =0;
  // @Output() toggleAccordion = new EventEmitter<string>();
  @Output() configChange = new EventEmitter<any>();
  @Output() addSource = new EventEmitter<{ list: any[], path: string, type: string }>();
  @Output() removeSource = new EventEmitter<{ list: any[], index: number }>();
  @Output() addThreshold = new EventEmitter<any[]>();
  @Output() removeThreshold = new EventEmitter<{ list: any[], index: number }>();
  @Output() addDocument = new EventEmitter<{ list: any[], path: string, type: string, thresholdIndex: number, docTypeIndex: number }>();
  @Output() removeDocument = new EventEmitter<{ list: any[], index: number }>();
  @Output() thresholdDocChange = new EventEmitter<{ docCount: any[], documents: any }>();
  openAccordian = false
  showDropdown = false;
  optionsList: any = [];
  checkboxToggleTitle = 'Select Documents'
  constructor() { }

  ngOninit() { }

  onToggleAccordion() {
    // this.toggleAccordion.emit(key);
    this.openAccordian = !this.openAccordian
  }

  toggleModal(show: boolean) {
    this.showDropdown = show;
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  onAddSource(list: any[], path: string, type: string) {
    // this.config.dropdown_label ? : 'purpose': 'sources'
    this.addSource.emit({ list, path, type });
    if (type == 'sources') {
      this.optionsList = this.sourceOptions;
      this.checkboxToggleTitle = "Select Source"
    } else {
      this.optionsList = this.purposeOptions;
      this.checkboxToggleTitle = "Select Purpose"
    }
    this.optionsList.forEach((source: any) => {
      source.selected = list.some(selected => selected.name === source.name);
    });

    this.toggleModal(true)
  }

  onRemoveSource(list: any[], index: number) {
    this.removeSource.emit({ list, index });
  }

  onAddThreshold(list: any[]) {
    this.addThreshold.emit(list);
  }

  onRemoveThreshold(list: any[], index: number) {
    this.removeThreshold.emit({ list, index });
  }

  onAddDocument(list: any[], path: string, type: string, thresholdIndex: number, docTypeIndex: number) {
    this.checkboxToggleTitle = "Select Document"
    this.optionsList = this.documentOptions;
    this.optionsList.forEach((source: any) => {
      source.selected = list.some(selected => selected.name === source.name);
    });
    this.toggleModal(true)
    this.oIndex = thresholdIndex;
    this.iIndex = docTypeIndex
    this.addDocument.emit({ list, path, type, thresholdIndex, docTypeIndex });
  }

  onRemoveDocument(list: any[], index: number) {
    this.removeDocument.emit({ list, index });
  }

  onChangeThresholdDoc(docCount: any[], documents: any) {
    this.thresholdDocChange.emit({ docCount, documents });
  }

  onConfigChange() {
    this.configChange.emit(this.config);
  }

  saveList() {
    let selectedList = this.optionsList
      .filter((doc: any) => doc.selected)
      .map((doc: any) => ({ name: doc.name }));

    if (this.checkboxToggleTitle == "Select Document") {
      this.config.id_threshold[this.oIndex].documnentCount[this.iIndex].list = selectedList
    } else {
      this.config.source_of_fund.dropdownlist_for_source_of_funds = selectedList
    }

    this.toggleModal(false);
  }
}

