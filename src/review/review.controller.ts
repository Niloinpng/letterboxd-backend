import { Controller, Get, Post, Patch, Delete, Param, Body } from "@nestjs/common";
import { ReviewService } from "./review.service";
import { IReview } from "./interfaces/review.interface";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";

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
  async update(@Param("id") id: number, @Body() updateReviewDto: UpdateReviewDto): Promise<IReview> {
    return this.reviewService.update(id, updateReviewDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: number): Promise<string> {
    return this.reviewService.remove(id);
  }
}