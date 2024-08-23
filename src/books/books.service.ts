import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { Author } from '../authors/entities/author.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    @InjectRepository(Author)
    private authorsRepository: Repository<Author>,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const author = await this.authorsRepository.findOne({ where: { id: createBookDto.author_id } });
    if (!author) {
      throw new NotFoundException(`Author with ID ${createBookDto.author_id} not found`);
    }
    
    const book = this.booksRepository.create({ ...createBookDto, author });
    return this.booksRepository.save(book);
  }

  async findAll(page = 1, limit = 10, relations = false): Promise<{ data: Book[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.booksRepository.findAndCount({
      skip: page > 0 ? (page - 1) * limit : 0,
      take: limit,
      relations: {
        author: relations ? true : false
      },
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number, relations: boolean): Promise<Book> {
    const book = await this.booksRepository.findOne({
      where: { id },
      relations: {
        author: relations ? true : false
      },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id, false);

    if (updateBookDto.title != null) {
      book.title = updateBookDto.title;
    }
    if (updateBookDto.isbn != null) {
      book.isbn = updateBookDto.isbn;
    }
    if (updateBookDto.publisher != null) {
      book.publisher = updateBookDto.publisher;
    }
    if (updateBookDto.publication_year != null) {
      book.publication_year = updateBookDto.publication_year;
    }
    if (updateBookDto.genre != null) {
      book.genre = updateBookDto.genre;
    }
    if (updateBookDto.author_id != null) {
      const author = await this.authorsRepository.findOne({ where: { id: updateBookDto.author_id } });
      if (!author) {
        throw new NotFoundException(`Author with ID ${updateBookDto.author_id} not found`);
      }
      book.author = author;
    }

    return this.booksRepository.save(book);
  }

  async remove(id: number, cascade: boolean) {
    const book = await this.booksRepository.findOne({ where: { id } });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    if (cascade) {
      // Optional: Implement cascading removal if needed
    }

    return this.booksRepository.delete(id);
  }

  async findAuthor(id: number): Promise<Author> {
    const book = await this.findOne(id, true);
    if (!book.author) {
      throw new NotFoundException(`Author not found for book with ID ${id}`);
    }
    return book.author;
  }
}
