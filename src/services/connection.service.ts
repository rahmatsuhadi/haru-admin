import { Database, PrismaClient } from '@prisma/client';
import { Service } from 'typedi';
import { HttpException } from '@/exceptions/HttpException';
import { Sequelize } from 'sequelize';
import { Db, MongoClient } from "mongodb";
import { MongoConnection, MysqlConnection } from '@/interfaces/connection.interface';
import mongoose, { Connection } from 'mongoose';




type DatabaseConnection = Sequelize | Db | Connection;


@Service()
export class ConnectionService {
    public db = new PrismaClient().database;

    public connections: { [key: string]: { connect: DatabaseConnection, database: Database } } = {};

    public async getConnection(databaseId: number) {
        if (this.connections[databaseId]) {
            const { database } = this.connections[databaseId]
            console.log(`Reusing ${database.type} connection for database: ${database.name}`);
            return this.connections[databaseId];
        }

        const database = await this.getDatabaseById(databaseId);

        try {
            if (database.type == "mysql") {
                await this.createDatabaseMysql(database.name, database.uri);
    
                const sequelize = new Sequelize(`${database.uri}`, {
                    dialect: "mysql",
                    database: database.name
                });
                this.connections[databaseId] = { database, connect: sequelize }
            }
            else if (database.type == "mongodb") {
                const mongoURI = `${database.uri}`;
                const connection = await mongoose.createConnection(mongoURI, {
                    // Opsi lain bisa ditambahkan sesuai kebutuhan
                    dbName: database.name
                });
                // connection.on('connected', () => console.log("Connected"));
    
                this.connections[databaseId] = { connect: connection, database };
                console.log(`Connected to MongoDB database: ${database.name}`);
    
            }
        } catch (error) {
            console.log(error)
            throw new HttpException(500, `Internal Server`) 
        }

        return this.connections[databaseId]
    }

    public async getMySQLConnection(databaseId: number) {
        if (this.connections[databaseId]) {
            const { database } = this.connections[databaseId]
            console.log(`Reusing MySQL connection for database: ${database.name}`);
            return this.connections[databaseId];
        }
        const database = await this.getDatabaseById(databaseId)

        await this.createDatabaseMysql(database.name, database.uri);

        const sequelize = new Sequelize(`${database.uri}`, {
            dialect: "mysql",
            database: database.name
        });
        this.connections[databaseId] = { database, connect: sequelize }
        return this.connections[databaseId]
    }

    public async getMongoDBConnection(databaseId: number) {
        // if (mongoose.connection.readyState === 1) {
        //     console.log(`🔄 Reusing existing MongoDB connection for database: ${dbName}`);
        //     return mongoose.connection;
        // }

        if (this.connections[databaseId]) {
            const { database } = this.connections[databaseId]
            console.log(`Reusing cached MongoDB connection for database: ${database.name}`);
            return this.connections[databaseId];
        }

        const database = await this.getDatabaseById(databaseId)

        const mongoClient = new MongoClient(
            `${database.uri}`,
        );
        const db = mongoClient.db(database.name)

        this.connections[databaseId] = { connect: db, database };
        return this.connections[databaseId]
    }

    public async getMongoDBMongoseConnection(databaseId: number) {
        // Cek apakah sudah ada koneksi cached
        if (this.connections[databaseId]) {
            const { database } = this.connections[databaseId];
            console.log(`Reusing cached MongoDB connection for database: ${database.name}`);
            return this.connections[databaseId].connect;
        }

        // Ambil database info dari sumber eksternal (misalnya, databaseId)
        const database = await this.getDatabaseById(databaseId);

        // Jika belum ada koneksi, buat koneksi baru menggunakan Mongoose
        const mongoURI = `${database.uri}`;

        try {
            const connection = await mongoose.createConnection(mongoURI, {
                // Opsi lain bisa ditambahkan sesuai kebutuhan
            });

            this.connections[databaseId] = { connect: connection, database };
            console.log(`Connected to MongoDB database: ${database.name}`);
            return connection;
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            throw new Error(`Failed to connect to MongoDB for database: ${database.name}`);
        }
    }



    private async getDatabaseById(databaseId: number) {

        const findDb: Database = await this.db.findUnique({ where: { id: databaseId } });
        if (!findDb) throw new HttpException(404, "Database doesn't exist");

        return findDb;
    }


    public async createDatabaseMysql(name: string, uri: string) {
        const sequelize = new Sequelize(`${uri}`, {
            dialect: "mysql"
        });

        try {
            await sequelize.query(`CREATE DATABASE IF NOT EXISTS \`${name}\`;`);
            console.log(` Database '${name}' is ready.`);
        } catch (error) {
            console.error(`Error creating MySQL database '${name}':`, error);
            throw error;
        } finally {
            await sequelize.close();
        }

    }

    public async createDatabaseMongo(name: string, uri: string) {
        const connection = await mongoose.createConnection(uri, {
            // Opsi lain bisa ditambahkan sesuai kebutuhan
        });

        try {
            connection.useDb(name)
            console.log(` Database '${name}' is ready.`);
        } catch (error) {
            console.error(`Error creating MySQL database '${name}':`, error);
            throw error;
        } finally {
            connection.close()
        }

    }


    public async deleteDatabaseMysqlById(databaseId: number) {
        const manage = await this.getMySQLConnection(databaseId)
        const connection = manage.connect as MysqlConnection;
        const interfaceQuery = connection.getQueryInterface()

        await interfaceQuery.dropDatabase(manage.database.name)
        console.log(`Database Delete for database: ${manage.database.name}`);
        return true
    }

    public async deleteDatabaseMongoById(databaseId: number) {
        const manage = await this.getMySQLConnection(databaseId)
        const connection = manage.connect as MongoConnection;

        console.log(`Database Delete for database: ${manage.database.name}`);
        return true
    }
}
