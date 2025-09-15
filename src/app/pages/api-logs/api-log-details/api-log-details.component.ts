import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SharedService } from 'app/services/shared.service';

@Component({
  selector: 'app-api-log-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './api-log-details.component.html',
  styleUrls: ['./api-log-details.component.scss']
})
export class ApiLogDetailsComponent {
  apilogsview: any = {};
  formatJSON_response: SafeHtml = '';
  formatJSON_request: SafeHtml = '';
  formatJSON_headers: SafeHtml = '';
  expandedResponse = false;
  expandedRequest = false;
  expandedHeaders = false;

  // Track copy button states
  copyStates = {
    request: false,
    headers: false,
    response: false
  };

  // Timer references for resetting copy buttons
  copyTimers: any = {
    request: null,
    headers: null,
    response: null
  };
  apilogsviewData: string | undefined;

  constructor(private router: Router, private sanitizer: DomSanitizer, private sharedService: SharedService) {
    const data = this.router.getCurrentNavigation()?.extras?.state?.['apilogDetail'];
    if (data) {
      this.apilogsview = data;
      this.apilogsviewData = this.sharedService.formatDate(data.created_at || data.created_date);
      this.formatJSON_response = this.formatJSONSafely(this.apilogsview.responsebody);
      this.formatJSON_request = this.formatJSONSafely(this.apilogsview.requestbody);
      this.formatJSON_headers = this.formatJSONSafely(this.apilogsview.headers);
    } else {
      this.back();
    }
  }

  back() {
    this.router.navigate(['/api-logs']);
  }

  private formatJSONSafely(json: string | object): SafeHtml {
    if (!json) return '';

    try {
      const obj = typeof json === 'string' ? JSON.parse(json) : json;
      return this.formaterJSON(obj);
    } catch (e) {
      return typeof json === 'string' ? json : JSON.stringify(json);
    }
  }

  private formaterJSON(json: any): SafeHtml {
    const formatted = JSON.stringify(json, null, 2)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        (match) => {
          let cls = 'number';
          if (/^"/.test(match)) {
            cls = /:$/.test(match) ? 'key' : 'string';
          } else if (/true|false/.test(match)) {
            cls = 'boolean';
          } else if (/null/.test(match)) {
            cls = 'null';
          }
          return `<span class="${cls}">${match}</span>`;
        }
      );
    return this.sanitizer.bypassSecurityTrustHtml(formatted);
  }

  toggleExpand(type: 'response' | 'request' | 'headers') {
    switch (type) {
      case 'response': this.expandedResponse = !this.expandedResponse; break;
      case 'request': this.expandedRequest = !this.expandedRequest; break;
      case 'headers': this.expandedHeaders = !this.expandedHeaders; break;
    }
  }

  copyToClipboard(content: any, type: 'request' | 'headers' | 'response') {
    try {
      const textToCopy = typeof content === 'string' ? content : JSON.stringify(content, null, 2);

      // Update button state
      this.copyStates[type] = true;

      // Clear any existing timer
      if (this.copyTimers[type]) {
        clearTimeout(this.copyTimers[type]);
      }

      // Set timer to reset button state after 2 seconds
      this.copyTimers[type] = setTimeout(() => {
        this.copyStates[type] = false;
      }, 2000);

      // Copy to clipboard
      navigator.clipboard.writeText(textToCopy).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      });
    } catch (e) {
      console.error('Failed to copy:', e);
    }
  }
}
