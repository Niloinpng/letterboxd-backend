import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UnauthorizedException,
} from "@nestjs/common";
import { ReviewService } from "./review.service";
import { IReview } from "./interfaces/review.interface";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { CurrentUser } from "src/auth/decorators/currentUser.decorator";
import { IUserFeed } from "./interfaces/feed.interface";

@Controller("review")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  async getAll(): Promise<IReview[]> {
    return this.reviewService.getAll();
  }

  @Get(":id")
  async getById(@Param("id") id: number): Promise<IReview> {
    return this.reviewService.getById(id);
  }

  @Post()
  async create(@Body() createReviewDto: CreateReviewDto): Promise<IReview> {
    return this.reviewService.create(createReviewDto);
  }

  @Patch(":id")
  async update(
    @Param("id") id: number,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<IReview> {
    return this.reviewService.update(id, updateReviewDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: number): Promise<string> {
    return this.reviewService.remove(id);
  }

  @Get("user/:id/feed")
  async getUserFeed(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser("id") userId: string,
  ): Promise<IUserFeed[]> {
    if (id !== +userId) {
      throw new UnauthorizedException("You can't view another user's feed.");
    }
    return this.reviewService.getUserFeed(id);
  }
}
