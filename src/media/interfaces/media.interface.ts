export interface IMedia {
  id: number;
  title: string;
  type: string;
  description?: string;
  release_date?: Date;
  cover_url?: string;
  created_at: Date;
  updated_at: Date;
  average_rating?: number;
}
