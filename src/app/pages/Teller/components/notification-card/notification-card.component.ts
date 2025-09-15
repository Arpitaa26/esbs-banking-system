import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
interface Notification {
  id: string;
  type?: 'info' | 'warning' | 'success' | 'error';
  title?: string;
  message: string;
  timestamp?: string;
  isRead: boolean;
}
@Component({
  selector: 'app-notification-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.scss']
})
export class NotificationCardComponent {
  @Input() notifications: Notification[] = [];
  @Output() notificationClicked = new EventEmitter<Notification>();
  @Output() close = new EventEmitter<void>();
  @Output() markAsRead = new EventEmitter<string>();
  @Output() markAllAsRead = new EventEmitter<void>();

  onClick(notification: Notification) {
    this.notificationClicked.emit(notification);
  }

  onClose() {
    this.close.emit();
  }

  onMarkAsRead(event: Event, notificationId: string) {
    event.stopPropagation();
    this.markAsRead.emit(notificationId);
  }

  onMarkAllRead() {
    this.markAllAsRead.emit();
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }
}
