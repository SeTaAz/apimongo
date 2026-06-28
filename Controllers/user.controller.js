import User from '../Models/user.models.js';
import jwt from 'jsonwebtoken';

// Iniciar Sesión (Login)
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        if (user.password !== password) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role }, 
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
};

// Obtener todos los usuarios (read) - PROTEGIDA
export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); 
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios', error });
    }
};

// Crear un nuevo usuario (create/register) - PÚBLICA
export const createUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const newUser = new User({ name, email, password, role }); 
        await newUser.save();
        res.status(201).json({
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
        });
    } catch (error) {
        res.status(400).json({ message: 'Error al crear usuario', error });
    }
};

// Actualizar un usuario existente (update) - PROTEGIDA
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, email },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'No encontrado' });
        }

        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar usuario', error });
    }
};

// Eliminar un usuario (delete) - PROTEGIDA
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: 'No encontrado' });
        }

        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(400).json({ message: 'Error al eliminar usuario', error });
    }
};