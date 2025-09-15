import { CommonModule } from '@angular/common';
import { Component,ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import * as globals from 'app/globals';
import { ApiGateWayService } from 'app/services/apiGateway.service';

@Component({
  selector: 'app-add-update-super-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-update-super-admin.component.html',
  styleUrl: './add-update-super-admin.component.scss'
})
export class AddUpdateSuperAdminComponent {
  formData: any = {};
   curTab: string = '';
  constructor(private router: Router,
    private api: ApiGateWayService,
    private cdr:ChangeDetectorRef
  ) {
    const state = this.router.getCurrentNavigation()?.extras?.state;
    this.curTab = this.router.getCurrentNavigation()?.extras?.state?.['tab'];
    const formData = state?.['appVersionData'];
    if (formData) {
      this.formData = {
        ...formData,
        islive: !!formData.islive,
        forced: !!formData.forced,
        ssl_change: !!formData.ssl_change,
        forced_message: formData.forced_message ||''
      };
    } else {

      this.router.navigate(['/super-admin']);
    }
  }
  submit() {
  const payload = {
    appversioning_id: this.formData.appversioning_id,
    devicetype: this.formData.devicetype,
    version: this.formData.version,
    appname: this.formData.appname,
    appurl: this.formData.appurl,
    islive: this.formData.islive ? 1 : 0,
    forced: this.formData.forced ? 1 : 0,
    forced_message: this.formData.forced_message ||'' ,
    ssl_change: this.formData.ssl_change ? 1 : 0
  };

  this.api.post(globals.updateAppVersionEndpoint, payload).subscribe({
    next: (res: any) => {
      if (res?.status === true) {
        alert('App version updated successfully!');
        this.router.navigate(['/super-admin']);
        this.cdr.detectChanges();
      } else {
        alert(res?.message || 'Something went wrong while updating.');
      }
    },
    error: (err) => {
      console.error('Error while posting app version:', err);
      alert('Failed to submit. Please try again later.');
    }
  });
}


  back() {
    this.router.navigate(['/super-admin'], { state: { tab: this.curTab }});
  }
}
