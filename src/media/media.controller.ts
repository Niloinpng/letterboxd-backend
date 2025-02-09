import { Controller, Get, Post, Patch, Delete, Param, Body } from "@nestjs/common";
import { MediaService } from "./media.service";
import { IMedia } from "./interfaces/media.interface";
import { UpdateMediaDto } from "./dto/update-media.dto";
import { CreateMediaDto } from "./dto/create-media.dto";

@Controller("media")
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  async getAll(): Promise<IMedia[]> {
    return this.mediaService.getAll();
  }

  @Get(":title")
  async getByTitle(@Param("title") title: string): Promise<IMedia> {
    return this.mediaService.getByTitle(title);
  }

  @Post()
  async create(@Body() createMediaDto: CreateMediaDto): Promise<IMedia> {
    return this.mediaService.create(createMediaDto);
  }

  @Patch(":title")
  async update(@Param("title") title: string, @Body() updateMediaDto: UpdateMediaDto): Promise<IMedia> {
    return this.mediaService.update(title, updateMediaDto);
  }

  @Delete(":title")
  async remove(@Param("title") title: string): Promise<string> {
    return this.mediaService.remove(title);
  }
}
