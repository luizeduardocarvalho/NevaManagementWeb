import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { ILoggedUser } from 'src/models/user/logged-user.dto';
import { LoginUserDto } from 'src/models/user/login-user.dto';

import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `${this.tokenService.getToken()}`,
    }),
  };

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  login(user: LoginUserDto): Observable<ILoggedUser> {
    return this.http.post<ILoggedUser>(
      environment.baseUrl + 'auth/login',
      user,
      this.httpOptions
    );
  }
}
