import { Field, TypeDatabase } from '@prisma/client';
import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength, isString, isNotEmpty, IsIn, ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { CreateFieldDto } from './fields.dto';
import { Type } from 'class-transformer';


export class CreateTableDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(32)
    public name: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateFieldDto)
    fields: CreateFieldDto[];

}