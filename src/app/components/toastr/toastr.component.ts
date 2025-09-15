import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ToastrService } from '../../services/toastr.service';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { Toast } from '../../app.enums';

@Component({
  selector: 'app-toastr',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toastr.component.html',
  styleUrls: ['./toastr.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    // listAnimation - for animating the whole list
    trigger('listAnimation', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(10px)' }),
            stagger(100, animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))),
          ],
          { optional: true }
        ),
        query(
          ':leave',
          [
            stagger(100, animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))),
          ],
          { optional: true }
        ),
      ]),
    ]),

    // slideIn - for each toast slide
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(400px)', opacity: 0 }),
        animate(
          '300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          style({ transform: 'translateX(0)', opacity: 1 })
        ),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(400px)', opacity: 0 })),
      ]),
    ]),
  ],
})
export class ToastrComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private toastrService: ToastrService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.subscription.add(
      this.toastrService.toasts$.subscribe((toasts) => {
        this.toasts = toasts;
        this.cdr.markForCheck();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getIcon(type: string): string {
    const icons: Record<string, string> = {
      success: '✓',
      error: '✕',
      warning: '!',
      info: 'i',
    };
    return icons[type] || 'i';
  }

  closeToast(event: Event, id: string): void {
    event.stopPropagation();
    this.toastrService.remove(id);
  }

  onToastClick(toast: Toast): void {
    if (toast.closable) {
      this.toastrService.remove(toast.id);
    }
  }

  trackByFn(index: number, item: Toast): string {
    return item.id;
  }
}
