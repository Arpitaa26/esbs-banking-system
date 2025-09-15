import { Component } from '@angular/core';
import { DynamicTableComponent } from "../components/dynamic-table/dynamic-table.component";

@Component({
  selector: 'app-role-management',
  imports: [DynamicTableComponent],
  templateUrl: './role-management.component.html',
  styleUrl: './role-management.component.scss'
})
export class RoleManagementComponent {
  tableColumns = [];
  roleList = [];
  itemsPerPage = 10;

  ngOnInit() {}

  toggleSelectAll() {}

  toggleStaffSelection(event : any) {}

  goToPage(page : any) {}

  onRowClicked(event : any) {

  }
}
