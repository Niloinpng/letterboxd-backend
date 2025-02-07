import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UserService } from "../user/user.service";
import { LoginDto } from "./dto/login.dto";
import { UserPayload } from "./types/userPayload.type";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "src/user/dto/create-user.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    try {
      //search for user
      const user = await this.userService.getByUsername(loginDto.username);

      //check if password is valid
      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException("Username ou senha incorretos");
      }

      //JWT Payload
      const payload: UserPayload = {
        id: user.id.toString(),
        username: user.username,
      };

      // Gera o token JWT
      const token = await this.jwtService.signAsync(payload);

      return {
        access_token: token,
      };
    } catch (error) {
      //contempla tanto o NotFoundException do getByUsername (userService) quanto senhas inválidas
      throw new UnauthorizedException("Username ou senha incorretos");
    }
  }

  async signup(createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);

    const payload: UserPayload = {
      id: user.id.toString(),
      username: user.username,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
    };
  }
}
