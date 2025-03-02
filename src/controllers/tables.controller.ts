import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { TableService } from '@/services/table.service';
import { Field, Table } from '@prisma/client';

export class TableController {
  public table = Container.get(TableService);

  public getTables = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const databaseId = Number(req.params.id);
    try {

      const findAllTablesData: Table[] = await this.table.findAllTablesByDBID(databaseId);

      res.status(200).json({ data: findAllTablesData, message: 'find-all-table-databases' });
    } catch (error) {
      next(error);
    }
  };

  public createTable = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const databaseId = Number(req.params.id);
    try {
      const tableData: (Table & { fields: Field[] }) = req.body;
      const createTableData: Table = await this.table.createtable(tableData, databaseId);
      // res.status(200)
      res.status(201).json({ data: createTableData, message: 'created' });
    } catch (error) {
      next(error);
    }
  }

  public deleteTable = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const databaseId = Number(req.params.id);
    const tableName = String(req.params.table);
    try {
      const deleteTableByName: Table = await this.table.deleteTable(tableName, databaseId);
      // res.status(200)
      res.status(200).json({ data: deleteTableByName, message: 'table-deleted' });
    } catch (error) {
      next(error);
    }
  }

  public viewDataTable = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const databaseId = Number(req.params.id);
    const tableName = String(req.params.table);

    const data = await this.table.viewDataTable(tableName, databaseId);

    res.status(200).json({message: "find-data", data})
  }

}
