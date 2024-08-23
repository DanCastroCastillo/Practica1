import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Author } from '../../authors/entities/author.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  isbn: string;

  @Column()
  publisher: string;

  @Column({ type: 'int' })
  publication_year: number;

  @Column()
  genre: string;

  @ManyToOne(() => Author, author => author.books)
  author: Author;
}
