import { Request, Response } from 'express';
import axios from 'axios';
import Users_Table from '../db/tables/Users.js';

class Users {

  async add(req: Request, res: Response) {
    try {
      const user = await Users_Table.create(req.body);
      const { id, username, email, password } = user;
      const { data } = await axios.post('http://localhost:3006/node.js/api/logs/create', { id, username, email, password });
      res.json({ user, log: data });
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
      const { data } = await axios.post('http://localhost:3006/node.js/api/logs/update', { id, changedValue });
      res.json({ code: 1, log: data });
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