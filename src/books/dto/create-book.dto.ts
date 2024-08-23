import { IsInt, IsNotEmpty, IsOptional, IsString, IsPositive, IsDateString } from 'class-validator';

export class CreateBookDto {
    @IsNotEmpty({ message: "El título no puede estar vacío" })
    @IsString({ message: "El título debe ser una cadena de texto" })
    title: string;

    @IsNotEmpty({ message: "El ISBN no puede estar vacío" })
    @IsString({ message: "El ISBN debe ser una cadena de texto" })
    isbn: string;

    @IsNotEmpty({ message: "La editorial no puede estar vacía" })
    @IsString({ message: "La editorial debe ser una cadena de texto" })
    publisher: string;

    @IsNotEmpty({ message: "El año de publicación no puede estar vacío" })
    @IsInt({ message: "El año de publicación debe ser un número entero" })
    @IsPositive({ message: "El año de publicación debe ser positivo" })
    publication_year: number;

    @IsNotEmpty({ message: "El género no puede estar vacío" })
    @IsString({ message: "El género debe ser una cadena de texto" })
    genre: string;

    @IsNotEmpty({ message: 'El identificador del autor no puede estar vacío' })
    @IsInt({ message: 'El identificador del autor debe ser un número entero' })
    author_id: number;

    @IsOptional() 
    @IsDateString({}, { message: "La fecha de creación debe ser una fecha válida" })
    created_at?: string;

    @IsOptional() 
    @IsDateString({}, { message: "La fecha de actualización debe ser una fecha válida" })
    updated_at?: string;
}
