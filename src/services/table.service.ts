import { HttpException } from '@/exceptions/HttpException';
import { Database, PrismaClient, Table, TypeDatabase, Field } from '@prisma/client';
import Container, { Service } from 'typedi';
import { ConnectionService } from './connection.service';
import { ModelService } from './model.service';
import { MongoConnection, MysqlConnection } from '@/interfaces/connection.interface';
import { DataTypes, ModelAttributes } from 'sequelize';
import { ColumnService } from './column.service';
import { CollectionDefinition } from '@/interfaces/table.interface';
import mongoose, { Schema } from 'mongoose';

@Service()
export class TableService {
    public table = new PrismaClient().table;
    public db = new PrismaClient().database;
    public model = Container.get(ModelService);
    public column = new PrismaClient().field;
    public connection = Container.get(ConnectionService);

    public async findAllTablesByDBID(databaseId: number): Promise<Table[]> {
        const findDatabases = await this.db.findUnique({ where: { id: databaseId } });

        if (!findDatabases) throw new HttpException(404, `Databases ${databaseId} not exist`);

        const allTables: Table[] = await this.table.findMany({ where: { databaseId } });
        return allTables;
    }


    public async createtable(data: (Table & { fields: Field[] }), databaseId: number): Promise<Table> {

        const findTable = await this.table.findFirst({ include: { database: { select: { type: true } } }, where: { name: data.name, databaseId } });

        if (findTable) throw new HttpException(409, "Table already exist");

        const manager = await this.connection.getConnection(databaseId)
        const database = manager.database
        if (database.type == "mysql") {

            const connection = manager.connect as MysqlConnection
            await this.createTableMysql(data.name, data.fields, connection)
        }
        else if (database.type == "mongodb") {
            const connection = manager.connect as MongoConnection
            await this.createTableMongo(data.name, data.fields, connection)
        }

        const table = await this.table.create({ include: { fields: { select: { name: true, isPrimary: true, isRequired: true, type: true } } }, data: { name: data.name, databaseId: databaseId, fields: { createMany: { data: [{ name: "_id", type: "INT", isPrimary: true, isRequired: false }, ...data.fields] } } } });
        return table
    }

    public async deleteTable(tableName: string, databaseId: number): Promise<Table> {

        const findTable = await this.table.findFirst({ where: { name: tableName, databaseId } });

        if (!findTable) throw new HttpException(404, "Table not exist");

        const manager = await this.connection.getMySQLConnection(databaseId)

        const database = manager.database

        if (database.type == "mysql") {
            const connection = manager.connect as MysqlConnection
            const queryInterface = connection.getQueryInterface();
            queryInterface.dropTable(tableName)
            console.log(`Deleted Table ${tableName} for database MYSQL`);
        }



        await this.column.deleteMany({ where: { tableId: findTable.id } });
        const table = await this.table.delete({ where: { id: findTable.id } });
        return table
    }

    public async viewDataTable(tableName: string, databaseId: number): Promise<any[]> {

        const manage = await this.connection.getConnection(databaseId)
        const database = manage.database

        const table = await this.table.findFirst({where:{name: tableName, databaseId}, include:{fields:true}})

        if (!table) throw new HttpException(404, `Table ${tableName} not exist`);

        if (database.type == "mysql") {
            const connection = manage.connect as MysqlConnection
            const model = await this.model.getModelMysql(tableName, connection)

            const result = await model.findAll()
            return result

        } else if (database.type == "mongodb") {
            const connection = manage.connect as MongoConnection
            const model = await this.model.getModelMongoDB(tableName, connection, table.fields)
            const result = await model.find()
            return result
            
        }

        return []
    }

    private async createTableMysql(tableName: string, columns: Field[], connection: MysqlConnection) {

        const queryInterface = await connection.getQueryInterface();

        const tableDefinition: ModelAttributes = {
            _id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
        };
        for (const col of columns) {
            const dataType =
                col.type === "RELATION"
                    ? DataTypes.STRING
                    : col.type === "DATETIME"
                        ? DataTypes.DATE
                        : DataTypes[col.type as keyof typeof DataTypes];

            // if (col.type == "RELATION" && col.relationTable) {
            //   const relationTable = await getTableById(col.relationTable);
            //   if (relationTable) {
            //     tableDefinition[col.name] = {
            //       type: dataType,
            //       allowNull: col.isRequired !== true,
            //       primaryKey: col.isPrimary || false,
            //       references: {
            //         model: relationTable.name,
            //         key:
            //           relationTable.fields.length > 0
            //             ? relationTable.fields[0].name
            //             : "_id",
            //       },
            //       onUpdate: "CASCADE",
            //       onDelete: "CASCADE",
            //     };
            //   }
            // } else {
            tableDefinition[col.name] = {
                type: dataType,
                allowNull: col.isRequired !== true,
                primaryKey: col.isPrimary || false,
            };
            // }
        };
        console.log(tableDefinition, tableName)
        const table = await queryInterface.createTable(tableName, tableDefinition);
        console.log(`Created Table ${tableName} for database MYSQL`);
        return table


    }
    private async createTableMongo(tableName: string, columns: Field[], connection: MongoConnection) {
        const collectionDefinition: CollectionDefinition = {};

        for (const col of columns) {
            const dataType = this.mapDataType(col.type);

            // if (col.type === "RELATION" && col.relationTable) {
            //     collectionDefinition[col.name] = {
            //         type: mongoose.Schema.Types.ObjectId,
            //         ref: col.relationTable,  // Referensi ke koleksi lain
            //         required: col.isRequired || false,
            //     };
            // } else {
            // Menambahkan properti kolom ke dalam definisi koleksi
            collectionDefinition[col.name] = {
                type: dataType,
                required: col.isRequired || false, // Menggunakan `required` untuk validasi
            };

            const collectionSchema = new Schema(collectionDefinition, {
                timestamps: true, // Menambahkan timestamps (createdAt, updatedAt)
            });

            const Model = mongoose.model(tableName, collectionSchema);

            console.log(`Created MongoDB collection ${tableName}`);
            return Model;
            // }
        }

    }

    private mapDataType(type: string): any {
        switch (type) {
            case "STRING":
                return String;
            case "NUMBER":
            case "INT":
            case "INTEGER":
                return Number;
            case "FLOAT":
                return Number;
            case "BOOLEAN":
                return Boolean;
            case "DATETIME":
                return Date;
            case "JSON":
                return Schema.Types.Mixed;
            default:
                return String;
        }
    }


}
