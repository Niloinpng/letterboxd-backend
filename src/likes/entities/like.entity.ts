import { IsNotEmpty, IsNumber, IsDate } from "class-validator";

export class Like {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @IsNumber()
  @IsNotEmpty()
  review_id: number;

  @IsDate()
  @IsNotEmpty()
  created_at: Date;
}
