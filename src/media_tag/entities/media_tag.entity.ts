import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Media } from "src/media/entities/media.entity";


@Entity("media_tags")
export class MediaTag {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Media, (media) => media.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "media_id" })
  media: Media;

  @Column({ type: "bigint" })
  tag_id: number;
}