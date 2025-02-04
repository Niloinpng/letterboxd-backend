import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from "@nestjs/common";
import { ListService } from "./list.service";
import { List } from "./list.entity";

@Controller("lists")
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Get()
  findAll() {
    return this.listService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.listService.findOne(id);
  }

  @Post()
  create(@Body() listData: Partial<List>) {
    return this.listService.create(listData);
  }

  @Put(":id")
  update(@Param("id") id: number, @Body() listData: Partial<List>) {
    return this.listService.update(id, listData);
  }

  @Delete(":id")
  remove(@Param("id") id: number) {
    return this.listService.remove(id);
  }
}
