import { Module } from "@nestjs/common";
import { ListItemService } from "./list-item.service";
import { ListItemController } from "./list-item.controller";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [DatabaseModule],
  providers: [ListItemService],
  controllers: [ListItemController],
  exports: [ListItemService],
})
export class ListItemModule {}
