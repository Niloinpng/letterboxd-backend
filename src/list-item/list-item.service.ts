import {
 Injectable,
 NotFoundException, 
 ConflictException } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { CreateListItemDto } from "./dto/create-list-item.dto";
import { UpdateListItemDto } from "./dto/update-list-item.dto";
import { IListItem } from "./interfaces/list-item.interface";

@Injectable()
export class ListItemService {
  constructor(private readonly databaseService: DatabaseService) {}

  private async findOne(id: number): Promise<IListItem> {
    const connection = this.databaseService.getConnection();
    const query = `SELECT * FROM List_Items WHERE id = ?`;

    const [listItems] = await connection.query(query, [id]);
    const listItem = (listItems as any[])[0];

    if (!listItem) {
      throw new NotFoundException("Item da lista não encontrado.");
    }

    return listItem;
  }

  async create(createListItemDto: CreateListItemDto): Promise<IListItem> {
    const connection = this.databaseService.getConnection();

    // Verifica se já existe esse media_id na mesma list_id
    const [existing] = await connection.query(
      "SELECT id FROM List_Items WHERE list_id = ? AND media_id = ?",
      [createListItemDto.list_id, createListItemDto.media_id]
    );

    if ((existing as any[]).length > 0) {
      throw new ConflictException("Este item já está na lista.");
    }

    const query = `INSERT INTO List_Items (list_id, media_id, status) VALUES (?, ?, ?)`;

    const [result] = await connection.query(query, [
      createListItemDto.list_id,
      createListItemDto.media_id,
      createListItemDto.status,
    ]);

    return this.findOne((result as any).insertId);
  }

  async getAll(): Promise<IListItem[]> {
    const connection = this.databaseService.getConnection();
    const query = `SELECT * FROM List_Items`;

    const [listItems] = await connection.query(query);
    return listItems as IListItem[];
  }

  async getById(id: number): Promise<IListItem> {
    return this.findOne(id);
  }

  async update(id: number, updateListItemDto: UpdateListItemDto): Promise<IListItem> {
    const connection = this.databaseService.getConnection();

    // Verifica se o item existe
    await this.findOne(id);

    // Monta query dinâmica
    const updates: string[] = [];
    const values: any[] = [];

    for (const [key, value] of Object.entries(updateListItemDto)) {
      if (value !== undefined) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (updates.length === 0) {
      return this.getById(id);
    }

    const query = `UPDATE List_Items SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

    await connection.query(query, [...values, id]);
    return this.getById(id);
  }

  async remove(id: number): Promise<string> {
    const connection = this.databaseService.getConnection();

    // Verifica se o item existe
    await this.findOne(id);

    const query = `DELETE FROM List_Items WHERE id = ?`;
    await connection.query(query, [id]);

    return "Item removido da lista com sucesso!";
  }
}
