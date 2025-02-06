import {
  Injectable,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { CreateFollowDto } from "./dto/create-follow.dto";
import { Follow } from "./entities/follow.entity";

@Injectable()
export class FollowService {
  constructor(private readonly databaseService: DatabaseService) {}

  //Creates a new follow relationship between two users
  async follow(createFollowDto: CreateFollowDto): Promise<Follow> {
    const connection = this.databaseService.getConnection();

    // Verify if both users exist
    const [users] = await connection.query(
      "SELECT id FROM User WHERE id IN (?, ?)",
      [createFollowDto.follower_id, createFollowDto.followed_id],
    );

    if ((users as any[]).length !== 2) {
      throw new NotFoundException("One or both users not found.");
    }

    // Check if already following
    const [existing] = await connection.query(
      "SELECT id FROM Follow WHERE follower_id = ? AND followed_id = ?",
      [createFollowDto.follower_id, createFollowDto.followed_id],
    );

    if ((existing as any[]).length > 0) {
      throw new ConflictException("Already following this user.");
    }

    // Create follow relationship
    const query = `
      INSERT INTO Follow (follower_id, followed_id)
      VALUES (?, ?)
    `;

    const [result] = await connection.query(query, [
      createFollowDto.follower_id,
      createFollowDto.followed_id,
    ]);

    return this.findOne((result as any).insertId);
  }

  //removes a follow relationship between two users
  async unfollow(followerId: number, followedId: number): Promise<void> {
    const connection = this.databaseService.getConnection();

    const [result] = await connection.query(
      "DELETE FROM Follow WHERE follower_id = ? AND followed_id = ?",
      [followerId, followedId],
    );

    if ((result as any).affectedRows === 0) {
      throw new NotFoundException("Follow relationship not found.");
    }
  }

  //Finds a specific follow relationship by its ID
  async findOne(id: number): Promise<Follow> {
    const connection = this.databaseService.getConnection();
    const query = `
      SELECT * FROM Follow 
      WHERE id = ?
    `;

    const [follows] = await connection.query(query, [id]);
    const follow = (follows as any[])[0];

    if (!follow) {
      throw new NotFoundException("Follow relationship not found.");
    }

    return follow as Follow;
  }

  //Retrieves all followers of a specific user
  async getFollowers(userId: number): Promise<any[]> {
    const connection = this.databaseService.getConnection();
    const query = `
      SELECT u.id, u.name, u.username, u.bio, u.profile_picture, f.created_at as followed_since
      FROM Follow f
      INNER JOIN User u ON f.follower_id = u.id
      WHERE f.followed_id = ?
      ORDER BY f.created_at DESC
    `;

    const [followers] = await connection.query(query, [userId]);
    return followers as any[];
  }

  //retrieves all users that a specific user is following
  async getFollowing(userId: number): Promise<any[]> {
    const connection = this.databaseService.getConnection();
    const query = `
      SELECT u.id, u.name, u.username, u.bio, u.profile_picture, f.created_at as following_since
      FROM Follow f
      INNER JOIN User u ON f.followed_id = u.id
      WHERE f.follower_id = ?
      ORDER BY f.created_at DESC
    `;

    const [following] = await connection.query(query, [userId]);
    return following as any[];
  }

  //Retrieves the activity feed for a user showing reviews from followed users, ordered by 20 most recent
  async getFeed(userId: number): Promise<any[]> {
    const connection = this.databaseService.getConnection();
    const query = `
      SELECT 
        r.id as review_id,
        r.rating,
        r.content,
        r.created_at,
        u.id as user_id,
        u.name,
        u.username,
        u.profile_picture,
        m.id as media_id,
        m.title as media_title,
        m.type as media_type,
        m.cover_url,
        m.release_date
      FROM Follow f
      INNER JOIN Review r ON f.followed_id = r.user_id
      INNER JOIN User u ON r.user_id = u.id
      INNER JOIN Media m ON r.media_id = m.id
      WHERE f.follower_id = ?
      ORDER BY r.created_at DESC
      LIMIT 20
    `;

    const [feed] = await connection.query(query, [userId]);
    return feed as any[];
  }

  //checks if a follow relationship exists between two users
  async getFollowingStatus(
    followerId: number,
    followedId: number,
  ): Promise<boolean> {
    const connection = this.databaseService.getConnection();
    const [result] = await connection.query(
      "SELECT id FROM Follow WHERE follower_id = ? AND followed_id = ?",
      [followerId, followedId],
    );

    return (result as any[]).length > 0;
  }
}
