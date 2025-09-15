import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import * as globals from '../../globals';
import { ApiGateWayService } from 'app/services/apiGateway.service';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  emailid: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private apiService: ApiGateWayService,
    private router: Router
  ) {
    this.resetForm = this.fb.group(
      {
        newpassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmpassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );

    this.route.queryParams.subscribe((params) => {
      this.emailid = params['emailid'] || '';
    });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newpassword')?.value === form.get('confirmpassword')?.value
      ? null
      : { mismatch: true };
  }

  onSubmit() {
    if (this.resetForm.invalid) return;

    const { newpassword } = this.resetForm.value;
    this.apiService
      .post(globals.resetpassword, {
        emailid: this.emailid,
        newpassword,
        modes: 1,
      })
      .subscribe({
        next: (res) => {
          console.log(res);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error(` load failed:`, err);
        },
      });
    //  this.router.navigate(['/reset-password'], { queryParams: { emailid: this.emailid } });
    // this.http.post(globals.resetpassword, {
    //   emailid: this.emailid,
    //   newpassword,
    //   modes: 1
    // }).subscribe(
    //   () => {
    //     alert('Password successfully changed');
    //     this.router.navigate(['/login']);
    //   },
    //   () => alert('Failed to reset password')
    // );
  }
}
