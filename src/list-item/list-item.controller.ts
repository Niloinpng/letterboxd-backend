import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
  } from "@nestjs/common";
import { ListItemService } from "./list-item.service";
import { CreateListItemDto } from "./dto/create-list-item.dto";
import { UpdateListItemDto } from "./dto/update-list-item.dto";
import { ApiTags } from "@nestjs/swagger";
import { IListItem } from "./interfaces/list-item.interface";
import { Public } from "src/auth/decorators/isPublic.decorator";
@ApiTags("list-items")
@Controller("list-items")
export class ListItemController {
  constructor(private readonly listItemService: ListItemService) {}
  @Post()
  @Public()
  async create(@Body() createListItemDto: CreateListItemDto): Promise<IListItem> {
    return this.listItemService.create(createListItemDto);
  }

  @Get()
  @Public()
  async getAll(): Promise<IListItem[]> {
    return this.listItemService.getAll();
  }

  @Get("list/:list_id")
  @Public()
  async getByListId(@Param("list_id", ParseIntPipe) list_id: number): Promise<IListItem[]> {
    return this.listItemService.getByListId(list_id);
  }

  @Patch(":id")
  @Public()
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateListItemDto: UpdateListItemDto,
  ): Promise<IListItem> {
    return this.listItemService.update(id, updateListItemDto);
  }

  @Delete(":id")
  @Public()
  async remove(@Param("id", ParseIntPipe) id: number): Promise<string> {
    return this.listItemService.remove(id);
  }
}