import express from 'express';
import { getUsers, createUser, updateUser, deleteUser, loginUser } from '../Controllers/user.controller.js';
import authMiddleware from '../Middleware/auth.middleware.js';

const router = express.Router();

// Rutas Públicas
router.post('/login', loginUser);
router.post('/', createUser);

// Rutas Protegidas por JWT
router.get('/', authMiddleware, getUsers);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);

export default router;