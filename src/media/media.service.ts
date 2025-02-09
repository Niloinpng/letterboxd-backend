import {
    Injectable,
    NotFoundException,
  } from "@nestjs/common";
  import { DatabaseService } from "../database/database.service";
  import { CreateMediaDto } from "../media/dto/create-media.dto";
  import { UpdateMediaDto } from "../media/dto/update-media.dto";
  import { IMedia } from "./interfaces/media.interface";
  
  @Injectable()
  export class MediaService {
    constructor(private readonly databaseService: DatabaseService) {}
  
    private async findOne(title: string): Promise<IMedia & { average_rating: number }> {
      const connection = this.databaseService.getConnection();
      const query = `
        SELECT Media.*, COALESCE(AVG(Review.rating), 0) AS average_rating 
        FROM Media 
        LEFT JOIN Review ON Media.id = Review.media_id 
        WHERE Media.title = ?
        GROUP BY Media.id
      `;
      
      const [mediaItems] = await connection.query(query, [title]);
      const media = (mediaItems as any[])[0];
  
      if (!media) {
        throw new NotFoundException("Media not found.");
      }
  
      return media;
    }
  
    async getAll(): Promise<IMedia[]> {
      const connection = this.databaseService.getConnection();
      const query = `
        SELECT Media.*, COALESCE(AVG(Review.rating), 0) AS average_rating 
        FROM Media 
        LEFT JOIN Review ON Media.id = Review.media_id 
        GROUP BY Media.id
      `;
      
      const [mediaItems] = await connection.query(query);
      return mediaItems as IMedia[];
    }
  
    async getByTitle(title: string): Promise<IMedia & { average_rating: number }> {
      return this.findOne(title);
    }
  
    async update(title: string, updateMediaDto: UpdateMediaDto): Promise<IMedia> {
      const connection = this.databaseService.getConnection();
      await this.findOne(title);
  
      const updates: string[] = [];
      const values: any[] = [];
  
      for (const [key, value] of Object.entries(updateMediaDto)) {
        if (value !== undefined) {
          updates.push(`${key} = ?`);
          values.push(value);
        }
      }
  
      if (updates.length === 0) {
        return this.getByTitle(title);
      }
  
      const query = `
        UPDATE Media 
        SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP
        WHERE title = ?
      `;
  
      await connection.query(query, [...values, title]);
      return this.getByTitle(title);
    }
  
    async remove(title: string): Promise<string> {
      const connection = this.databaseService.getConnection();
      await this.findOne(title);
      
      const query = `DELETE FROM Media WHERE title = ?`;
      await connection.query(query, [title]);
      
      return "Mídia deletada com sucesso!";
    }
  }