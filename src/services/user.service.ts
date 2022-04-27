import { Injectable } from "@angular/core";
import { User } from "src/models/user";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    getUser(): User {
        localStorage.setItem('user', '{"id": 1, "name": "Maria Victoria"}');
        return JSON.parse(localStorage.getItem('user') as string);
    }
}