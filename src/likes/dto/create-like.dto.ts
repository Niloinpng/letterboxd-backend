import { PickType } from "@nestjs/mapped-types";
import { Like } from "../entities/like.entity";

export class CreateLikeDto extends PickType(Like, ["user_id", "review_id"]) {}
