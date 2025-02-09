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
import { Public } from "src/auth/decorators/isPublic.decorator";

@ApiTags("lists")
@Controller("lists")
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  async create(@Body() createListDto: CreateListDto): Promise<IList> {
    return this.listService.create(createListDto);
  }

  @Get()
  @Public()
  async getAll(): Promise<IList[]> {
    return this.listService.getAll();
  }

  @Get(":id")
  @Public()
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

  @Get("user/:user_id")
  @Public()
  async getByUserId(@Param("user_id", ParseIntPipe) user_id: number): Promise<IList[]> {
    return this.listService.getByUserId(user_id);
  }
}
