import { IsDate, IsEnum, IsNotEmpty, IsNumber } from "class-validator";

export enum ListItemStatus {
  PENDENTE = "PENDENTE",
  EM_ANDAMENTO = "EM_ANDAMENTO",
  CONCLUÍDO = "CONCLUÍDO",
}

export class ListItem {
  @IsNumber()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  list_id: number;

  @IsNumber()
  @IsNotEmpty()
  media_id: number;

  @IsEnum(ListItemStatus)
  @IsNotEmpty()
  status: ListItemStatus;

  @IsDate()
  created_at: Date;

  @IsDate()
  updated_at: Date;
}
