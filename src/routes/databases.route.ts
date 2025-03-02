import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { DatabaseController } from '@/controllers/databases.controller';
import { CreateDatabaseDto } from '@/dtos/databases.dto';
import { TableController } from '@/controllers/tables.controller';

export class DatabaseRoute implements Routes {
  public path = '/databases';
  public router = Router();
  public db = new DatabaseController();
  public table = new TableController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`,this.db.getDatabases);

    this.router.delete(`${this.path}/:id(\\d+)`,this.db.deleteDatabases);
    this.router.post(`${this.path}`,ValidationMiddleware(CreateDatabaseDto), this.db.createDatabases);
  } 
}
