import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class List {
  @IsNumber()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDate()
  created_at: Date;

  @IsDate()
  updated_at: Date;

  @IsOptional()
  @IsDate()
  deleted_at?: Date;
}
