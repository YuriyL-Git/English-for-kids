import { DatabaseUserInterface } from 'src/interfaces/user-interface';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

const isAdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { user }: any = req;
  if (user) {
    User.findOne({ username: user.username }, (err: Error, doc: DatabaseUserInterface) => {
      if (err) throw err;
      if (doc?.isAdmin) {
        next();
      } else {
        res.send("Sorry, only admin's can perform this.");
      }
    });
  } else {
    res.send('Sorry, you arent logged in.');
  }
};

export default isAdminMiddleware;
