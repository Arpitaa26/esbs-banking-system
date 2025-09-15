import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiGateWayService } from 'app/services/apiGateway.service';
import { GlobalProviderService } from 'app/services/global-provider.service';
import * as globals from '../../globals';

@Component({
  selector: 'app-two-fa-auth',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './two-fa-auth.component.html',
  styleUrl: './two-fa-auth.component.scss'
})
export class TwoFaAuthComponent {
  otp: string = '';

  userPhone: string = '';
  userEmail: string = '';

  constructor(
    private router: Router,
    private gps: GlobalProviderService,
    private apiGatewayService: ApiGateWayService,
  ) {
    this.getUserDetails();
  }

  getUserDetails() {
    try {
      this.userPhone = this.maskPhoneNumber(this.gps.userMObNumber);
      this.userEmail = this.maskEmail(this.gps.userEmailID);
    } catch (error) {
      console.error('Error user details:', error);
    }
  }

  // Mask number
  maskPhoneNumber(phone: string): string {
    try {
      return phone ? phone.replace(phone.substring(0, 7), '********') : '';
    } catch (error) {
      console.error('Error masking phone number:', error);
      return '';
    }
  }

  // Mask email
  maskEmail(email: string): string {
    try {
      if (email) {
        let [localPart, domain] = email.split("@");
        if (localPart.length > 2) {
          let visiblePart = localPart.substring(0, 2);
          let maskedPart = '*'.repeat(localPart.length - 3);
          localPart = visiblePart + maskedPart;
        } else {
          localPart = localPart[0] + '*';
        }
        return localPart + "@" + domain;
      }
      return '';
    } catch (error) {
      console.error('Error masking email:', error);
      return '';
    }
  }

  sendOTP(method: 'sms' | 'email'): void {
    try {
      // let body = method === 'sms' ? { "email": false, "mobile": true } : { "email": true, "mobile": false };
      const body = {method : method}
      this.apiGatewayService.post(globals.sendtwoFactorAuthOtpEndPoint, body).subscribe({
        next: (res) => {
          if (res.status) {
            let otpdata = method === 'sms' ? this.userPhone : this.userEmail;
            this.router.navigate(['/passcode'], { state: { OtpSentOn: otpdata } });
          } else {
            console.error('Failed to send OTP:', res.message);
          }
        },
        error: (err) => {
          console.error('Login failed:', err);
        }
      });
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  }

}
