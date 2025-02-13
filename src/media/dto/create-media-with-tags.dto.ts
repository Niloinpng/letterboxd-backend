import { CreateMediaDto } from "./create-media.dto";

export interface CreateMediaWithTagsDto extends CreateMediaDto {
  tags: string[];
  listId?: number;
}
