import { Router } from 'express';
import { AuthController } from '@controllers/auth.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { RecordController } from '@/controllers/records.controller';

export class RecordRoute implements Routes {

    public path = `/:id(\\d+)/:table`;
    public router = Router();
    public record = new RecordController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, this.record.find);
        this.router.get(`${this.path}/:recordId`, this.record.findById);
        this.router.post(`${this.path}`, this.record.create);
        this.router.patch(`${this.path}/:recordId`, this.record.update);
        this.router.delete(`${this.path}/:recordId`, this.record.delete);
    }
}
