import { Database, PrismaClient } from '@prisma/client';
import Container, { Service } from 'typedi';
import { HttpException } from '@/exceptions/HttpException';
import { CreateDatabaseDto } from '@/dtos/databases.dto';
import { ConnectionService } from './connection.service';
import { ModelService } from './model.service';

@Service()
export class DatabaseService {
    public db = new PrismaClient().database;
    public table = new PrismaClient().table;
    public column = new PrismaClient().field;
    public model = Container.get(ModelService);
    public connection = Container.get(ConnectionService);

    public async findAllDatabases(): Promise<Database[]> {
        const allDatabases: Database[] = await this.db.findMany();
        return allDatabases;
    }

    public async createDatabase(dbData: CreateDatabaseDto): Promise<Database> {

        if (dbData.type == "mysql") {
            await this.connection.createDatabaseMysql(dbData.name, dbData.uri)
        }
        else if (dbData.type == "mongodb") {
            await this.connection.createDatabaseMongo(dbData.name, dbData.uri)
        }

        const database: Database = await this.db.create({ data: dbData })
        return database
    }

    public async deleteDatabase(dbId: number): Promise<Database> {

        await this.column.deleteMany({ where: { table: { databaseId: dbId } } })

        await this.table.deleteMany({ where: { databaseId: dbId } })

        const findDb: Database = await this.db.findUnique({ where: { id: dbId } });
        if (!findDb) throw new HttpException(409, "Database doesn't exist");

        const deleteData = await this.db.delete({ where: { id: dbId } });
        return deleteData;
    }

}
