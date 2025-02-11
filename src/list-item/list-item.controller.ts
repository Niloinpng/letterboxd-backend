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

@ApiTags("list-items")
@Controller("list-items")
export class ListItemController {
  constructor(private readonly listItemService: ListItemService) {}
  @Post()
  async create(@Body() createListItemDto: CreateListItemDto): Promise<IListItem> {
    return this.listItemService.create(createListItemDto);
  }

  @Get()
  async getAll(): Promise<IListItem[]> {
    return this.listItemService.getAll();
  }

  @Get(":id")
  async getById(@Param("id", ParseIntPipe) id: number): Promise<IListItem> {
    return this.listItemService.getById(id);
  }

  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateListItemDto: UpdateListItemDto,
  ): Promise<IListItem> {
    return this.listItemService.update(id, updateListItemDto);
  }

  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number): Promise<string> {
    return this.listItemService.remove(id);
  }
}