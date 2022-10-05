import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { ILoggedUser } from 'src/models/user/logged-user.dto';
import { LoginUserDto } from 'src/models/user/login-user.dto';


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

  getToken() {
    return localStorage.getItem('token') as string;
  }
}
