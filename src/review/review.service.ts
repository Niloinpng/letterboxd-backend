import { Injectable, NotFoundException } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { CreateReviewDto } from "../review/dto/create-review.dto";
import { UpdateReviewDto } from "../review/dto/update-review.dto";
import { IReview } from "./interfaces/review.interface";
import { IUserFeed } from "./interfaces/feed.interface";
import { IUserReviewsFeed } from "./interfaces/user-reviews-feed";

@Injectable()
export class ReviewService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAll(): Promise<IReview[]> {
    const connection = this.databaseService.getConnection();
    const query = `SELECT * FROM Review`;
    const [reviews] = await connection.query(query);
    return reviews as IReview[];
  }

  async getById(id: number): Promise<IReview> {
    const connection = this.databaseService.getConnection();
    const query = `SELECT * FROM Review WHERE id = ?`;
    const [reviews] = await connection.query(query, [id]);
    const review = (reviews as IReview[])[0];
    if (!review) {
      throw new NotFoundException("Review not found.");
    }
    return review;
  }

  async create(createReviewDto: CreateReviewDto): Promise<IReview> {
    const connection = this.databaseService.getConnection();
    const query = `INSERT INTO Review (user_id, media_id, rating, content) VALUES (?, ?, ?, ?)`;
    const values = [
      createReviewDto.user_id,
      createReviewDto.media_id,
      createReviewDto.rating,
      createReviewDto.content,
    ];
    const [result] = await connection.query(query, values);
    return this.getById((result as any).insertId);
  }

  async update(id: number, updateReviewDto: UpdateReviewDto): Promise<IReview> {
    const connection = this.databaseService.getConnection();
    await this.getById(id);

    const updates: string[] = [];
    const values: any[] = [];

    for (const [key, value] of Object.entries(updateReviewDto)) {
      if (value !== undefined) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (updates.length === 0) {
      return this.getById(id);
    }

    const query = `UPDATE Review SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    await connection.query(query, [...values, id]);
    return this.getById(id);
  }

  async remove(id: number): Promise<string> {
    const connection = this.databaseService.getConnection();
    await this.getById(id);
    const query = `DELETE FROM Review WHERE id = ?`;
    await connection.query(query, [id]);
    return "Review deleted successfully!";
  }

  async getUserFeed(userId: number): Promise<IUserFeed[]> {
    const connection = this.databaseService.getConnection();

    //chama a procedure armazenada no banco de dados, com o id do usuário como parâmetro
    const [results] = await connection.query("CALL sp_user_feed(?)", [userId]);

    return results[0] as IUserFeed[];
  }

  async getUserReviewsFeed(userId: number): Promise<IUserReviewsFeed[]> {
    const connection = this.databaseService.getConnection();

    const [results] = await connection.query("CALL sp_user_reviews_feed(?)", [
      userId,
    ]);

    return results[0] as IUserReviewsFeed[];
  }
}
