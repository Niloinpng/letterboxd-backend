import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { FollowService } from "./follow.service";
import { CreateFollowDto } from "./dto/create-follow.dto";
import { Follow } from "./entities/follow.entity";

@ApiTags("follows")
@Controller("follows")
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post()
  async follow(@Body() createFollowDto: CreateFollowDto): Promise<Follow> {
    return this.followService.follow(createFollowDto);
  }

  @Delete(":followerId/unfollow/:followedId")
  async unfollow(
    @Param("followerId", ParseIntPipe) followerId: number,
    @Param("followedId", ParseIntPipe) followedId: number,
  ): Promise<void> {
    return this.followService.unfollow(followerId, followedId);
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number): Promise<Follow> {
    return this.followService.findOne(id);
  }

  @Get("user/:userId/followers")
  async getFollowers(
    @Param("userId", ParseIntPipe) userId: number,
  ): Promise<any[]> {
    return this.followService.getFollowers(userId);
  }

  @Get("user/:userId/following")
  async getFollowing(
    @Param("userId", ParseIntPipe) userId: number,
  ): Promise<any[]> {
    return this.followService.getFollowing(userId);
  }

  @Get("user/:userId/feed")
  async getFeed(@Param("userId", ParseIntPipe) userId: number): Promise<any[]> {
    return this.followService.getFeed(userId);
  }

  @Get(":followerId/status/:followedId")
  async getFollowingStatus(
    @Param("followerId", ParseIntPipe) followerId: number,
    @Param("followedId", ParseIntPipe) followedId: number,
  ): Promise<boolean> {
    return this.followService.getFollowingStatus(followerId, followedId);
  }
}
