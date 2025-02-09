import { PickType } from "@nestjs/swagger";
import { Comment } from "../entities/comment.entity";

export class CreateCommentDto extends PickType(Comment, [
  "user_id",
  "review_id",
  "content",
]) {}
