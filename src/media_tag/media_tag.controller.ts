import { Controller, Get, Post, Patch, Delete, Param, Body } from "@nestjs/common";
import { MediaTagService } from "./media_tag.service";
import { IMediaTag } from "./interfaces/media_tag.interface";
import { CreateMediaTagDto } from "./dto/create-media_tag.dto";
import { UpdateMediaTagDto } from "./dto/update-media_tag.dto";

@Controller("media_tag")
export class MediaTagController {
  constructor(private readonly mediaTagService: MediaTagService) {}

  @Get()
  async getAll(): Promise<IMediaTag[]> {
    return this.mediaTagService.getAll();
  }

  @Get(":id")
  async getById(@Param("id") id: number): Promise<IMediaTag> {
    return this.mediaTagService.getById(id);
  }

  @Post()
  async create(@Body() createMediaTagDto: CreateMediaTagDto): Promise<IMediaTag> {
    return this.mediaTagService.create(createMediaTagDto);
  }

  @Patch(":id")
  async update(@Param("id") id: number, @Body() updateMediaTagDto: UpdateMediaTagDto): Promise<IMediaTag> {
    return this.mediaTagService.update(id, updateMediaTagDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: number): Promise<string> {
    return this.mediaTagService.remove(id);
  }
}
