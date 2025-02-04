export interface IUser {
  id: number;
  name: string;
  username: string;
  email: string;
  bio?: string;
  profile_picture?: string;
  created_at: Date;
  updated_at: Date;
}
