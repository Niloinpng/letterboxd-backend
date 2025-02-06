import { IsDate, IsNotEmpty, IsNumber } from "class-validator";

export class Follow {
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  follower_id: number;

  @IsNotEmpty()
  @IsNumber()
  followed_id: number;

  @IsDate()
  created_at: Date;
}
