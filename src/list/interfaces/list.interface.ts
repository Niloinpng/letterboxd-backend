export interface IList {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}
