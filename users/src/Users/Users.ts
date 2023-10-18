import { Request, Response } from 'express';
import Users_Table from '../db/tables/Users.js';

class Users {

  async add(req: Request, res: Response) {
    try {
      const { username, password, email } = req.body;
      const user = await Users_Table.create({ username, password, email });
      res.json(user);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const changedValue: object = req.body;
      await Users_Table.update(changedValue, { where: { id } });
      res.json({ code: 1 });
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const users = await Users_Table.findAll();
      res.json({ code: 1, users });
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }
}

export default new Users();