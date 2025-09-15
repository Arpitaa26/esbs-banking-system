import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export interface NoDataConfig {
  title?: string;
  description?: string;
  icon?: string;
  buttonText?: string;
  showButton?: boolean;
}

@Component({
  selector: 'app-no-data',
  imports: [CommonModule],
  templateUrl: './no-data.component.html',
  styleUrl: './no-data.component.scss'
})
export class NoDataComponent {

  @Input() config: NoDataConfig = {};
  @Output() buttonClick = new EventEmitter<void>();

  defaultConfig: NoDataConfig = {
    title: 'No Data Found',
    description: 'There is no data to display at the moment.',
    icon: 'table',
    buttonText: 'Add New',
    showButton: false
  };
   sanitizedIconSvg: SafeHtml = '';

  constructor(private sanitizer: DomSanitizer) {}

  get finalConfig(): NoDataConfig {
    return { ...this.defaultConfig, ...this.config };
  }

  onButtonClick(): void {
    this.buttonClick.emit();
  }

    ngOnChanges(): void {
    this.sanitizedIconSvg = this.getSanitizedIconSvg();
  }


  getSanitizedIconSvg() {
    const icons: { [key: string]: string } = {
      building: `
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M3 21h18"/>
          <path d="M5 21V7l8-4v18"/>
          <path d="M19 21V11l-6-4"/>
          <path d="M9 9v.01"/>
          <path d="M9 12v.01"/>
          <path d="M9 15v.01"/>
          <path d="M9 18v.01"/>
        </svg>
      `,
      table: `
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M3 3h18v18H3z"/>
          <path d="M21 9H3"/>
          <path d="M21 15H3"/>
          <path d="M12 3v18"/>
        </svg>
      `,
      database: `
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <ellipse cx="12" cy="5" rx="9" ry="3"/>
          <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/>
          <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/>
        </svg>
      `,
      list: `
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <line x1="8" y1="6" x2="21" y2="6"/>
          <line x1="8" y1="12" x2="21" y2="12"/>
          <line x1="8" y1="18" x2="21" y2="18"/>
          <line x1="3" y1="6" x2="3.01" y2="6"/>
          <line x1="3" y1="12" x2="3.01" y2="12"/>
          <line x1="3" y1="18" x2="3.01" y2="18"/>
        </svg>
      `,
      users: `
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      `,
      document: `
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10,9 9,9 8,9"/>
        </svg>
      `,
      folder: `
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
        </svg>
      `,
      search: `
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"/>
          <path d="M21 21l-4.35-4.35"/>
        </svg>
      `,
      inbox: `
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
        </svg>
      `,
      package: `
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
          <line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
      `
    };
    const rawSvg = icons[this.finalConfig.icon || 'building'] || icons['building'];
    return this.sanitizer.bypassSecurityTrustHtml(rawSvg);
  }
}
