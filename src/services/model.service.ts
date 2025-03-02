import { HttpException } from '@/exceptions/HttpException';
import { MongoConnection, MysqlConnection } from '@/interfaces/connection.interface';
import { Database, Field, PrismaClient} from '@prisma/client';
import { Model as ModelMongoose, Schema } from 'mongoose';
import { DataTypes,Model as ModelSequelize, ModelAttributes, ModelStatic } from 'sequelize';
import { Service } from 'typedi';

@Service()
export class ModelService {
    public table = new PrismaClient().table;



    public async getModelMysql(
        tableName: string, 
        connection: MysqlConnection
      ): Promise<ModelStatic<ModelSequelize<any, any>>> { 
        let Model: ModelStatic<ModelSequelize<any, any>> | undefined = connection.model[tableName];
      
        if (!Model) {
          const queryInterface = connection.getQueryInterface();
          const tableDescription = await queryInterface.describeTable(tableName);
      
          const attributes: ModelAttributes = Object.keys(tableDescription).reduce((acc, columnName) => {
            const columnDetails = tableDescription[columnName];
      
            acc[columnName] = {
              type: DataTypes[columnDetails.type.toUpperCase() as keyof typeof DataTypes] || DataTypes.STRING,
              allowNull: columnDetails.allowNull,
              primaryKey: columnDetails.primaryKey || false,
              autoIncrement: columnDetails.autoIncrement || false,
            };
            return acc;
          }, {} as ModelAttributes);
      
          // Menyusun model dengan menggunakan connection.define
          Model = connection.define(tableName, attributes, {
            tableName,
            timestamps: false,
          });
        }
      
        return Model;
      }

      public async getModelMongoDB(
        collectionName: string,
        connection: MongoConnection,
        columns: Field[]
      ): Promise<ModelMongoose<any>> {
        let Model: ModelMongoose<any> | undefined = connection.models[collectionName];
    
        if (!Model) {
          //  const collection = connection.collection(collectionName);
          // const firstDocument = await collection.findOne();
    
          const schemaDefinition: { [key: string]: any } = {};
    
          columns.forEach((column) => {
            let columnType;
    
            // Menentukan tipe data berdasarkan field 'type'
            switch (column.type) {
              case 'STRING':
                columnType = Schema.Types.String;
                break;
              case 'INT':
                columnType = Schema.Types.Number;
                break;
              case 'BOOLEAN':
                columnType = Schema.Types.Boolean;
                break;
              case 'DATE':
                columnType = Schema.Types.Date;
                break;
              case 'FLOAT':
                columnType = Schema.Types.Number;
                break;
              case 'JSON':
                columnType = Schema.Types.Mixed;
                break;
              default:
                columnType = Schema.Types.String; 
            }
    
           
            schemaDefinition[column.name] = {
              type: columnType,
              required: column.isRequired,
              unique: column.isPrimary, 
            };
          });
    
          const collectionSchema = new Schema(schemaDefinition, {
            timestamps: true, 
          });
    
          Model = connection.model(collectionName, collectionSchema);
          console.log(`Model for collection "${collectionName}" created in MongoDB.`);
        }
    
        return Model;
      }



}
