import {Router, Request, Response} from 'express';
import {db} from '../database';

interface Todo {
  _id:string;
  content: string;
  edit: boolean;
  done: boolean;
  priority: number;
}

class TodoRouter {
  router: Router

  constructor() {
    this.router = Router();
    this.init();
    db.loadDatabase();
  }

  private getAll(req: Request, res: Response) {
    let data = db.getAllData();
    res.json(data);
  }

  private create(req: Request, res: Response) {
    let data = db.getAllData();
    let newTodo: any = req.body;
    db.insert(newTodo, (error, result) => {
      if(error) {
        return res.status(500).send('There was an error');
      }
      res.status(201).json(result);
    });
  }

  private update(req: Request, res: Response) {
    let todoId = req.params.todoId;
    let values = {$set: req.body};

    console.log('PATCH todos request for todoId ',todoId,' with JSON Body containing \n',req.body);

    db.update({_id: todoId}, values, {}, (error, numAffected) => {
      if(error || numAffected > 1) {
        return res.status(500).send('There was a server error');
      } else {
        if(numAffected !== 1) {
          return res.status(404).json({reason: 'That todo does not exist'});
        } else {
          return res.status(204).send();
        }
      }
    });

  }

  private delete(req: Request, res: Response) {
    let todoId = req.params.todoId;

    console.log('DELETE todos request for todoId', todoId);

    db.remove({_id:todoId}, (error, numRemoved) => {
      if(error || numRemoved > 1) {
        return res.status(500).send('There was a server error');
      } else {
        if(numRemoved !== 1) {
          return res.status(404).json({reason: 'That todo does not exist'});
        } else {
          return res.status(204).send();
        }
      }
    });
  }

  public init() {
    this.router.get('/', this.getAll);
    this.router.post('/', this.create);
    this.router.patch('/:todoId', this.update);
    this.router.delete('/:todoId', this.delete);
  }
}

const todosRoutes: TodoRouter = new TodoRouter();
todosRoutes.init();

export default todosRoutes.router;