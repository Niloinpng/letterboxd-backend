import { PickType } from "@nestjs/swagger";
import { Follow } from "../entities/follow.entity";

export class CreateFollowDto extends PickType(Follow, [
  "follower_id",
  "followed_id",
]) {}
