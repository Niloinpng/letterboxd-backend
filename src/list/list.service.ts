import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { List } from "./list.entity";

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List)
    private listRepository: Repository<List>,
  ) {}

  async findAll(): Promise<List[]> {
    return this.listRepository.find({ relations: ["user"] });
  }

  async findOne(id: number): Promise<List | null> {
    return this.listRepository.findOne({ where: { id }, relations: ["user"] });
  }

  async create(listData: Partial<List>): Promise<List> {
    const list = this.listRepository.create(listData);
    return this.listRepository.save(list);
  }

  async update(id: number, listData: Partial<List>): Promise<void> {
    await this.listRepository.update(id, listData);
  }

  async remove(id: number): Promise<void> {
    await this.listRepository.delete(id);
  }
}
