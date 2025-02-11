import { PickType } from "@nestjs/swagger";
import { ListItem } from "../entities/list-item.entity";

export class CreateListItemDto extends PickType(ListItem, [
  "list_id",
  "media_id",
  "status",
]) {}
