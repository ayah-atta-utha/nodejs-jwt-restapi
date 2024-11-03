 
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { Category } from "./Category";

@Entity()
export class News {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @CreateDateColumn()
  publishedAt: Date;

  @ManyToOne(() => Category, (category) => category.news, { onDelete: "SET NULL" })
  category: Category;
}
