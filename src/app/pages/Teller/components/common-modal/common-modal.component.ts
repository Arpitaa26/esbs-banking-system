import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
export interface ModalButton {
  label: string;
  icon?: string;
  class?: string;
  action: string;
  textColor?: string;
  backgroundColor?: string;
}
@Component({
  selector: 'app-common-modal',
  imports: [CommonModule],
  templateUrl: './common-modal.component.html',
  styleUrls: ['./common-modal.component.scss'],
  standalone: true
})
export class CommonModalComponent {
  @Input() showModal: boolean = false;
  @Input() title: string = 'Modal Title';
  @Input() buttons: ModalButton[] = [];
  @Output() onClose = new EventEmitter<void>();
  @Output() onAction = new EventEmitter<string>();
  @Input() width?: string;
  @Input() height?: string;

  handleButtonClick(action: string) {
    if (action === 'close') {
      this.onClose.emit();
    } else {
      this.onAction.emit(action);
    }
  }
}
