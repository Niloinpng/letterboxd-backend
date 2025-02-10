import { Injectable, NotFoundException } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { CreateMediaTagDto } from "./dto/create-media_tag.dto";
import { UpdateMediaTagDto } from "./dto/update-media_tag.dto";
import { IMediaTag } from "./interfaces/media_tag.interface";

@Injectable()
export class MediaTagService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAll(): Promise<IMediaTag[]> {
    const connection = this.databaseService.getConnection();
    const query = `SELECT * FROM MediaTag`;
    const [tags] = await connection.query(query);
    return tags as IMediaTag[];
  }

  async getById(id: number): Promise<IMediaTag> {
    const connection = this.databaseService.getConnection();
    const query = `SELECT * FROM MediaTag WHERE id = ?`;
    const [tags] = await connection.query(query, [id]);
    const tag = (tags as IMediaTag[])[0];
    if (!tag) throw new NotFoundException("Tag not found.");
    return tag;
  }

  async create(createMediaTagDto: CreateMediaTagDto): Promise<IMediaTag> {
    const connection = this.databaseService.getConnection();
    const query = `INSERT INTO MediaTag (tag, mediaId) VALUES (?, ?)`;
    const values = [createMediaTagDto.tag, createMediaTagDto.mediaId];
    const [result]: any = await connection.query(query, values);
    return this.getById(result.insertId);
  }

  async update(id: number, updateMediaTagDto: UpdateMediaTagDto): Promise<IMediaTag> {
    const connection = this.databaseService.getConnection();
    await this.getById(id);
    const updates: string[] = [];
    const values: any[] = [];

    for (const [key, value] of Object.entries(updateMediaTagDto)) {
      if (value !== undefined) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (updates.length === 0) return this.getById(id);

    const query = `UPDATE MediaTag SET ${updates.join(", ")} WHERE id = ?`;
    await connection.query(query, [...values, id]);
    return this.getById(id);
  }

  async remove(id: number): Promise<string> {
    const connection = this.databaseService.getConnection();
    await this.getById(id);
    const query = `DELETE FROM MediaTag WHERE id = ?`;
    await connection.query(query, [id]);
    return "Tag removida com sucesso!";
  }
}
