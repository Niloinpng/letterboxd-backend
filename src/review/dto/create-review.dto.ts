import { PickType } from "@nestjs/swagger";
import { Review } from "../entities/review.entity";

export class CreateReviewDto extends PickType(Review, [
  "user_id",
  "media_id",
  "rating",
  "content",
]) {}