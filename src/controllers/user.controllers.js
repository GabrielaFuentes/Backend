import userService from "../services/user.services.js";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import UserDTO from "../dto/use.dto.js";

class UserController {
    async register(req, res) {
        // Validación de datos
        await body("first_name").notEmpty().withMessage("El nombre es obligatorio").run(req);
        await body("last_name").notEmpty().withMessage("El apellido es obligatorio").run(req);
        await body("email").isEmail().withMessage("Formato de email inválido").run(req);
        await body("age").isInt({ min: 1 }).withMessage("La edad debe ser un número válido").run(req);
        await body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres").run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { first_name, last_name, email, age, password } = req.body;

        try {
            const nuevoUsuario = await userService.registerUser({ first_name, last_name, email, age, password });
            const token = jwt.sign({
                usuario: `${nuevoUsuario.first_name} ${nuevoUsuario.last_name}`,
                email: nuevoUsuario.email,
                role: nuevoUsuario.role
            }, process.env.JWT_SECRET, { expiresIn: "1h" });
            console.log("JWT_SECRET:", process.env.JWT_SECRET);


            res.cookie("coderCookieToken", token, { maxAge: 3600000, httpOnly: true, secure: process.env.NODE_ENV === 'production' });
            res.redirect("/api/sessions/current");
        } catch (error) {
            console.error("Error en el registro:", error.message);
            if (error.code === 'duplicate_key') {
                return res.status(409).send("El usuario ya existe.");
            }
            res.status(500).send("Error del servidor en el registro");
        }
    }

    async login(req, res) {
        // Validación de datos de login
        await body("email").isEmail().withMessage("Formato de email inválido").run(req);
        await body("password").notEmpty().withMessage("La contraseña es obligatoria").run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            const user = await userService.loginUser(email, password);
            const token = jwt.sign({
                usuario: `${user.first_name} ${user.last_name}`,
                email: user.email,
                role: user.role
            }, process.env.JWT_SECRET, { expiresIn: "1h" });

            res.cookie("coderCookieToken", token, { maxAge: 3600000, httpOnly: true, secure: process.env.NODE_ENV === 'production' });
            res.redirect("/api/sessions/current");
        } catch (error) {
            console.error("Error en el login:", error.message);
            res.status(401).send("Credenciales inválidas.");
        }
    }

    async current(req, res) {
        if (!req.user) {
            return res.redirect('/login');
        }

        const userDTO = new UserDTO(req.user);
        res.render("home", { user: userDTO });
    }

    async logout(_, res) {
        res.clearCookie("coderCookieToken");
        res.redirect("/login");
    }
}

export default new UserController();
