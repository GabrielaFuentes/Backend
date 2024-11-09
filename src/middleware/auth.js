import jwt from 'jsonwebtoken';

export function isAuthenticated(req, res, next) {
    const token = req.cookies.coderCookieToken;
    if (!token) {
        return res.redirect('/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.clearCookie('coderCookieToken');
        return res.redirect('/login');
    }
}

export function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).render('error', {
            message: 'Acceso denegado. Se requieren permisos de administrador.'
        });
    }
}

export function isUser(req, res, next) {
    if (req.user && req.user.role === 'user') {
        next();
    } else {
        res.status(403).render('error', {
            message: 'Acceso denegado. Esta sección es solo para usuarios.'
        });
    }
}

export function redirectIfAuthenticated(req, res, next) {
    const token = req.cookies.coderCookieToken;
    if (token) {
        return res.redirect('/');
    }
    next();
}