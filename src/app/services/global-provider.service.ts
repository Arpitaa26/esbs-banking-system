import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalProviderService {
  public usersID: any;
  public usersRoleID: any;
  public userEmailID: any;
  public usersRoleProductSubmit: any;
  public usersRoleProductEdit: any;
  public usersRoleProductCompliance: any;
  public usersName: any;
  public userRoleName: any;
  public userMObNumber:any;
  public userPermissions:any;
  constructor() {}
  hasPermission(permission: string): boolean {
    const userPermissions = ['product_edit', 'product_submit', 'product_compliance'];
    return userPermissions.includes(permission);
  }
}
