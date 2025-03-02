import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { DatabaseController } from '@/controllers/databases.controller';
import { TableController } from '@/controllers/tables.controller';
import { CreateTableDto } from '@/dtos/tables.dto';
import { SchemaController } from '@/controllers/schema.controller';
import { AddColumnTableDto, DropColumnTableDto } from '@/dtos/fields.dto';

export class TableRoute implements Routes {
    public path = `/databases/:id(\\d+)`;
    public router = Router();
    public db = new DatabaseController();
    public table = new TableController();
    public schema = new SchemaController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, this.table.getTables);
        this.router.post(`${this.path}`, ValidationMiddleware(CreateTableDto), this.table.createTable)
        this.router.get(`${this.path}/:table`, this.schema.getTableSchemaByName)
        this.router.delete(`${this.path}/:table`, this.table.deleteTable)
        this.router.post(`${this.path}/:table/add-column`, ValidationMiddleware(AddColumnTableDto), this.schema.addColumn)
        this.router.post(`${this.path}/:table/drop-column`, ValidationMiddleware(DropColumnTableDto), this.schema.dropColumn)
        this.router.post(`${this.path}/:table/view`, this.table.viewDataTable)
    }
}
