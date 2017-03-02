import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import TodosRouter from './routes/todos';

class App {

  public express: express.Application;

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  private middleware(): void {
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(cors());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  private routes(): void {
    let router = express.Router();
    router.get('/', (req, res) => {
      res.json({
        message: 'Todos API up and running!'
      });
    });
    this.express.use('/', router);
    this.express.use('/v1/todos', TodosRouter);
  }

}

export default new App().express;