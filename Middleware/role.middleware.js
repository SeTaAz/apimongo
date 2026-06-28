// 1. Definir la función directamente
export const checkRole = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.user || !rolesPermitidos.includes(req.user.role)) {
            return res.status(403).json({ 
                message: "Acceso denegado: Se requieren permisos de administrador" 
            });
        }
        next();
    };
};

// 2. Exportarla por defecto al final del archivo
export default checkRole;