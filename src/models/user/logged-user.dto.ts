import { IUser } from './user.dto';

export interface ILoggedUser {
  token: string;
  researcher: IUser;
}
