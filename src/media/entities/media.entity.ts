import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { Transform } from "class-transformer";

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

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value)) // validator
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
