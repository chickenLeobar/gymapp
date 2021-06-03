import { JwtService } from '@services/jwt.service';
import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../notifications/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [NotificationService],
})
export class NavbarComponent implements OnInit {
  coutNotifications = 0;

  readNotification: () => void;
  constructor(private jwtService: JwtService, private router: Router) {}
  ngOnInit(): void {}
  openNotification(viewMenu: boolean) {
    if (viewMenu) {
      this.readNotification();
      this.coutNotifications = 0;
    }
  }

  actionMenuPerfil(type: 'PROFILE' | 'REFERREAL' | 'LOGOUT') {
    switch (type) {
      case 'PROFILE': {
        // redirect
        this.router.navigateByUrl('/dashboard/account/profile');

        break;
      }
      case 'REFERREAL': {
        // redirect referreal
        this.router.navigateByUrl('/dashboard/account/referreals');
        break;
      }
      case 'LOGOUT': {
        this.jwtService.logout();
        break;
      }
    }
  }
}
