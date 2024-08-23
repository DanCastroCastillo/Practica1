import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAuthorDto {
    @IsNotEmpty({ message: "El nombre no puede ser un valor vacío" })
    @IsString({ message: "El nombre debe ser una cadena de texto" })
    name: string;

    @IsNotEmpty({ message: "La nacionalidad no puede estar vacía" })
    @IsString({ message: "La nacionalidad debe ser una cadena de texto" })
    nationality: string;

    @IsNotEmpty({ message: "La fecha de nacimiento no puede estar vacía" })
    @IsDateString({}, { message: "La fecha de nacimiento debe ser una fecha válida" })
    birth_date?: string;

    @IsNotEmpty({ message: "La La fecha de creación no puede estar vacía" })
    @IsDateString({}, { message: "La fecha de creación debe ser una fecha válida" })
    created_at?: string;

    @IsOptional()
    @IsDateString({}, { message: "La fecha de actualización debe ser una fecha válida" })
    updated_at?: string;

}
