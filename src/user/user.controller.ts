import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UnauthorizedException,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiTags } from "@nestjs/swagger";
import { IUser } from "./interfaces/user.interface";
import { CurrentUser } from "src/auth/decorators/currentUser.decorator";
import { Public } from "src/auth/decorators/isPublic.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileUploadDto } from "src/images/types/image.types";

@ApiTags("users")
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<IUser> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Public()
  async getAll(): Promise<IUser[]> {
    return this.userService.getAll();
  }

  @Get(":id")
  @Public()
  async getById(@Param("id", ParseIntPipe) id: number): Promise<IUser> {
    return this.userService.getById(id);
  }

  @Get("email/:email")
  async getByEmail(@Param("email") email: string): Promise<IUser> {
    return this.userService.getByEmail(email);
  }

  @Get("username/:username")
  async getByUsername(@Param("username") username: string): Promise<IUser> {
    return this.userService.getByUsername(username);
  }

  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser("id") userId: string,
  ): Promise<IUser> {
    if (id !== +userId) {
      throw new UnauthorizedException(
        "You can't update another user's profile.",
      );
    }
    return this.userService.update(id, updateUserDto);
  }

  @Delete(":id")
  async remove(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser("id") userId: string,
  ): Promise<string> {
    if (id !== +userId) {
      throw new UnauthorizedException(
        "You can't delete another user's profile.",
      );
    }
    return this.userService.remove(id);
  }

  @Post(":id/profile-picture")
  @UseInterceptors(FileInterceptor("image"))
  async uploadProfilePicture(
    @Param("id") id: number,
    @UploadedFile() file: FileUploadDto,
  ) {
    return this.userService.updateProfilePicture(id, file);
  }

  @Get(":id/profile-picture")
  async getProfilePicture(@Param("id") id: number) {
    return this.userService.getProfilePicture(id);
  }
}
