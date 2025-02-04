import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiTags } from "@nestjs/swagger";
import { IUser } from "./interfaces/user.interface";

@ApiTags("users")
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<IUser> {
    return this.userService.create(createUserDto);
  }

  @Get()
  async getAll(): Promise<IUser[]> {
    return this.userService.getAll();
  }

  @Get(":id")
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
  ): Promise<IUser> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.userService.remove(id);
  }
}
