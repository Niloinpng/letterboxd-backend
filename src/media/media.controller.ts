import { Controller, Get, Post, Patch, Delete, Param, Body } from "@nestjs/common";
import { MediaService } from "./media.service";
import { IMedia } from "./interfaces/media.interface";
import { CreateMediaDto } from "./dto/create-media.dto";
import { UpdateMediaDto } from "./dto/update-media.dto";

@Controller("media")
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  async getAll(): Promise<IMedia[]> {
    return this.mediaService.getAll();
  }

  @Get(":id")
  async getById(@Param("id") id: number): Promise<IMedia> {
    return this.mediaService.getById(id);
  }

  @Post()
  async create(@Body() createMediaDto: CreateMediaDto): Promise<IMedia> {
    return this.mediaService.create(createMediaDto);
  }

  @Patch(":id")
  async update(@Param("id") id: number, @Body() updateMediaDto: UpdateMediaDto): Promise<IMedia> {
    return this.mediaService.update(id, updateMediaDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: number): Promise<string> {
    return this.mediaService.remove(id);
  }
}