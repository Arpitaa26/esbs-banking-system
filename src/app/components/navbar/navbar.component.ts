import { Component } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NotificationCardComponent } from '../../pages/Teller/components/notification-card/notification-card.component';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { ApiGateWayService } from '../../services/apiGateway.service';
import * as globals from '../../globals';
import { GlobalProviderService } from 'app/services/global-provider.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [NotificationCardComponent, CommonModule],
})
export class NavbarComponent {
  notifications: any[] = [];
  blink = false;
  showCard = false;
  pageTitle: string = 'Admin Dashboard';
  userName: string = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public sharedService: SharedService,
    private notificationService: NotificationService,
    public apiGatewayService: ApiGateWayService,
    private gps: GlobalProviderService
  ) {
    this.userName = gps.usersName;
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.setPageTitle());
  }

  ngOnInit() {
    this.notificationService.notifications$.subscribe((n) => {
      this.notifications = n;
    });
    this.notificationService.bellBlink$.subscribe((b) => {
      this.blink = b;
    });
  }

  toggleCard() {
    this.showCard = !this.showCard;
    if (this.showCard) this.notificationService.stopBellBlink();
  }

  handleNotificationClick(notification: any) {
    this.showCard = false;
    const body = {
      receiverType: 'hub',
    };
    this.apiGatewayService
      .put(globals.markAsReadNotification(notification.tel_notification_id), body)
      .subscribe({
        next: () => {
          this.router.navigate(['/system-request-management']);
        },
      });
  }

  setPageTitle(): void {
    let route = this.activatedRoute.firstChild;
    while (route?.firstChild) {
      route = route.firstChild;
    }
    this.pageTitle = route?.snapshot.data['title'] || 'Admin Dashboard';
  }

  clickNotifications() {
    this.showCard = true;
    this.notificationService.stopBellBlink();
    const body = {
      receiverType: 'hub',
    };
    this.apiGatewayService.post(globals.getNotificationList, body).subscribe({
      next: (res) => {
        this.notifications = [...res.data.notifications];
        this.notifications = Array.from(
          new Map(this.notifications.map((item) => [item.message, item])).values()
        );
      },
    });
  }
}
