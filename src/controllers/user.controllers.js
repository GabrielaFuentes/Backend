import userService from "../services/user.services.js";
import jwt from "jsonwebtoken";
import UserDTO from "../dto/use.dto.js";

class UserController {
    async register(req, res) {
        const { first_name, last_name, email, age, password } = req.body;

        // Validación de datos aquí

        try {
            const nuevoUsuario = await userService.registerUser({ first_name, last_name, email, age, password });
            console.log(nuevoUsuario);

            const token = jwt.sign({
                usuario: `${nuevoUsuario.first_name} ${nuevoUsuario.last_name}`,
                email: nuevoUsuario.email,
                role: nuevoUsuario.role
            }, "secretJWTKey", { expiresIn: "1h" });

            res.cookie("coderCookieToken", token, { maxAge: 3600000, httpOnly: true, secure: process.env.NODE_ENV === 'production' });
            res.redirect("/api/sessions/current");
        } catch (error) {
            console.error("Error en el registro: ", error.message);
            if (error.code === 'duplicate_key') {
                return res.status(409).send("El usuario ya existe.");
            }
            res.status(500).send("Error del server en el registro");
        }
    }

    async login(req, res) {
        const { email, password } = req.body;

        // Validación de datos aquí

        try {
            const user = await userService.loginUser(email, password);
            const token = jwt.sign({
                usuario: `${user.first_name} ${user.last_name}`,
                email: user.email,
                role: user.role
            }, "secretJWTKey", { expiresIn: "1h" });

            res.cookie("coderCookieToken", token, { maxAge: 3600000, httpOnly: true, secure: process.env.NODE_ENV === 'production' });
            res.redirect("/api/sessions/current");
        } catch (error) {
            console.error("Error en el login: ", error.message);
            res.status(401).send("Credenciales inválidas.");
        }
    }

    async current(req, res) {
        if (!req.user) {
            return res.redirect('/login'); // O envía un mensaje de error
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
