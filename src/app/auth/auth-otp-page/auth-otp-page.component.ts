import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as globals from '../../globals';
import { Router, RouterModule } from '@angular/router';
import { ApiGateWayService } from 'app/services/apiGateway.service';
@Component({
  selector: 'app-auth-otp-page',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './auth-otp-page.component.html',
  styleUrl: './auth-otp-page.component.scss'
})
export class AuthOtpPageComponent {
  otpLength = 6;
  countdown = 60;
  sent_on:any=""

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  constructor(
    private router: Router,
    private apiGatewayService: ApiGateWayService
  ) {
     this.sent_on = this.router.getCurrentNavigation()?.extras?.state?.['OtpSentOn'];
  }

  ngAfterViewInit() {
    this.startCountdown();
    this.otpInputs.first.nativeElement.focus();
  }

  onInput(event: any, index: number) {
    const inputChar = event.target.value;
    const isNumber = /^[0-9]$/.test(inputChar);

    if (isNumber) {
      event.target.value = inputChar; // ensure only 1 digit remains
      const next = this.otpInputs.toArray()[index + 1];
      if (next) next.nativeElement.focus();
    } else {
      event.target.value = ''; // prevent letters or multiple digits
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace') {
      const inputs = this.otpInputs.toArray();
      if (inputs[index].nativeElement.value === '') {
        const prev = inputs[index - 1];
        if (prev) {
          prev.nativeElement.focus();
          prev.nativeElement.value = '';
        }
      }
    }
  }

  getOtp(): string {
    return this.otpInputs.toArray().map(i => i.nativeElement.value).join('');
  }

  startCountdown(): void {
    const interval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }
  goToDashboard(): void {
    try {
      let body = {
        otp: +this.getOtp(),
      };
      this.apiGatewayService.post(globals.verifytwoFactorAuthOtpEndPoint, body).subscribe({
        next: (res) => {
          if (res.status) {
            if (res.is_blocked) {
              this.router.navigate(['/BlockedPage']);
            } else {
              this.router.navigate(['/dashboard']);
            }
          } else {
            console.error('Failed to verify OTP:', res.message);
          }
        },
        error: (err) => {
          console.error('otp verification failed:', err);
        }
      });
    } catch (error) {
      console.error('Error verify OTP:', error);
    }
  }
}
