import { FieldType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEmail, IsString, IsNotEmpty, MinLength,MaxLength, isIn, isString, IsIn, IsBoolean, isNotEmpty, IsBooleanString, isBoolean, ValidateNested, IsArray, IsNumber, IsNotEmptyObject, IsInt, ArrayNotEmpty, ArrayMinSize, IsEmpty, IsOptional } from 'class-validator';



export class CreateFieldDto {

    @IsNotEmpty()
    @IsString()
    public name: string;

    @IsNotEmpty()
    @IsIn(["STRING", "INT", "NUMBER", "FLOAT", "BOOLEAN", "DATE", "JSON", "INTEGER"])
    public type: FieldType;


    @IsBoolean()
    @IsOptional()
    public isRequired?: boolean;
}
export class AddColumnTableDto {

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateFieldDto)
    fields: CreateFieldDto[];
}



export class DropColumnTableDto {

    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsString({ each: true })  
    fields: string[];
}