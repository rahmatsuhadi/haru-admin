import { HttpException } from '@/exceptions/HttpException';
import { Database, PrismaClient, Table, TypeDatabase, Field } from '@prisma/client';
import Container, { Service } from 'typedi';
import { ModelService } from './model.service';
import { ConnectionService } from './connection.service';
import { MongoConnection, MysqlConnection } from '@/interfaces/connection.interface';
import { DataTypes } from 'sequelize';

@Service()
export class ColumnService {
    public column = new PrismaClient().field;
    public table = new PrismaClient().table;
    public model = Container.get(ModelService);
    public connection = Container.get(ConnectionService);

    public async findAllColumnByTableName(databaseId: number, tableName: string): Promise<Field[]> {
        const allColumn: Field[] = await this.column.findMany({ where: { table: { name: tableName, databaseId: databaseId } } });

        const manage = await this.connection.getConnection(databaseId)
        const database = manage.database

        if (database.type == "mysql") {
            const connection = manage.connect as MysqlConnection
            const model = await this.model.getModelMysql(tableName, connection)

        } else if (database.type == "mongodb") {
            const connection = manage.connect as MongoConnection
            const model = await this.model.getModelMongoDB(tableName, connection, allColumn)
            
        }

        return allColumn;
    }


    public async addColumnByTableName(databaseId: number, tableName: string, data: Field[]) {
        const findTable: Table = await this.table.findFirst({ where: { name: tableName, databaseId } });
        if (!findTable) throw new HttpException(409, "Table doesn't exist");

        for (const column of data) {
            const findColumn = await this.column.findFirst({ where: { name: column.name, table: { databaseId: databaseId, name: tableName } } });
            if (findColumn) throw new HttpException(409, `Column '${column.name}' already exist`)
        }
        const manager = await this.connection.getConnection(databaseId)
        
        const database = manager.database;
        if(database.type=="mysql"){
            const connection = manager.connect as MysqlConnection
            const queryInterface = connection.getQueryInterface()

            for (const col of data) {
                await queryInterface.addColumn(tableName, col.name, {
                    type: DataTypes[col.type.toUpperCase() as keyof typeof DataTypes] || DataTypes.STRING,
                    allowNull: !col.isRequired || false,
                    primaryKey: col.isPrimary || false,
                    autoIncrement: false,
                })
                console.log(`Column ${col.name} is added for Table: ${tableName}`)
            }
        }
        else if(database.type=="mongodb"){
            const connection = manager.connect as MongoConnection
        }

        return this.column.createMany({ data: data.map((item) => { return { ...item, tableId: findTable.id } }) });
    }

    public async deleteColumnByTableId(databaseId: number, tableName: string, data: string[]) {
        const columns = await this.column.findMany({ where: { name: { in: data }, table: { name: tableName, databaseId } } })
        if (columns.length == 0) throw new HttpException(404, `Column not found in this table`)
        const manager = await this.connection.getMySQLConnection(databaseId)
        const connection = manager.connect as MysqlConnection
        const queryInterface = connection.getQueryInterface()

        for (const col of data) {
            await queryInterface.removeColumn(tableName, col)
            console.log(`Column ${col} is removed for Table: ${tableName}`)
        }
        return this.column.deleteMany({ where: { name: { in: data }, table: { name: tableName, databaseId }, } })
    }


}
