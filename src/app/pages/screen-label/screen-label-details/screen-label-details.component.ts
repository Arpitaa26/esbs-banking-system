import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiGateWayService } from 'app/services/apiGateway.service';
import { GlobalProviderService } from 'app/services/global-provider.service';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as globals from '../../../globals';

@Component({
  selector: 'app-screen-label-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './screen-label-details.component.html',
  styleUrl: './screen-label-details.component.scss'
})
export class ScreenLabelDetailsComponent {

    data: any;
    keys: any[] = [];
    attr: string = '';
    key: string = '';

    constructor(
    private router: Router,
    private api: ApiGateWayService,
    private gps: GlobalProviderService,
    private location: Location,
    private cdr: ChangeDetectorRef
  ) {
    this.data = this.router.getCurrentNavigation()?.extras?.state?.['screenData'];
    this.attr = this.router.getCurrentNavigation()?.extras?.state?.['attr'];
    this.key = this.router.getCurrentNavigation()?.extras?.state?.['searchWord'];

    this.keys = Object.keys(this.data.labels_en);
  }

  save() {
    console.log(this.data);

    const payload: { id: string; [key: string]: any } = {
      id: this.attr
    };
    payload[this.attr] = this.data;

    this.api.post(globals.updateAppLabels, payload).subscribe({
      next: (res: any) => {

        this.cdr.detectChanges();
        this.router.navigate(['/screen-lable']);
      },
      error: (err) => {
        console.error('Error loading screen label:', err);
      }
    });

  }

  goBack() {
    this.router.navigate(['/screen-lable'], {state: {searchWord: this.key}});
  }



  saveonline() {
    console.log(this.data);

    const payload: { id: string; [key: string]: any } = {
      id: this.attr
    };
    payload[this.attr] = this.data;

    this.api.post(globals.updateOnlineLabels, payload).subscribe({
      next: (res: any) => {

        this.cdr.detectChanges();
        this.router.navigate(['/screen-lable']);
      },
      error: (err) => {
        console.error('Error loading screen label:', err);
      }
    });

  }

  // goBack() {
  //   this.location.back();
  // }
}
