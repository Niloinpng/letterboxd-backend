import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseInterceptors,
  ParseIntPipe,
  NotFoundException,
  UploadedFile,
} from "@nestjs/common";
import { MediaService } from "./media.service";
import { IMedia } from "./interfaces/media.interface";
import { CreateMediaDto } from "./dto/create-media.dto";
import { UpdateMediaDto } from "./dto/update-media.dto";
import { Public } from "src/auth/decorators/isPublic.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileUploadDto } from "src/images/types/image.types";
import { CreateMediaWithTagsDto } from "./dto/create-media-with-tags.dto";

@Controller("media")
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get("tags")
  async getAllTags() {
    return this.mediaService.getAllTags();
  }

  @Get("with-tags")
  async getAllWithTags() {
    return this.mediaService.getAllMediaWithTags();
  }

  @Get("with-tags/:id")
  async getOneWithTags(@Param("id") id: number) {
    return this.mediaService.getMediaWithTags(id);
  }

  @Get(":id")
  @Public()
  async getById(@Param("id") id: number): Promise<IMedia> {
    return this.mediaService.getById(id);
  }

  @Get()
  @Public()
  async getAll(): Promise<IMedia[]> {
    return this.mediaService.getAll();
  }

  @Post()
  @Public()
  async create(@Body() createMediaDto: CreateMediaDto): Promise<IMedia> {
    return this.mediaService.create(createMediaDto);
  }

  @Post("with-tags")
  async createWithTags(@Body() createDto: CreateMediaWithTagsDto) {
    return this.mediaService.createMediaWithTagsAndList(createDto);
  }

  @Patch(":id")
  async update(
    @Param("id") id: number,
    @Body() updateMediaDto: UpdateMediaDto,
  ): Promise<IMedia> {
    return this.mediaService.update(id, updateMediaDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: number): Promise<string> {
    return this.mediaService.remove(id);
  }

  // Endpoint for uploading a cover image for a specific media item
  @Post(":id/cover")
  @UseInterceptors(FileInterceptor("cover"))
  async uploadCoverImage(
    @Param("id", ParseIntPipe) id: number,
    @UploadedFile() file: FileUploadDto,
  ) {
    return this.mediaService.updateCoverImage(id, file);
  }

  // Endpoint for retrieving a cover image for a specific media item
  @Get(":id/cover")
  async getCoverImage(@Param("id", ParseIntPipe) id: number) {
    const coverImage = await this.mediaService.getCoverImage(id);
    if (!coverImage) {
      throw new NotFoundException("Cover image not found");
    }
    return coverImage;
  }
}
