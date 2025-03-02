import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { AuthService } from '@services/auth.service';
import { RecordService } from '@/services/record.service';

export class RecordController {
  public record = Container.get(RecordService);



  public find = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const databaseId = Number(req.params.id);
    const table = String(req.params.table);
    try {
      const data = await this.record.findAll(table, databaseId)
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  public findById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const databaseId = Number(req.params.id);
    const table = String(req.params.table);
    const recordId = String(req.params.recordId);
    try {
      const data = await this.record.findById(table, databaseId, recordId)
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const databaseId = Number(req.params.id);
    const table = String(req.params.table);
    const recordId = String(req.params.recordId);
    const body = req.body;
    try {
      const data = await this.record.updateById(table, databaseId, recordId, body)
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const databaseId = Number(req.params.id);
    const table = String(req.params.table);
    const recordId = String(req.params.recordId);
    try {
      const data = await this.record.deleteById(table, databaseId, recordId)
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const databaseId = Number(req.params.id);
    const table = String(req.params.table);
    const body = req.body;
    try {
      const data = await this.record.createRecord(table, databaseId, body)
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };


}
