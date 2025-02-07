import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Body,
  HttpCode,
  UnauthorizedException,
} from "@nestjs/common";
import { LikesService } from "./likes.service";
import { CreateLikeDto } from "./dto/create-like.dto";
import { CurrentUser } from "src/auth/decorators/currentUser.decorator";

@Controller("likes")
export class LikesController {
  constructor(private readonly likeService: LikesService) {}

  @Post()
  create(@Body() createLikeDto: CreateLikeDto) {
    return this.likeService.create(createLikeDto);
  }

  @Delete(":userId/:reviewId")
  @HttpCode(204)
  remove(
    @Param("userId") userId: string,
    @Param("reviewId") reviewId: string,
    @CurrentUser("id") currentUserId: string,
  ) {
    if (userId !== currentUserId) {
      throw new UnauthorizedException("You can't delete another user's likes.");
    }
    return this.likeService.remove(+userId, +reviewId);
  }

  @Get("review/:reviewId")
  getReviewLikes(@Param("reviewId") reviewId: string) {
    return this.likeService.getReviewLikes(+reviewId);
  }

  @Get("review/:reviewId/count")
  getReviewLikeCount(@Param("reviewId") reviewId: string) {
    return this.likeService.getReviewLikeCount(+reviewId);
  }

  @Get("user/:userId")
  getUserLikedReviews(@Param("userId") userId: string) {
    return this.likeService.getUserLikedReviews(+userId);
  }

  @Get(":userId/:reviewId/status")
  hasUserLiked(
    @Param("userId") userId: string,
    @Param("reviewId") reviewId: string,
  ) {
    return this.likeService.hasUserLiked(+userId, +reviewId);
  }
}
