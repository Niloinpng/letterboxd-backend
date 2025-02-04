import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "src/user/user.entity";

@Entity("list")
export class List {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.lists, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" }) // Define o nome correto da coluna no banco
  user: User;

  @Column()
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at: Date;

  @Column({ type: "timestamp", nullable: true })
  deleted_at: Date | null;
}
