import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  currency_code = '£'
  private userData: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  private branchData: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  private customerMenus: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  private auditLogsDetails: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  userData$: Observable<string[]> = this.userData.asObservable();
  branchData$: Observable<string[]> = this.branchData.asObservable();
  customerMenus$: Observable<string[]> = this.customerMenus.asObservable();
  sharedData: any;
  auditLogsDetails$: Observable<string[]> = this.auditLogsDetails.asObservable();
  constructor() { }

  setUserData(data: any) {
    this.userData.next(data);
  }

  getUserData(): Observable<any> {
    return this.userData$;
  }

  setAuditLogData(data: any) {
    this.auditLogsDetails.next(data);
  }

  getAuditLogData(): Observable<any> {
    return this.auditLogsDetails$;
  }

  setBranchData(data: any) {
    this.branchData.next(data);
  }

  getBranchData(): Observable<any> {
    return this.branchData$;
  }

  setCustomerMenus(data: any) {
    this.customerMenus.next(data);
  }

  getCustomerMenus(): Observable<any> {
    return this.customerMenus$;
  }

  setSharedData(menu: any) {
    this.sharedData = menu;
  }

  getSharedData() {
    return this.sharedData;
  }

  clearSharedData() {
    this.sharedData = null;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }
}
