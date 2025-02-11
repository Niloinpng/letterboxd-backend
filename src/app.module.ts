import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "./user/user.module";
import { ListModule } from "./list/list.module";
import { ListItemModule } from "./list-item/list-item.module";
import { MediaModule } from "./media/media.module";
import { DatabaseModule } from "./database/database.module";
import { DatabaseService } from "./database/database.service";
import { AppService } from "./app.service";
import { AppController } from "./app.controller";
import { FollowModule } from "./follow/follow.module";
import { LikesModule } from "./likes/likes.module";
import { ReviewModule } from "./review/review.module";
import { AuthModule } from "./auth/auth.module";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./auth/guards/auth.guard";
import { JwtModule } from "@nestjs/jwt";
import { ReviewModule } from "./review/review.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    DatabaseModule,
    FollowModule,
    LikesModule,
    AuthModule,
    ListModule,
    ListItemModule,
    MediaModule,
    JwtModule,
    ReviewModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    DatabaseService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
