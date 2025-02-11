import { IsNumber, IsString, IsDate } from "class-validator";

export class Review {
  @IsNumber()
  id: number;

  @IsNumber()
  user_id: number;

  @IsNumber()
  media_id: number;

  @IsNumber()
  rating: number;

  @IsString()
  content: string;

  @IsDate()
  created_at: Date;

  @IsDate()
  updated_at: Date;
}