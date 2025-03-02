import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { TableService } from '@/services/table.service';
import { Field, Table } from '@prisma/client';
import { ModelService } from '@/services/model.service';
import { ColumnService } from '@/services/column.service';

export class SchemaController {
    public table = Container.get(TableService);
    public model = Container.get(ModelService);
    public column = Container.get(ColumnService);

    public getTableSchemaByName = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const databaseId = Number(req.params.id);
        const tableName = String(req.params.table);
        try {

            const findAllColumnData: Field[] = await this.column.findAllColumnByTableName(databaseId, tableName);

            res.status(200).json({ data: findAllColumnData, message: 'findAll-column' });
        } catch (error) {
            next(error);
        }
    };

    public addColumn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const databaseId = Number(req.params.id);
        const tableName = String(req.params.table);
        try {
            const body: { fields: Field[] } = req.body;
            
            const createTableData = await this.column.addColumnByTableName(databaseId, tableName, body.fields);
            // res.status(200)
            res.status(201).json({ data: createTableData, message: 'added-column' });
        } catch (error) {
            next(error);
        }
    }

    public dropColumn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const databaseId = Number(req.params.id);
        const tableName = String(req.params.table);
        try {
            const body: {fields: string[]} = req.body;
            const deleteColumnTable = await this.column.deleteColumnByTableId(databaseId, tableName, body.fields);
            res.status(201)
            .json({ data: deleteColumnTable, message: 'deleted-column' });
        } catch (error) {
            next(error);
        }
    }



}
