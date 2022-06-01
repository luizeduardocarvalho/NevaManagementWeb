import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { baseUrl } from 'settings';
import { LoginUserDto } from 'src/models/user/login-user.dto';

import { User } from 'src/models/user/user';
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

  login(user: LoginUserDto): Observable<User> {
    return this.http.post<User>(baseUrl + 'auth/login', user, this.httpOptions);
  }
}
