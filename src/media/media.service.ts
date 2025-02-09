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
  
    private async findOne(id: number): Promise<IMedia & { average_rating: number }> {
      const connection = this.databaseService.getConnection();
      const query = `
        SELECT Media.*, COALESCE(AVG(Review.rating), 0) AS average_rating 
        FROM Media 
        LEFT JOIN Review ON Media.id = Review.media_id 
        WHERE Media.id = ?
        GROUP BY Media.id
      `;
      
      const [mediaItems] = await connection.query(query, [id]);
      const media = (mediaItems as (IMedia & { average_rating?: number })[])[0];
  
      if (!media) {
        throw new NotFoundException("Media não encontrada.");
      }
  
      return {
        ...media,
        average_rating: media.average_rating ?? 0, // Garante que nunca será undefined
      };
    }
  
    async getAll(): Promise<(IMedia & { average_rating: number })[]> {
      const connection = this.databaseService.getConnection();
      const query = `
        SELECT Media.*, COALESCE(AVG(Review.rating), 0) AS average_rating 
        FROM Media 
        LEFT JOIN Review ON Media.id = Review.media_id 
        GROUP BY Media.id
      `;
      
      const [mediaItems] = await connection.query(query);
      
      return (mediaItems as (IMedia & { average_rating?: number })[]).map(media => ({
        ...media,
        average_rating: media.average_rating ?? 0, // Garante um número válido
      }));
    }
  
    async getById(id: number): Promise<IMedia & { average_rating: number }> {
      return this.findOne(id);
    }
  
    async create(createMediaDto: CreateMediaDto): Promise<IMedia> {
      const connection = this.databaseService.getConnection();
      const query = `
        INSERT INTO Media (title, type, description, release_date, cover_url) 
        VALUES (?, ?, ?, ?, ?)
      `;
      const values = [
        createMediaDto.title,
        createMediaDto.type,
        createMediaDto.description,
        createMediaDto.release_date,
        createMediaDto.cover_url,
      ];
  
      const [result]: any = await connection.query(query, values);
      
      return this.getById(result.insertId);
    }
  
    async update(id: number, updateMediaDto: UpdateMediaDto): Promise<IMedia> {
      const connection = this.databaseService.getConnection();
      await this.findOne(id);
  
      const updates: string[] = [];
      const values: any[] = [];
  
      for (const [key, value] of Object.entries(updateMediaDto)) {
        if (value !== undefined) {
          updates.push(`${key} = ?`);
          values.push(value);
        }
      }
  
      if (updates.length === 0) {
        return this.getById(id);
      }
  
      const query = `
        UPDATE Media 
        SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
  
      await connection.query(query, [...values, id]);
      return this.getById(id);
    }
  
    async remove(id: number): Promise<string> {
      const connection = this.databaseService.getConnection();
      await this.findOne(id);
      
      const query = `DELETE FROM Media WHERE id = ?`;
      await connection.query(query, [id]);
      
      return "Mídia deletada com sucesso!";
    }
  }