import { ListItemStatus } from "../entities/list-item.entity";

export interface IListItem {
  id: number;
  list_id: number;
  media_id: number;
  status: ListItemStatus;
  created_at: Date;
  updated_at: Date;
}
