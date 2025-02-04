import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { List } from "../list/list.entity";
import { OneToMany } from "typeorm";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: "text" })
  bio: string;

  @Column({ type: "blob", nullable: true })
  profile_picture: Buffer;

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
  @OneToMany(() => List, (list) => list.user)
  lists: List[];
}
