import { Injectable } from "@angular/core";
import { User } from "src/models/user/user";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor() {}
    
    getUser(): User {
        return JSON.parse(localStorage.getItem('user') as string);
    }
}