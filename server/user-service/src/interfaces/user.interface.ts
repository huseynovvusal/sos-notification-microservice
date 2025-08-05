export interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  contacts: IUser[]; // Array of contact IDs
  createdAt: Date;
  updatedAt: Date;
}
