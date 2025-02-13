import { Injectable, NotFoundException } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { CreateMediaDto } from "../media/dto/create-media.dto";
import { UpdateMediaDto } from "../media/dto/update-media.dto";
import { IMedia } from "./interfaces/media.interface";
import { FileUploadDto } from "src/images/types/image.types";
import { ImageUtils } from "src/images/utils/image.utils";
import { CreateMediaWithTagsDto } from "./dto/create-media-with-tags.dto";
import { ITag } from "./interfaces/tag.interface";

@Injectable()
export class MediaService {
  constructor(private readonly databaseService: DatabaseService) {}

  private async findOne(
    id: number,
  ): Promise<IMedia & { average_rating: number }> {
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

    return (mediaItems as (IMedia & { average_rating?: number })[]).map(
      (media) => ({
        ...media,
        average_rating: media.average_rating ?? 0, // Garante um número válido
      }),
    );
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

  async getAllTags(): Promise<ITag[]> {
    const connection = this.databaseService.getConnection();
    const query = `SELECT * FROM tag ORDER BY name`;
    const [tags] = await connection.query(query);
    return tags as ITag[];
  }

  async createMediaWithTagsAndList(
    createDto: CreateMediaWithTagsDto,
  ): Promise<IMedia> {
    const connection = this.databaseService.getConnection();

    // Iniciar transação
    await connection.beginTransaction();

    try {
      // 1. Criar a mídia
      const mediaQuery = `
        INSERT INTO Media (title, type, description, release_date, cover_url) 
        VALUES (?, ?, ?, ?, ?)
      `;
      const mediaValues = [
        createDto.title,
        createDto.type,
        createDto.description,
        createDto.release_date,
        createDto.cover_url,
      ];

      const [mediaResult]: any = await connection.query(
        mediaQuery,
        mediaValues,
      );
      const mediaId = mediaResult.insertId;

      // 2. Processar as tags
      for (const tagName of createDto.tags) {
        // Verificar se a tag existe
        const [existingTags]: any = await connection.query(
          "SELECT id FROM tag WHERE name = ?",
          [tagName],
        );

        let tagId: number;

        if (existingTags.length === 0) {
          // Criar nova tag
          const [newTag]: any = await connection.query(
            "INSERT INTO tag (name) VALUES (?)",
            [tagName],
          );
          tagId = newTag.insertId;
        } else {
          tagId = existingTags[0].id;
        }

        // Criar relação media_tags
        await connection.query(
          "INSERT INTO media_tags (media_id, tag_id) VALUES (?, ?)",
          [mediaId, tagId],
        );
      }

      // 3. Adicionar à lista se listId foi fornecido
      if (createDto.listId) {
        await connection.query(
          "INSERT INTO list_items (list_id, media_id, status) VALUES (?, ?, ?)",
          [createDto.listId, mediaId, "PENDENTE"],
        );
      }

      // Commit da transação
      await connection.commit();

      // Retornar a mídia criada com suas informações completas
      return this.getById(mediaId);
    } catch (error) {
      // Rollback em caso de erro
      await connection.rollback();
      throw error;
    }
  }

  async getMediaWithTags(id: number): Promise<IMedia & { tags: string[] }> {
    const connection = this.databaseService.getConnection();
    const query = `
      SELECT m.*, 
             GROUP_CONCAT(t.name) as tag_names
      FROM Media m
      LEFT JOIN media_tags mt ON m.id = mt.media_id
      LEFT JOIN tag t ON mt.tag_id = t.id
      WHERE m.id = ?
      GROUP BY m.id
    `;

    const [mediaItems] = await connection.query(query, [id]);
    const media = (mediaItems as any[])[0];

    if (!media) {
      throw new NotFoundException("Mídia não encontrada");
    }

    return {
      ...media,
      tags: media.tag_names ? media.tag_names.split(",") : [],
    };
  }

  async getAllMediaWithTags(): Promise<(IMedia & { tags: string[] })[]> {
    const connection = this.databaseService.getConnection();
    const query = `
      SELECT m.*, 
             GROUP_CONCAT(t.name) as tag_names
      FROM Media m
      LEFT JOIN media_tags mt ON m.id = mt.media_id
      LEFT JOIN tag t ON mt.tag_id = t.id
      GROUP BY m.id
    `;

    const [mediaItems] = await connection.query(query);
    return (mediaItems as any[]).map((media) => ({
      ...media,
      tags: media.tag_names ? media.tag_names.split(",") : [],
    }));
  }

  // Images related methods
  async updateCoverImage(id: number, file: FileUploadDto): Promise<void> {
    // First, verify the media exists
    await this.findOne(id);

    const connection = this.databaseService.getConnection();

    // Process and validate the image
    const imageBuffer = await ImageUtils.validateAndProcessImage(file);

    const query = `
      UPDATE Media 
      SET cover_url = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    try {
      await connection.query(query, [imageBuffer, id]);
    } catch (error) {
      throw new Error(`Failed to update cover image: ${error.message}`);
    }
  }

  async getCoverImage(id: number): Promise<string | null> {
    const connection = this.databaseService.getConnection();

    const query = `
      SELECT cover_url 
      FROM Media 
      WHERE id = ?
    `;

    const [result] = await connection.query(query, [id]);
    const media = (result as any[])[0];

    if (!media || !media.cover_url) {
      return null;
    }

    return ImageUtils.bufferToBase64(media.cover_url);
  }
}
