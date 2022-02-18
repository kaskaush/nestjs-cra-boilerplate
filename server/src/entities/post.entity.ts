import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'posts' })
export default class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;
}
