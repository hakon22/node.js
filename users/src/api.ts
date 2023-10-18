import express from 'express';
import Users from './Users/Users.js';

const router = express.Router();

router.post('/api/users/add', Users.add);
router.post('/api/users/update/:id', Users.update);
router.get('/api/users/all', Users.getAll);

export default router;
