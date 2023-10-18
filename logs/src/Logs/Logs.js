import Logs_Table from '../db/tables/Logs.js';

class Logs {
  async userCreate(req, res) {
    try {
      const { id, username, email, password } = req.body;
      const message = `Создание нового пользователя #${id}, username: ${username}, email: ${email}, password: ${password}`;
      await Logs_Table.create({ userId: id , message });
      res.sendStatus(201);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }

  async userUpdate(req, res) {
    try {
      const { id, changedValue } = req.body;
      const values = Object.entries(changedValue);
      const message = `Пользователь #${id} изменил ${values[0][0]} на ${values[0][1]}`;
      await Logs_Table.create({ userId: id , message });
      res.sendStatus(201);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }

  async getAll(req, res) {
    try {
      const logs = await Logs_Table.findAll();
      res.json({ code: 1, logs });
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }
}

export default new Logs();
