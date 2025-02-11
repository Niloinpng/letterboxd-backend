import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

export class Media {
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  description: string;

  // @IsDate()
  @IsOptional()
  release_date: Date;

  @IsNotEmpty()
  @IsString()
  cover_url: string;

  @IsDate()
  created_at: Date;

  @IsDate()
  updated_at: Date;

  @IsDate()
  deleted_at?: Date;
}
