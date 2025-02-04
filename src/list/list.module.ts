import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { List } from "./list.entity";
import { ListService } from "./list.service";
import { ListController } from "./list.controller";

@Module({
  imports: [TypeOrmModule.forFeature([List])],
  providers: [ListService],
  controllers: [ListController],
  exports: [ListService],
})
export class ListModule {}
