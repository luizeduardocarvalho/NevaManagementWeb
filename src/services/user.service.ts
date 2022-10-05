import { Injectable } from '@angular/core';
import { IUser } from 'src/models/user/user.dto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  getUser(): IUser {
    return JSON.parse(localStorage.getItem('user') as string);
  }
}
