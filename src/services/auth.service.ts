import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { IChangePassword } from 'src/models/change-password/change-password';
import { ILoggedUser } from 'src/models/user/logged-user.dto';
import { LoginUserDto } from 'src/models/user/login-user.dto';
import { IUser } from 'src/models/user/user.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }),
  };

  constructor(private http: HttpClient) {}

  login(user: LoginUserDto): Observable<ILoggedUser> {
    return this.http.post<ILoggedUser>(
      environment.baseUrl + 'auth/login',
      user,
      this.httpOptions
    );
  }

  changePassword(user: IChangePassword): Observable<any> {
    return this.http.post(environment.baseUrl + 'auth/changepassword', user);
  }

  getToken() {
    return localStorage.getItem('token') as string;
  }

  getEmail() {
    var user = JSON.parse(localStorage.getItem('user') as string) as IUser;
    return user.email;
  }
}
