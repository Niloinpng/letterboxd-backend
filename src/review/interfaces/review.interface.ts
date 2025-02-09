export interface IReview {
    id: number;
    user_id: number;
    media_id: number;
    rating: number;
    content: string;
    created_at: Date;
    updated_at: Date;
  }
  