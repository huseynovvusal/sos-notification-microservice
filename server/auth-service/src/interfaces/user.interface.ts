export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  contacts: IUser[]; // Array of contact IDs
  createdAt: Date;
  updatedAt: Date;
}
