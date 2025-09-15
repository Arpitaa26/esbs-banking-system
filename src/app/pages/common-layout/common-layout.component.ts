import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-common-layout',
  imports: [RouterOutlet,NavbarComponent,SidebarComponent],
  templateUrl: './common-layout.component.html',
  styleUrl: './common-layout.component.scss'
})
export class CommonLayoutComponent {
  constructor(private socketService: SocketService) { };

  ngOnInit(): void {
    this.socketService.on<string>('hub-message').subscribe((msg) => {
      console.log('msg: ', msg);
    });

    this.socketService.on<string>('till-request').subscribe((msg) => {
      console.log('msg: ', msg);
    });
  }

}
