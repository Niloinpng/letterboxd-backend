import { IsOptional, IsString, IsNumber } from "class-validator";

export class UpdateMediaTagDto {
  @IsOptional()
  @IsString()
  tag?: string;

  @IsOptional()
  @IsNumber()
  mediaId?: number;
}
