import {
  Injectable,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { CreateLikeDto } from "./dto/create-like.dto";
import { Like } from "./entities/like.entity";

@Injectable()
export class LikesService {
  constructor(private readonly databaseService: DatabaseService) {}

  // Creates a new like
  async create(createLikeDto: CreateLikeDto): Promise<Like> {
    const connection = this.databaseService.getConnection();

    // Verify if review exists
    const [review] = await connection.query(
      "SELECT id FROM Review WHERE id = ?",
      [createLikeDto.review_id],
    );

    if ((review as any[]).length === 0) {
      throw new NotFoundException("Review not found.");
    }

    // Check if user already liked this review
    const [existing] = await connection.query(
      "SELECT id FROM `Like` WHERE user_id = ? AND review_id = ?",
      [createLikeDto.user_id, createLikeDto.review_id],
    );

    if ((existing as any[]).length > 0) {
      throw new ConflictException("User already liked this review.");
    }

    // Create like
    const [result] = await connection.query(
      "INSERT INTO `Like` (user_id, review_id) VALUES (?, ?)",
      [createLikeDto.user_id, createLikeDto.review_id],
    );

    return this.findOne((result as any).insertId);
  }

  // Removes a like
  async remove(userId: number, reviewId: number): Promise<void> {
    const connection = this.databaseService.getConnection();

    const [result] = await connection.query(
      "DELETE FROM `Like` WHERE user_id = ? AND review_id = ?",
      [userId, reviewId],
    );

    if ((result as any).affectedRows === 0) {
      throw new NotFoundException("Like not found.");
    }
  }

  // Finds a specific like by its ID (probaly not needed)
  async findOne(id: number): Promise<Like> {
    const connection = this.databaseService.getConnection();

    const [likes] = await connection.query(
      "SELECT * FROM `Like` WHERE id = ?",
      [id],
    );

    const like = (likes as any[])[0];

    if (!like) {
      throw new NotFoundException("Like not found.");
    }

    return like as Like;
  }

  // Gets all likes for a specific review
  async getReviewLikes(reviewId: number): Promise<any[]> {
    const connection = this.databaseService.getConnection();

    const query = `
      SELECT 
        l.id,
        l.created_at,
        u.id as user_id,
        u.name,
        u.username,
        u.profile_picture
      FROM \`Like\` l
      INNER JOIN User u ON l.user_id = u.id
      WHERE l.review_id = ?
      ORDER BY l.created_at DESC
    `;

    const [likes] = await connection.query(query, [reviewId]);
    return likes as any[];
  }

  // Gets like count for a specific review (this coulde be a procedure)
  async getReviewLikeCount(reviewId: number): Promise<number> {
    const connection = this.databaseService.getConnection();

    const [result] = await connection.query(
      "SELECT COUNT(*) as count FROM `Like` WHERE review_id = ?",
      [reviewId],
    );

    return (result as any[])[0].count;
  }

  // Gets all reviews liked by a user (maybe can be used at user profile)
  async getUserLikedReviews(userId: number): Promise<any[]> {
    const connection = this.databaseService.getConnection();

    const query = `
        SELECT 
          r.id as review_id,
          r.rating,
          r.content,
          r.created_at as review_created_at,
          u.id as reviewer_id,
          u.name as reviewer_name,
          u.username as reviewer_username,
          u.profile_picture as reviewer_profile_picture,
          m.id as media_id,
          m.title as media_title,
          m.type as media_type,
          m.cover_url as media_cover_url,
          l.created_at as liked_at
        FROM \`Like\` l
        INNER JOIN Review r ON l.review_id = r.id
        INNER JOIN User u ON r.user_id = u.id
        INNER JOIN Media m ON r.media_id = m.id
        WHERE l.user_id = ?
        ORDER BY l.created_at DESC
      `;

    const [likedReviews] = await connection.query(query, [userId]);
    return likedReviews as any[];
  }

  // Checks if a user has liked a specific review (probaly not needed)
  async hasUserLiked(userId: number, reviewId: number): Promise<boolean> {
    const connection = this.databaseService.getConnection();

    const [result] = await connection.query(
      "SELECT id FROM `Like` WHERE user_id = ? AND review_id = ?",
      [userId, reviewId],
    );

    return (result as any[]).length > 0;
  }
}
