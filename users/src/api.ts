import express from 'express';
import Users from './Users/Users.js';

const router = express.Router();

const apiPath = '/node.js/api';

router.post(`${apiPath}/users/add`, Users.add);
router.post(`${apiPath}/users/update/:id`, Users.update);
router.get(`${apiPath}/users/all`, Users.getAll);

export default router;
