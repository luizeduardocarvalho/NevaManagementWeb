import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'NevaManagementWeb';
  isLoggedIn = true;

  constructor(
    library: FaIconLibrary,
    private router: Router,
    private authService: AuthService
  ) {
    library.addIcons(faUser);
  }
  ngOnInit(): void {
    this.router.events.subscribe(() => {
      if (this.authService.getToken() == null) {
        this.isLoggedIn = false;
      } else {
        this.isLoggedIn = true;
      }
    });
  }

  onLogout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
