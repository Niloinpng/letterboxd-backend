import { IsString, IsNumber } from "class-validator";

export class CreateMediaTagDto {
  @IsString()
  tag: string;

  @IsNumber()
  mediaId: number;
}
