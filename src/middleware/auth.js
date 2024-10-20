//Verificamos si es Admin: 


export function onlyAdmin(req, res, next) {
    if (req.user.role === "admin") {
        next();
    } else {
        res.status(403).send("Acceso denegado, solo Administradores");
    }
}


export function onlyUser(req, res, next) {
    if (req.user.role === "user") {
        next();
    } else {
        res.status(403).send("Acceso denegado, este lugar es solo para usuarios Comunes");
    }

}