import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableComponent } from 'app/components/table/table.component';


@Component({
  selector: 'app-transfer-message-mapping',
  imports: [CommonModule,TableComponent,FormsModule],
  templateUrl: './transfer-message-mapping.component.html',
  styleUrl: './transfer-message-mapping.component.scss'
})
export class TransferMessageMappingComponent {
   transferMessagesMapping = [
    {

            // "id": 1,
            // "sopra_message": "Sopra Message Test",
            // "sopra_message_code": "01",
            // "app_message": "Sopra Message Test",
            // "createdby": 1,
            // "created_date": "09/05/2025",
            // "modifiedby": null,
            // "modified_date": null,
            // "isactive": 0

    }
  ];
   addTransferMessage(){}
  transferMessagesMappingOptions = {
    data: this.transferMessagesMapping,
    totalCount: this.transferMessagesMapping.length,
    serverMode: false,
    filteredData: [...this.transferMessagesMapping],
    pagination: true,
    search: true,
    filter: '',
    select: true,
    download: false,
    pageSize: 1,
   columns: {
    id: { title: 'ID', search: true },
    sopra_message: { title: 'Sopra Message', search: true },
    sopra_message_code: { title: 'Sopra Code', search: true },
    app_message: { title: 'App Message', search: true },
    created_date: { title: 'CD', search: true },
    isactive: { title: 'Is Active', search: true }
  },


  add: {
    addActionTitle: 'Add New Transfer Message',
    addAction: this.addTransferMessage.bind(this),
  },
    rowActions: [],
    allActions: [],
    selectedActions: [],
    button1: { buttonTitle: '', buttonAction: null },
    button2: { buttonTitle: '', buttonAction: null },

    uploadOptions: {},
    loading: false

  };

}


