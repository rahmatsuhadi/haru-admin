
import { HttpException } from '@/exceptions/HttpException';
import { MongoConnection, MysqlConnection } from '@/interfaces/connection.interface';
import { Database, Field, PrismaClient } from '@prisma/client';
import { Model as ModelMongoose, Schema } from 'mongoose';
import { DataTypes, Model as ModelSequelize, ModelAttributes, ModelStatic } from 'sequelize';
import Container, { Service } from 'typedi';
import { ConnectionService } from './connection.service';
import { ModelService } from './model.service';

@Service()
export class RecordService {
    public table = new PrismaClient().table;

    public connection = Container.get(ConnectionService);
    public model = Container.get(ModelService);


    public async findAll(tableName: string, databaseId: number): Promise<any> {
        const manage = await this.connection.getConnection(databaseId)
        const database = manage.database

        const table = await this.table.findFirst({ where: { name: tableName, databaseId }, include: { fields: true } })

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


    }
    public async findById(tableName: string, databaseId: number, recordId: string | number): Promise<any> {
        const manage = await this.connection.getConnection(databaseId)
        const database = manage.database

        const table = await this.table.findFirst({ where: { name: tableName, databaseId }, include: { fields: true } })

        if (!table) throw new HttpException(404, `Table ${tableName} not exist`);


        if (database.type == "mysql") {
            const connection = manage.connect as MysqlConnection
            const model = await this.model.getModelMysql(tableName, connection)

            const result = await model.findByPk(recordId)
            return result

        } else if (database.type == "mongodb") {
            const connection = manage.connect as MongoConnection
            const model = await this.model.getModelMongoDB(tableName, connection, table.fields)
            const result = await model.findById(recordId)
            return result
        }
    }
    public async deleteById(tableName: string, databaseId: number, recordId: string | number): Promise<any> {
        const manage = await this.connection.getConnection(databaseId)
        const database = manage.database

        const table = await this.table.findFirst({ where: { name: tableName, databaseId }, include: { fields: true } })

        if (!table) throw new HttpException(404, `Table ${tableName} not exist`);


        if (database.type == "mysql") {
            const connection = manage.connect as MysqlConnection
            const model = await this.model.getModelMysql(tableName, connection)

            const result = await model.findByPk(recordId)
            if (!result) throw new HttpException(404, `Record ${recordId} not found`);
            return result.destroy()

        } else if (database.type == "mongodb") {
            const connection = manage.connect as MongoConnection
            const model = await this.model.getModelMongoDB(tableName, connection, table.fields)
            const result = await model.findByIdAndDelete(recordId)
            return result
        }
    }
    public async updateById(tableName: string, databaseId: number, recordId: string | number, body: any): Promise<any> {
        const manage = await this.connection.getConnection(databaseId)
        const database = manage.database

        const table = await this.table.findFirst({ where: { name: tableName, databaseId }, include: { fields: true } })

        if (!table) throw new HttpException(404, `Table ${tableName} not exist`);


        if (database.type == "mysql") {
            const connection = manage.connect as MysqlConnection
            const model = await this.model.getModelMysql(tableName, connection)

            const result = await model.findByPk(recordId)
            const update = await result.update(body)
            return update

        } else if (database.type == "mongodb") {
            const connection = manage.connect as MongoConnection
            const model = await this.model.getModelMongoDB(tableName, connection, table.fields)
            const result = await model.findOneAndUpdate({id:recordId}, body)
            return result
        }
    }
    public async createRecord(tableName: string, databaseId: number, body: any): Promise<any> {
        const manage = await this.connection.getConnection(databaseId)
        const database = manage.database

        const table = await this.table.findFirst({ where: { name: tableName, databaseId }, include: { fields: true } })

        if (!table) throw new HttpException(404, `Table ${tableName} not exist`);


        if (database.type == "mysql") {
            const connection = manage.connect as MysqlConnection
            const model = await this.model.getModelMysql(tableName, connection)

            const result = await model.create(body)
            return result

        } else if (database.type == "mongodb") {
            const connection = manage.connect as MongoConnection
            const model = await this.model.getModelMongoDB(tableName, connection, table.fields)
            const result = await model.insertOne(body)
            return result
        }
    }
}
