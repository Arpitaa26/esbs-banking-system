import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface AlertInputOptions {
  type?: string;
  name: string;
  label?: string;
  value?: any;
  placeholder?: string;
}

export interface AlertButton {
  text: string;
  role?: string;
  cssClass?: string;
  handler?: (value?: any) => void;
}

export interface AlertOptions {
  title?: string;
  subTitle?: string;
  message?: string;
  cssClass?: string;
  mode?: string;
  headerColor?: string;
  headerTextColor?: string;
  bodyColor?: string;
  bodyTextColor?: string;
  inputs?: AlertInputOptions[];
  buttons?: (AlertButton | string)[];
  enableBackdropDismiss?: boolean;
  footerColor?: string;
  footerTextColor?: string;
}

@Injectable({ providedIn: 'root' })
export class AlertService {
  private alertSubject = new Subject<AlertOptions>();
  alert$ = this.alertSubject.asObservable();

  show(options: AlertOptions) {
    this.alertSubject.next(options);
  }
}
