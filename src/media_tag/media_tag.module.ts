import { Module } from "@nestjs/common";
import { MediaTagService } from "./media_tag.service";
import { MediaTagController } from "./media_tag.controller";

@Module({
  controllers: [MediaTagController],
  providers: [MediaTagService],
})
export class MediaTagModule {}
