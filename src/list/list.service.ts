import { Injectable, NotFoundException } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { CreateListDto } from "./dto/create-list.dto";
import { UpdateListDto } from "./dto/update-list.dto";
import { IList } from "./interfaces/list.interface";

@Injectable()
export class ListService {
  constructor(private readonly databaseService: DatabaseService) {}

  private async findOne(id: number): Promise<IList> {
    const connection = this.databaseService.getConnection();
    const query = `
      SELECT id, user_id, name, description, created_at, updated_at 
      FROM List 
      WHERE id = ?
    `; // 🔹 Removido "deleted_at"

    const [lists] = await connection.query(query, [id]);
    const list = (lists as any[])[0];

    if (!list) {
      throw new NotFoundException("Lista não encontrada.");
    }

    return list;
  }

  async create(createListDto: CreateListDto): Promise<IList> {
    const connection = this.databaseService.getConnection();
    const query = `
      INSERT INTO List (user_id, name, description) 
      VALUES (?, ?, ?)
    `;

    const [result] = await connection.query(query, [
      createListDto.user_id,
      createListDto.name,
      createListDto.description || null,
    ]);

    return this.findOne((result as any).insertId);
  }

  async getAll(): Promise<IList[]> {
    const connection = this.databaseService.getConnection();
    const query = `
      SELECT id, user_id, name, description, created_at, updated_at
      FROM List
    `; // 🔹 Removido "deleted_at"

    const [lists] = await connection.query(query);
    return lists as IList[];
  }

  async getById(id: number): Promise<IList> {
    return this.findOne(id);
  }

  async getByUserId(user_id: number): Promise<IList[]> {
    const connection = this.databaseService.getConnection();
    const query = `
      SELECT id, user_id, name, description, created_at, updated_at 
      FROM List
      WHERE user_id = ?
    `; // 🔹 Removido "deleted_at"

    const [lists] = await connection.query(query, [user_id]);

    if ((lists as any[]).length === 0) {
      throw new NotFoundException("Nenhuma lista encontrada para este usuário.");
    }

    return lists as IList[];
  }

  async update(id: number, updateListDto: UpdateListDto): Promise<IList> {
    const connection = this.databaseService.getConnection();

    // Verifica se a lista existe
    await this.findOne(id);

    // Constrói query dinâmica para atualização
    const updates: string[] = [];
    const values: any[] = [];

    for (const [key, value] of Object.entries(updateListDto)) {
      if (value !== undefined) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (updates.length === 0) {
      return this.getById(id);
    }

    const query = `
      UPDATE List 
      SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await connection.query(query, [...values, id]);
    return this.getById(id);
  }

  async remove(id: number): Promise<string> {
    const connection = this.databaseService.getConnection();

    // Verifica se a lista existe
    await this.findOne(id);

    const query = `
      DELETE FROM List
      WHERE id = ?;
    `;
    await connection.query(query, [id]);

    return "Lista deletada com sucesso!";
  }
  async getByUserId(user_id: number): Promise<IList[]> {
    const connection = this.databaseService.getConnection();
    const query = `
      SELECT id, user_id, name, description, created_at, updated_at
      FROM List
      WHERE user_id = ?
    `;
    const [lists] = await connection.query(query, [user_id]);
    if ((lists as any[]).length === 0) {
      throw new NotFoundException(
        "Nenhuma lista encontrada para este usuário.",
      );
    }
    return lists as IList[];
  }
}
