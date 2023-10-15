import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import Users_Table from '../db/tables/Users.js';

class Users {

  async add(req: Request, res: Response) {
    try {
      const { username, password, email } = req.body;
      const candidate = await Users_Table.findOne({ where: { email } });
      if (candidate) {
        return res.json({ code: 2 });
      }
      const hashPassword = bcrypt.hashSync(password, 10);
      const user = await Users_Table.create({ username, password: hashPassword, email });
      res.json({ code: 1, user });
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id, ...values } = req.body;
      await Users_Table.update(values, { where: { id } });
      res.json({ code: 1 });
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const users = Users_Table.findAll();
      res.json({ code: 1, users });
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }
}

export default new Users();