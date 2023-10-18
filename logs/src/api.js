import express from 'express';
import Logs from './Logs/Logs.js';

const router = express.Router();

router.post('/api/logs/create', Logs.userCreate);
router.post('/api/logs/update', Logs.userUpdate);
router.get('/api/logs/all', Logs.getAll);

export default router;
