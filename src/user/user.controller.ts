import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.entity";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.userService.findOne(id);
  }

  @Post()
  create(@Body() userData: Partial<User>) {
    return this.userService.create(userData);
  }

  @Put(":id")
  update(@Param("id") id: number, @Body() userData: Partial<User>) {
    return this.userService.update(id, userData);
  }

  @Delete(":id")
  remove(@Param("id") id: number) {
    return this.userService.remove(id);
  }
}
