import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notifications = new BehaviorSubject<any[]>([]);
  private bellBlink = new BehaviorSubject<boolean>(false);

  notifications$ = this.notifications.asObservable();
  bellBlink$ = this.bellBlink.asObservable();

  addNotification(notification: any) {
    const current = this.notifications.getValue();
    this.notifications.next([...current, notification]);
    this.bellBlink.next(true);
  }

  clearNotifications() {
    this.notifications.next([]);
  }

  stopBellBlink() {
    this.bellBlink.next(false);
  }

  requestNotificationPermission() {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission().then((permission) => {
        console.log('Notification permission:', permission);
      });
    }
  }

  showNotification(title: string, body: string) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
      });
    }
  }
}
