export class User {
    id: number;
    email: string;
    name: string;
    token: string;
    user: {}

    constructor(id: number, name: string, email: string, token: string, user: {}) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.token = token;
        this.user = user;
    }
}