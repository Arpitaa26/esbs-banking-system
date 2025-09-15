import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import * as globals from '../../globals';
import { ApiGateWayService } from 'app/services/apiGateway.service';
import { GlobalProviderService } from 'app/services/global-provider.service';
import { ToastrService } from 'app/services/toastr.service';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  passcodeSent: boolean = false;
  emailid: string = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiGateWayService,
    private router: Router,
    private gps: GlobalProviderService,
    private toastr : ToastrService,
    private route : ActivatedRoute
  ) {
    this.forgotForm = this.fb.group({
      emailid: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmpassword: ['', Validators.required],
      passcode: ['']
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
    if (params['status'] === 'pending') {
      if (this.gps.userEmailID) {
        this.forgotForm.patchValue({
          emailid: this.gps.userEmailID
        })
        this.sendOtp()
      }
    }
  });
  }

  get maskedEmail(): string {
    if (!this.emailid) return '';
    const [name, domain] = this.emailid.split('@');
    if (!name || !domain) return this.emailid;
    const maskedName =
      name.length > 4
        ? name.slice(0, 4) + '****' + name.slice(-2)
        : name[0] + '****';
    return `${maskedName}@${domain}`;
  }

  togglePassword(field: 'password' | 'confirm') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  sendOtp() {
    const { emailid } = this.forgotForm.value;
    this.emailid = emailid;
    if (this.passcodeSent) {
      this.router.navigate(['/reset-password'], {
        queryParams: { emailid: '' },
      });
    }

    if (!this.passcodeSent) {
      this.apiService
        .post(globals.forgotpassword, { email: emailid })
        .subscribe({
          next: (res) => {
            console.log(res);
            this.passcodeSent = true;
            this.toastr.success(res.message);
          },
          error: (err) => {
            console.error(` load failed:`, err);
          },
        });
    }
  }

  resetPassword() {
    const { password, confirmpassword, passcode } = this.forgotForm.value;
    this.apiService
      .post(globals.resetpassword, { email: this.emailid, newpassword: password, otp: passcode })
      .subscribe({
        next: (res) => {
          this.toastr.success(res.message);
          this.router.navigate(['/']);
          this.forgotForm.reset();
        },
        error: (err) => {
          console.error(` load failed:`, err);
        },
      });

  }
}
