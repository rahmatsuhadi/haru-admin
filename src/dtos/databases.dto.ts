import { TypeDatabase } from '@prisma/client';
import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength, isString, isNotEmpty, IsIn } from 'class-validator';



export class CreateDatabaseDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(32)
    public projectName: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(32)
    public name: string;


    @IsString()
    @IsIn(["mysql", "mongodb"])
    public type: TypeDatabase;

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(100)
    public uri: string;
}