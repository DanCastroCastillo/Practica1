import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './entities/author.entity';
import { Book } from '../books/entities/book.entity';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private authorsRepository: Repository<Author>,
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}

  private async findOneOrFail(id: number, relations = false): Promise<Author> {
    const author = await this.authorsRepository.findOne({
      where: { id: id },
      relations: {
        books: relations ? true : false
      },
      select: {
        books: {
          id: true,
          title: true,
          publication_year: true,
          genre: true
        }
      }
    });
    if (!author) {
      throw new NotFoundException(`El autor con el Id ${id} no existe`);
    }
    return author;
  }

  async create(createAuthorDto: CreateAuthorDto): Promise<Author> {
    const existsAuthor = await this.authorsRepository.findOne({
      where: { name: createAuthorDto.name }
    });
    if (existsAuthor) {
      throw new ConflictException('El nombre del autor ya está registrado');
    }
    return this.authorsRepository.save(createAuthorDto);
  }

  async findAll(page = 1, limit = 10, relations = false): Promise<{ data: Author[]; total: number; page: number; limit: number }>  {
    const [data, total] = await this.authorsRepository.findAndCount({
      skip: page > 0 ? (page - 1) * limit : 0,
      take: limit,
      select: {
        id: true,
        name: true,
        nationality: true,
        birth_date: true,
        books: {
          id: true,
          title: true,
          publication_year: true,
          genre: true
        }
      },
      relations: {
        books: relations ? true : false
      }
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  findOne(id: number, relations: boolean): Promise<Author> {
    return this.findOneOrFail(id, relations);
  }

  async update(id: number, updateAuthorDto: UpdateAuthorDto): Promise<Author> {
    const author = await this.findOneOrFail(id);

    if (updateAuthorDto.name != null) {
      author.name = updateAuthorDto.name;
    }
    if (updateAuthorDto.nationality != null) {
      author.nationality = updateAuthorDto.nationality;
    }
    if (updateAuthorDto.birth_date != null) {
      author.birth_date = updateAuthorDto.birth_date;
    }

    return this.authorsRepository.save(author);
  }

  async remove(id: number, cascade: boolean) {
    const author = await this.findOneOrFail(id);
    if (cascade) {
      await this.booksRepository.delete({ author });
      return this.authorsRepository.delete(id);
    } else {
      const countBooks = await this.booksRepository.countBy({ id: id });
      if (countBooks > 0) {
        throw new ConflictException({ message: `El autor no se puede eliminar porque tiene ${countBooks} libros asociados` })
      } else {
        return this.authorsRepository.delete(id);
      }
    }
  }

  async findBooks(id: number): Promise<Book[]> {
    const author = await this.findOneOrFail(id, true);
    return author.books;
  }
}
