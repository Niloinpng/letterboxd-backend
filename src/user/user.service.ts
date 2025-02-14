import {
  Injectable,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as bcrypt from "bcrypt";
import { IUser } from "./interfaces/user.interface";
import { User } from "./entities/user.entity";
import { ImageUtils } from "src/images/utils/image.utils";
import { FileUploadDto } from "src/images/types/image.types";
import { UserStatistics } from "./interfaces/user-statistics.interface";
import { RowDataPacket } from "mysql2";

interface UserStatisticsRow extends RowDataPacket {
  user_id: number;
  username: string;
  total_reviews: number;
  total_likes_given: number;
  total_likes_received: number;
  following_count: number;
  followers_count: number;
  average_rating: number | null;
  total_lists: number;
}

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  private async findOne(id: number): Promise<IUser & { password: string }> {
    const connection = this.databaseService.getConnection();
    const query = `
      SELECT * FROM User 
      WHERE id = ?
    `;

    const [users] = await connection.query(query, [id]);
    const user = (users as any[])[0];

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<IUser> {
    const connection = this.databaseService.getConnection();

    // Check email availability
    const [emailResults] = await connection.query(
      "SELECT id FROM User WHERE email = ?",
      [createUserDto.email],
    );

    if ((emailResults as any[]).length > 0) {
      throw new ConflictException("Email already in use.");
    }

    // Check username availability
    const [usernameResults] = await connection.query(
      "SELECT id FROM User WHERE username = ?",
      [createUserDto.username],
    );

    if ((usernameResults as any[]).length > 0) {
      throw new ConflictException("Username already in use.");
    }

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const query = `
      INSERT INTO User (name, username, email, password, bio, profile_picture)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await connection.query(query, [
      createUserDto.name,
      createUserDto.username,
      createUserDto.email,
      hashedPassword,
      createUserDto.bio,
      createUserDto.profile_picture,
    ]);

    const user = await this.findOne((result as any).insertId);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getAll(): Promise<IUser[]> {
    const connection = this.databaseService.getConnection();
    const query = `
      SELECT id, name, username, email, bio, profile_picture, created_at, updated_at 
      FROM User
    `;

    const [users] = await connection.query(query);
    return users as IUser[];
  }

  async getById(id: number): Promise<IUser> {
    const user = await this.findOne(id);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getByEmail(email: string): Promise<IUser> {
    const connection = this.databaseService.getConnection();
    const query = `
      SELECT * FROM User 
      WHERE email = ?
    `;

    const [users] = await connection.query(query, [email]);
    const user = (users as any[])[0];

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // For authentication purposes
  async getByUsername(username: string): Promise<User> {
    const connection = this.databaseService.getConnection();
    const query = `
      SELECT * FROM User 
      WHERE username = ?
    `;

    const [users] = await connection.query(query, [username]);
    const user = (users as any[])[0];

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<IUser> {
    const connection = this.databaseService.getConnection();

    // Verify user exists
    await this.findOne(id);

    // If email is being updated, check availability
    if (updateUserDto.email) {
      const [emailResults] = await connection.query(
        "SELECT id FROM User WHERE email = ? AND id != ?",
        [updateUserDto.email, id],
      );

      if ((emailResults as any[]).length > 0) {
        throw new ConflictException("Email already in use.");
      }
    }

    // If username is being updated, check availability
    if (updateUserDto.username) {
      const [usernameResults] = await connection.query(
        "SELECT id FROM User WHERE username = ? AND id != ?",
        [updateUserDto.username, id],
      );

      if ((usernameResults as any[]).length > 0) {
        throw new ConflictException("Username already in use.");
      }
    }

    // Build dynamic update query
    const updates: string[] = [];
    const values: any[] = [];

    for (const [key, value] of Object.entries(updateUserDto)) {
      if (value !== undefined) {
        if (key === "password") {
          const hashedPassword = await bcrypt.hash(value, 10);
          updates.push(`${key} = ?`);
          values.push(hashedPassword);
        } else {
          updates.push(`${key} = ?`);
          values.push(value);
        }
      }
    }

    if (updates.length === 0) {
      return this.getById(id);
    }

    const query = `
      UPDATE User 
      SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await connection.query(query, [...values, id]);
    return this.getById(id);
  }

  async remove(id: number): Promise<string> {
    const connection = this.databaseService.getConnection();

    // Verify user exists
    await this.findOne(id);

    const query = `
        DELETE FROM User
        WHERE id = ?;
    `;

    await connection.query(query, [id]);

    return "Usuário deletado com sucesso!";
  }

  // Profile picture methods
  async updateProfilePicture(id: number, file: FileUploadDto): Promise<void> {
    const connection = this.databaseService.getConnection();
    const imageBuffer = await ImageUtils.validateAndProcessImage(file);

    const query = `
      UPDATE User 
      SET profile_picture = ?, 
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await connection.query(query, [imageBuffer, id]);
  }

  async getProfilePicture(id: number): Promise<string | null> {
    const connection = this.databaseService.getConnection();
    const query = `
      SELECT profile_picture 
      FROM User 
      WHERE id = ?
    `;

    const [result] = await connection.query(query, [id]);
    const user = (result as any[])[0];

    if (!user || !user.profile_picture) {
      return null;
    }

    return ImageUtils.bufferToBase64(user.profile_picture);
  }

  async getUserStatistics(userId: number): Promise<UserStatistics> {
    const connection = this.databaseService.getConnection();

    const query = `
    SELECT * 
    FROM vw_user_statistics 
    WHERE user_id = ?
    `;

    // Tipando o resultado da query como um array de UserStatisticsRow
    const [rows] = await connection.query<UserStatisticsRow[]>(query, [userId]);

    // Verificando se temos resultados
    if (!rows || rows.length === 0) {
      throw new NotFoundException(
        `Statistics for user with ID ${userId} not found`,
      );
    }

    //o primeiro resultado já vem com os tipos corretos graças à interface
    const userStats = rows[0];

    // console.log(userStats);
    return userStats;
  }
}
