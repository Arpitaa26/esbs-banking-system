import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { SharedService } from './shared.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket | null = null;
  constructor(public notificationService: NotificationService) {

  }
  connectWithToken() {
    if (this.socket) this.socket.disconnect();

    this.socket = io(environment.socket_url, {
      auth: { token: localStorage.getItem('hub_token') },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000
    });

    this._setupEvents();
  }

  private _setupEvents() {
    this.socket?.on('connect', () => {
      console.log('Socket connected:', this.socket?.id, 'time: ', new Date());
    });

    this.socket?.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
    });

    this.socket?.on('connect_error', (err) => {
      console.error('Connect error:', err.message);
    });

    this.socket?.on('till-request', (data) => {
      console.log("Teller transaction request received:", data);
      this.notificationService.addNotification(data);
       this.notificationService.showNotification('Till Request', `Request from ${data.from || 'Teller'}`);
    });
  }

  emit(eventName: string, data?: any) {
    this.socket?.emit(eventName, data);
  }

  on<T>(eventName: string): Observable<T> {
    return new Observable<T>((subscriber) => {
      this.socket?.on(eventName, (data: T) => subscriber.next(data));
    });
  }

  disconnect() {
    this.socket?.disconnect();
  }

  updateToken() {
    localStorage.setItem('authToken', localStorage.getItem('hub_token') || '');
    this.connectWithToken();
  }

}
