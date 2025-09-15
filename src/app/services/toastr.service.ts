import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Toast, ToastOptions, ToastType } from '../app.enums';

@Injectable({
  providedIn: 'root',
})
export class ToastrService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$: Observable<Toast[]> = this.toastsSubject.asObservable();

  private maxToasts = 5;
  private defaultDuration = 4000;
  private timeouts: Map<string, any> = new Map();

  constructor(private zone: NgZone) {}

  private generateId(): string {
    return Math.random().toString(36).substring(2, 10);
  }

  private addToast(type: ToastType, message: string, options: ToastOptions = {}): string {
    const currentToasts = this.toastsSubject.value;

    if (currentToasts.length >= this.maxToasts) {
      const oldest = currentToasts[0];
      this.remove(oldest.id);
    }

    const toast: Toast = {
      id: this.generateId(),
      type,
      message,
      duration: typeof options.duration === 'number' && options.duration > 0
        ? options.duration
        : this.defaultDuration,
      closable: options.closable ?? true,
      timestamp: Date.now(),
    };

    this.toastsSubject.next([...this.toastsSubject.value, toast]);

    if (toast.duration! > 0) {
      const timeoutId = this.zone.runOutsideAngular(() =>
        setTimeout(() => {
          this.zone.run(() => this.remove(toast.id));
        }, toast.duration)
      );
      this.timeouts.set(toast.id, timeoutId);
    }

    return toast.id;
  }

  success(message: string, options?: ToastOptions): string {
    return this.addToast('success', message, options);
  }

  error(message: string, options?: ToastOptions): string {
    return this.addToast('error', message, options);
  }

  warning(message: string, options?: ToastOptions): string {
    return this.addToast('warning', message, options);
  }

  info(message: string, options?: ToastOptions): string {
    return this.addToast('info', message, options);
  }

  remove(id: string): void {
    if (this.timeouts.has(id)) {
      clearTimeout(this.timeouts.get(id));
      this.timeouts.delete(id);
    }

    const updated = this.toastsSubject.value.filter((t) => t.id !== id);
    this.toastsSubject.next(updated);
  }

  clear(): void {
    this.timeouts.forEach(clearTimeout);
    this.timeouts.clear();
    this.toastsSubject.next([]);
  }
}
