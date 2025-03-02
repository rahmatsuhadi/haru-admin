import { App } from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/users.route';
import { ValidateEnv } from '@utils/validateEnv';
import { DatabaseRoute } from './routes/databases.route';
import { TableRoute } from './routes/table.route';
import { RecordRoute } from './routes/record.route';

ValidateEnv();

const app = new App([
    new UserRoute(), 
    new AuthRoute(), 
    new DatabaseRoute(), 
    new TableRoute(),
    new RecordRoute()
]);

app.listen();
