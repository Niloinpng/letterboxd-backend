import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "./user/user.module";
import { DatabaseModule } from "./database/database.module";
import { DatabaseService } from "./database/database.service";
import { AppService } from "./app.service";
import { AppController } from "./app.controller";
import { FollowModule } from './follow/follow.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, DatabaseModule, FollowModule],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
