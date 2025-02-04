import { PickType } from "@nestjs/swagger";
import { User } from "../entities/user.entity";

export class CreateUserDto extends PickType(User, [
  "name",
  "username",
  "email",
  "password",
  "bio",
  "profile_picture",
]) {}
