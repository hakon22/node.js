import express from 'express';
import Logs from './Logs/Logs.js';

const router = express.Router();

const apiPath = '/node.js/api';

router.post(`${apiPath}/logs/create`, Logs.userCreate);
router.post(`${apiPath}/logs/update`, Logs.userUpdate);
router.get(`${apiPath}/logs/all`, Logs.getAll);

export default router;
