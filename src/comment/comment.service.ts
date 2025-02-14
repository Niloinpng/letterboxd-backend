import { Injectable, NotFoundException } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { Comment } from "./entities/comment.entity";

@Injectable()
export class CommentService {
  constructor(private readonly databaseService: DatabaseService) {}

  // Creates a new comment
  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const connection = this.databaseService.getConnection();
    const query = `
      INSERT INTO Comment (user_id, review_id, content)
      VALUES (?, ?, ?)
    `;

    const [result] = await connection.query(query, [
      createCommentDto.user_id,
      createCommentDto.review_id,
      createCommentDto.content,
    ]);

    return this.findOne((result as any).insertId);
  }

  // Retrieves all comments
  async findAll(): Promise<Comment[]> {
    const connection = this.databaseService.getConnection();
    const query = `SELECT * FROM Comment ORDER BY created_at DESC`;

    const [comments] = await connection.query(query);
    return comments as Comment[];
  }

  // Finds a specific comment by its ID
  async findOne(id: number): Promise<Comment> {
    const connection = this.databaseService.getConnection();
    const query = `SELECT * FROM Comment WHERE id = ?`;

    const [comments] = await connection.query(query, [id]);
    const comment = (comments as any[])[0];

    if (!comment) {
      throw new NotFoundException("Comment not found.");
    }

    return comment as Comment;
  }

  // Updates a comment
  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const connection = this.databaseService.getConnection();
    const query = `
      UPDATE Comment 
      SET content = ?
      WHERE id = ?
    `;

    const [result] = await connection.query(query, [
      updateCommentDto.content,
      id,
    ]);

    if ((result as any).affectedRows === 0) {
      throw new NotFoundException("Comment not found.");
    }

    return this.findOne(id);
  }

  // Deletes a comment
  async remove(id: number): Promise<void> {
    const connection = this.databaseService.getConnection();
    const query = `DELETE FROM Comment WHERE id = ?`;

    const [result] = await connection.query(query, [id]);

    if ((result as any).affectedRows === 0) {
      throw new NotFoundException("Comment not found.");
    }
  }
}
