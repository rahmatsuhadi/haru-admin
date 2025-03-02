import { Db } from "mongodb";
import { Connection } from "mongoose";
import { Sequelize } from "sequelize";

export type MysqlConnection = Sequelize;
export type MongoConnection = Connection;