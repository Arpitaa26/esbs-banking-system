import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AlertService, AlertOptions, AlertButton } from '../../services/alert.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule]
})
export class AlertComponent implements OnInit {
  visible: boolean = false;
  options: AlertOptions = {};
  inputData: { [key: string]: any } = {};

  constructor(private alertService: AlertService,
    private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.alertService.alert$.subscribe((opts: any) => {
      if (opts) {
        this.options = opts;
        this.inputData = {};
        this.options.inputs?.forEach((input: any) => {
          this.inputData[input.name] = input.value || '';
        });
        this.visible = true;
        this.cdRef.markForCheck();
      }
    });
  }


  close(role: string = 'cancel') {
    this.visible = false;
    const btn = this.getButtonByRole(role);
    if (btn?.handler) btn.handler(null);
  }

  getButtonByRole(role: string): AlertButton | undefined {
    return this.options.buttons?.find(
      b => typeof b !== 'string' && b.role === role
    ) as AlertButton | undefined;
  }

  handleClick(button: AlertButton | string) {
    this.visible = false;
    if (typeof button === 'string') return;
    if (button.handler) button.handler(this.inputData);
  }

  onInputChange(name: string, value: any) {
    this.inputData[name] = value;
  }

  handleBackdropClick() {
    if (this.options.enableBackdropDismiss !== false) {
      this.close('cancel');
    }
  }
  getButtonClasses(btn: any): string[] {
    const role = (btn as AlertButton).role;
    const custom = (btn as AlertButton).cssClass || '';
    const classes = [];

    if (role === 'cancel') classes.push('btn-secondary');
    else if (role === 'destructive') classes.push('btn-danger');
    else classes.push('btn-primary');

    if (custom) classes.push(custom);
    return classes;
  }
  getButtonText(btn: any): string {
    return typeof btn === 'string' ? btn : btn.text;
  }
  handleInputEvent(name: string, event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    const value = target?.value || '';
    this.onInputChange(name, value);
  }

}
