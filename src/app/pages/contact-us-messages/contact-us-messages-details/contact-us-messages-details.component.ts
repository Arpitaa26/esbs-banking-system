import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiGateWayService } from 'app/services/apiGateway.service';
import { GlobalProviderService } from 'app/services/global-provider.service';
import { getMessagesEndpoint, sendMessageEndpoint } from 'app/globals';
@Component({
  selector: 'app-contact-us-messages-details',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './contact-us-messages-details.component.html',
  styleUrls: ['./contact-us-messages-details.component.scss']
})
export class ContactUsMessagesDetailsComponent implements OnInit, OnDestroy, AfterViewChecked {
   @ViewChild('chatMessages') private chatMessages!: ElementRef;
  contactData: any;
  newMessage: string = '';
  firstName: string = '';
  lastName: string = '';
  subject: string = '';
  description: string = '';
  date: string = '';
  email: string = '';
  status: string = '';
  feedback: string = '';
  payload: any;
  messages: { sender: string, content: string, timestamp: Date }[] = [];
  intervalId: any;

  constructor(
    private router: Router,
    private apiService: ApiGateWayService,
    private gps: GlobalProviderService,
    private cdr: ChangeDetectorRef
  ) {
    const data = this.router.getCurrentNavigation()?.extras?.state?.['chatData'];
    if (data) {
      this.firstName = data.firstname || '';
      this.lastName = data.lastname || '';
      this.subject = data.subject || '';
      this.description = data.description || '';
      this.date = data.create_date?.slice(0, 10) || '';
      this.email = data.emailid || '';
      this.status = data.isread === 1 ? 'Read' : 'Unread';
      this.feedback = data.resolvedfeedback || '';
      this.payload = {
        customer_complaint_id: data.customer_complaint_id
      };
      this.fetchMessages();
    } else {
      console.error('No chatData found in navigation state');
    }
  }

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.fetchMessages();
    }, 10000);
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

   private scrollToBottom(): void {
    try {
      this.chatMessages.nativeElement.scrollTop = this.chatMessages.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

fetchMessages() {
  this.apiService.post(getMessagesEndpoint, this.payload).subscribe({
    next: (response: any) => {
      this.messages = (response?.data || []).map((msg: any) => ({
        sender: msg.messageusertype === 'user' ? (msg.username || 'Super Admin') : 'User',
        content: msg.message,
        timestamp: new Date(msg.create_date)
      }));

      this.cdr.detectChanges();
      this.scrollToBottom();
    },
    error: (error: any) => {
      console.error('Error fetching messages:', error);
    }
  });
}

  sendMessage() {
    const trimmedMessage = this.newMessage.trim();
    if (!trimmedMessage) return;
    const sendPayload = {
      message: trimmedMessage,
      messageby: this.gps.usersID,
      customer_complaint_id: this.payload.customer_complaint_id
    };
    this.apiService.post(sendMessageEndpoint, sendPayload).subscribe({
      next: (res: any) => {
        this.newMessage = '';
        this.fetchMessages();
        this.scrollToBottom();
      },
      error: (err) => {
        console.error('Error sending message:', err);
      }
    });
  }

  back() {
    this.router.navigate(['/contact-us-messages']);
  }

}
