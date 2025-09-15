import { SharedService } from './../../services/shared.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import * as globals from '../../globals';
import { ApiGateWayService } from '../../services/apiGateway.service';
import { GlobalProviderService } from 'app/services/global-provider.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'app/services/toastr.service';
@Component({
  selector: 'app-login',
  imports: [RouterModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {
  loginForm!: FormGroup;
  InputType: string = 'password';
  isPasswordVisible: boolean = false;

  constructor(
    private apiGatewayService: ApiGateWayService,
    private router: Router,
    private gps: GlobalProviderService,
    private toastr : ToastrService
  ) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  changeType(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
    this.InputType = this.isPasswordVisible ? 'text' : 'password';
  }

  onSubmit() {
    try {
      if (this.loginForm.valid) {
        this.apiGatewayService.post(globals.loginApiEndPoint, this.loginForm.value).subscribe({
          next: (res) => {
            this.gps.userEmailID = res.data.email;
            if (res.data.status === "pending") {
              this.router.navigate(['/forgot-password'], { queryParams: { status: 'pending' } });
              return;
            }
            this.apiGatewayService.storeAuthData(res);
            this.gps.usersID = res.data.user_id;
            this.gps.usersRoleID = res.data.user_roles[0].user_roles_id;
            this.gps.usersRoleProductSubmit = res.data.user_roles[0].product_submit;
            this.gps.usersRoleProductEdit = res.data.user_roles[0].product_edit;
            this.gps.usersRoleProductCompliance = res.data.user_roles[0].product_compliance;
            this.gps.usersName = res.data.full_name;
            this.gps.userRoleName = res.data.user_roles[0].rolename;
            this.gps.userMObNumber = res.data.phone;
            this.gps.userPermissions = res.data.permissions;
            this.router.navigate(['/2fa-authentication']);
          },
          error: (err) => {
            console.error('Login failed:', err);
          }
        });
      } else {
        this.loginForm.markAllAsTouched();
      }
    } catch (error) {
      console.log("login failed Error :", error)
    }
  }
}
