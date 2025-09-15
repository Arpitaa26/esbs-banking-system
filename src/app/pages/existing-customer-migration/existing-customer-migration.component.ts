import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SegmentComponent } from 'app/components/segment/segment.component';
import { TableComponent } from 'app/components/table/table.component';
import Quill from 'quill';

@Component({
  selector: 'app-existing-customer-migration',
  imports: [CommonModule,FormsModule,TableComponent,SegmentComponent],
  templateUrl: './existing-customer-migration.component.html',
  styleUrl: './existing-customer-migration.component.scss',
  standalone: true
})
export class ExistingCustomerMigrationComponent implements AfterViewInit {
  quillEditor: Quill | undefined;
  currentTab: string = 'status';
  segbuttonConfig: any = [
    { name: 'Compose Mail', functionName: 'compose_mail' },
    { name: 'Status', functionName: 'status' }
  ];
  MVdata: any = {
    data: [],
    filteredData: [],
    columns: {
      "soprarefno": { title: "Sopra Reff No.", search: true, format: 'function', fn: this.commonFunction.bind(this) },
      "mailstatus": { title: "Mail Status", search: true, format: 'function', fn: this.commonFunction.bind(this) },
      "remark": { title: "Remark", search: true, format: 'function', fn: this.commonFunction.bind(this) },
    },
    pagination: true,
    fitler: null,
    search: true,
    select: false,
    rowActions: [],
    download: true,
    btnSize: "small",
    pageSize: 50,
    rowClass: "table-row",
    columnClass: "table-column",
    resetFilter: null,
    add: {
      addActionTitle: "",
      addAction: "",
    },
    uploadOptions: {
    },
  };
  ngAfterViewInit(): void {
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
          ['link', 'image'],
          ['clean']
        ]
      }
    });
    this.quillEditor.on('text-change', () => {
      const html = this.quillEditor?.root.innerHTML;
      // console.log('Content:', html);
    });
  }
  constructor() {
    this.MVdata.data = [
      {
          "soprarefno": "680489",
          "mailstatus": "Mail sent",
          "remark": "Mail sent."
      },
      {
          "soprarefno": "636116",
          "mailstatus": "Mail sent",
          "remark": "Mail sent."
      },
      {
          "soprarefno": "636116",
          "mailstatus": "Mail sent",
          "remark": "Mail sent."
      },
      {
          "soprarefno": "636116",
          "mailstatus": "Mail sent",
          "remark": "Mail sent."
      },
      {
          "soprarefno": "681798",
          "mailstatus": "Mail sent",
          "remark": "Mail sent."
      },
      {
          "soprarefno": "679887",
          "mailstatus": "Mail sent",
          "remark": "Mail sent."
      },
      {
          "soprarefno": "680138",
          "mailstatus": "Mail sent",
          "remark": "Mail sent."
      },
      {
          "soprarefno": "681404",
          "mailstatus": "Mail sent",
          "remark": "Mail sent."
      },
      {
          "soprarefno": "679871",
          "mailstatus": "Mail sent",
          "remark": "Mail sent."
      },
      {
          "soprarefno": "680247",
          "mailstatus": "Mail sent",
          "remark": "Mail sent."
      },
      {
          "soprarefno": "682087",
          "mailstatus": "Mail sent",
          "remark": "Mail sent."
      },
      {
          "soprarefno": "679887\r",
          "mailstatus": "Mail sent",
          "remark": "Mail sent."
      },
      {
          "soprarefno": "680138\r",
          "mailstatus": "Mail sent",
          "remark": "Mail sent."
      },
      {
          "soprarefno": "681404\r",
          "mailstatus": "Mail sent",
          "remark": "Mail sent."
      },
      {
          "soprarefno": "679871\r",
          "mailstatus": "Mail sent",
          "remark": "Mail sent."
      },
      {
          "soprarefno": "679984\r",
          "mailstatus": "Mail sent",
          "remark": "Mail sent."
      },
      {
          "soprarefno": "680136\r",
          "mailstatus": "Mail sent",
          "remark": "Mail sent."
      },
      {
          "soprarefno": "680664\r",
          "mailstatus": "Mail sent",
          "remark": "Mail sent."
      },
      {
          "soprarefno": "680152\r",
          "mailstatus": "Mail sent",
          "remark": "Mail sent."
      },
      {
          "soprarefno": "680021",
          "mailstatus": "Mail sent",
          "remark": "Mail sent."
      },
      {
          "soprarefno": "682253",
          "mailstatus": "Mail sent",
          "remark": "Mail sent."
      },
      {
          "soprarefno": "681441",
          "mailstatus": "Mail sent",
          "remark": "Mail sent."
      },
      {
          "soprarefno": "678450",
          "mailstatus": "Mail sent",
          "remark": "Mail sent."
      },
      {
          "soprarefno": "680399",
          "mailstatus": "Mail sent",
          "remark": "Mail sent."
      },
      {
          "soprarefno": "680251",
          "mailstatus": "Mail sent",
          "remark": "Mail sent."
      },
      {
          "soprarefno": "680476",
          "mailstatus": "Mail sent",
          "remark": "Mail sent."
      },
      {
          "soprarefno": "680472",
          "mailstatus": "Mail sent",
          "remark": "Mail sent."
      },
      {
          "soprarefno": "680564",
          "mailstatus": "Mail sent",
          "remark": "Mail sent."
      },
      {
          "soprarefno": "681215",
          "mailstatus": "Mail sent",
          "remark": "Mail sent."
      },
      {
          "soprarefno": "682799",
          "mailstatus": "Mail sent",
          "remark": "Mail sent."
      },
      {
          "soprarefno": "681193",
          "mailstatus": "Mail sent",
          "remark": "Mail sent."
      },
      {
          "soprarefno": "682675",
          "mailstatus": "Mail sent",
          "remark": "Mail sent."
      },
      {
          "soprarefno": "714758",
          "mailstatus": "Mail sent",
          "remark": "Mail sent."
      },
      {
          "soprarefno": "714856",
          "mailstatus": "Mail sent",
          "remark": "Mail sent."
      },
      {
          "soprarefno": "713140",
          "mailstatus": "Mail not sent",
          "remark": "Customer not found."
      },
      {
          "soprarefno": "100855",
          "mailstatus": "Mail sent",
          "remark": "Mail sent."
      }
  ]
  }
  seghandleClick(functionName: string) {
    switch (functionName) {
      case functionName:
        this.currentTab = functionName;
        break;
    }
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
}
