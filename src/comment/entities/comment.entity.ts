import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class Comment {
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsNumber()
  review_id: number;

  @IsOptional()
  @IsString()
  content: string;

  @IsDate()
  created_at: Date;

  @IsDate()
  updated_at: Date;

  @IsOptional()
  @IsDate()
  deleted_at?: Date;
}
