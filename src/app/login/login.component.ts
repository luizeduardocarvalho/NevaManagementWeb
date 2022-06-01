import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginUserDto } from 'src/models/user/login-user.dto';
import { User } from 'src/models/user/user';
import { AuthService } from 'src/services/auth.service';
import { ToastService } from 'src/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSubmit(data: any) {
    let user = {
      email: data.controls.email.value,
      password: data.controls.password.value,
    } as LoginUserDto;

    this.authService.login(user).subscribe(
      (data: User) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        this.router.navigate(['/']);
      },
      (err: any) => {
        this.toastService.show(err.error, 'Error', true);
      }
    );
  }
}
