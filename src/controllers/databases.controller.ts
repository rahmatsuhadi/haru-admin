import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { DatabaseService } from '@/services/database.service';
import { Database } from '@prisma/client';

export class DatabaseController {
  public database = Container.get(DatabaseService);

  public getDatabases = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllData: Database[] = await this.database.findAllDatabases();

      res.status(200).json({ data: findAllData, message: 'findAll-databases' });
    } catch (error) {
      next(error);
    }
  };

  public createDatabases = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const databaseData: Database = req.body;
      const createDatabaseData: Database = await this.database.createDatabase(databaseData);

      res.status(201).json({ data: createDatabaseData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public deleteDatabases = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const databaseId = Number(req.params.id);
      const deleteDataDatabaseData: Database = await this.database.deleteDatabase(databaseId);

      res.status(200).json({ data: deleteDataDatabaseData, message: 'deleted-databases' });
    } catch (error) {
      next(error);
    }
  };


}
