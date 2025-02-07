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
import { ListService } from "./list.service";
import { CreateListDto } from "./dto/create-list.dto";
import { UpdateListDto } from "./dto/update-list.dto";
import { ApiTags } from "@nestjs/swagger";
import { IList } from "./interfaces/list.interface";

@ApiTags("lists")
@Controller("lists")
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  async create(@Body() createListDto: CreateListDto): Promise<IList> {
    return this.listService.create(createListDto);
  }

  @Get()
  async getAll(): Promise<IList[]> {
    return this.listService.getAll();
  }

  @Get(":id")
  async getById(@Param("id", ParseIntPipe) id: number): Promise<IList> {
    return this.listService.getById(id);
  }

  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateListDto: UpdateListDto,
  ): Promise<IList> {
    return this.listService.update(id, updateListDto);
  }

  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number): Promise<string> {
    return this.listService.remove(id);
  }
}
