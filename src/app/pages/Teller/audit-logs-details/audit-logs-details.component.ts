import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedService } from 'app/services/shared.service';
import { ApiGateWayService } from 'app/services/apiGateway.service';
import { getApiAuditLogsById } from 'app/globals';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
interface ApiAuditLogEntry {
  id: number;
  type: string;
  url: string;
  requestBody: string;
  responseBody: string;
  headers: string;
  createdDate: string;
  error_message: string;
  error: string;
  requestbody: string;
  responsebody: string;
  created_date: string;
}
@Component({
  selector: 'app-audit-logs-details',
  imports: [CommonModule],
  templateUrl: './audit-logs-details.component.html',
  styleUrl: './audit-logs-details.component.scss'
})
export class AuditLogsDetailsComponent {
  logEntry: ApiAuditLogEntry | null = null;
  loading: boolean = false;

  expandedSections: { [key: string]: boolean } = {
    basicInfo: true,
    requestData: true,
    responseData: true,
    headerData: true,
    errorData: true
  };

  constructor(
    private sharedService: SharedService,
    private apiService: ApiGateWayService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit() {
    this.getAuditLogDetails();
  }

  goBack() {
    this.location.back();
  }

  getAuditLogDetails() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.sharedService.getAuditLogData().subscribe(data => {
      if (data) {
        this.logEntry = data;
      } else {
        this.apiService.get(getApiAuditLogsById(id))
          .subscribe({
            next: (res) => {
              this.logEntry = res.data;
            }
          })
      }
      this.loading = false;
    })
  }

  formatJson(jsonString: string): string {
    try {
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      return jsonString;
    }
  }

  openInNewTab(url: string) {
    window.open(url, '_blank');
  }

  copyToClipboard(text: string, section: string) {
    navigator.clipboard.writeText(text).then(() => {
      console.log(`${section} copied to clipboard`);
    }).catch(err => {
      console.error('Failed to copy to clipboard:', err);
    });
  }

  toggleSection(section: string) {
    this.expandedSections[section] = !this.expandedSections[section];
    console.log(this.expandedSections);
  }

  getStatusColor(type: string): string {
    if (type.includes('Get')) return '#28a745';
    if (type.includes('Create')) return '#007bff';
    if (type.includes('Update')) return '#ffc107';
    if (type.includes('Delete')) return '#dc3545';
    return '#6c757d';
  }

  formatDate(dateString: string): string {
    try {
      return new Date(dateString).toLocaleString();
    } catch (e) {
      return dateString;
    }
  }

  downloadJson(content: string, filename: string) {
    const blob = new Blob([this.formatJson(content)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
}
