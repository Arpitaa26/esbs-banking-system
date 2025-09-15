import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private dataUrl = '/assets/customer-management/customer-management.json';
  private CustomerDataSubject = new BehaviorSubject<any | null>(null);
  customerdata$ = this.CustomerDataSubject.asObservable();
  userData: any = null;

  constructor(private http: HttpClient) { }

  getCustomerData(): Observable<any> {
    return this.http.get<any>(this.dataUrl);
  }

  sendCustomerData(data: any): void {
    this.userData = data;
    this.CustomerDataSubject.next(data);
  }

  clearCustomerData(): void {
    this.userData = null;
    this.CustomerDataSubject.next(null);
  }
}