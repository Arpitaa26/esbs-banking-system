import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { ToastrComponent } from './components/toastr/toastr.component';
import { ApiGateWayService } from './services/apiGateway.service';
import { AlertComponent } from './components/alert/alert.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SpinnerComponent, ToastrComponent, AlertComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'consectus-dashboard-hub';
  constructor(private apiService: ApiGateWayService) {
  }
  @HostListener('window:beforeunload', ['$event'])
  clearLocalStorageOnRefresh(event: BeforeUnloadEvent) {
    this.apiService.logout();
  }
}
