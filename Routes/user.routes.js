import express from 'express';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { getUsers, createUser, updateUser, deleteUser, loginUser } from '../Controllers/user.controller.js';
import authMiddleware from '../Middleware/auth.middleware.js';
import checkRole from '../Middleware/role.middleware.js'; // 🛡️ Importamos tu nuevo validador de roles

const router = express.Router();

// 🛑 MEJORA 1: Limitador contra ataques de fuerza bruta (Se aplica al Login)
const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // Bloqueo por X minutos
    max: 5, // Máximo  intentos fallidos por IP
    message: { message: "Demasiados intentos de inicio de sesión. Intenta de nuevo en 1 minutos." }
});

// 🔍 MEJORA 2: Validación y sanitización estricta de datos para el Registro
const validateRegister = [
    body('email').isEmail().withMessage('Debe ser un correo electrónico válido').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// 🟢 Rutas Públicas
router.post('/login', loginLimiter, loginUser); // Protegida contra fuerza bruta
router.post('/', validateRegister, createUser); // Protegida contra datos basura / inyecciones

// 🔒 Rutas Protegidas por JWT
router.get('/', authMiddleware, getUsers);
router.put('/:id', authMiddleware, updateUser);

// 🚫 MEJORA 3: ¡Doble protección para eliminar! Requiere token JWT válido Y rol de 'admin'
router.delete('/:id', authMiddleware, checkRole(['admin']), deleteUser);

export default router;