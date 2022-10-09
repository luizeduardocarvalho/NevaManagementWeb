import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faBars,
  faHome,
  faList,
  faReceipt,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  faHome = faHome as IconProp;
  faList = faList as IconProp;
  faReceipt = faReceipt as IconProp;
  faBars = faBars as IconProp;

  isLoggedIn = true;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      if (this.authService.getToken() == null) {
        this.isLoggedIn = false;
      } else {
        this.isLoggedIn = true;
      }
    });
  }
}
