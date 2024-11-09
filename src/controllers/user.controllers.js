import userService from "../services/user.services.js";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import UserDTO from "../dto/use.dto.js";
import CartModel from "../dao/models/carts.model.js";

class UserController {
    async register(req, res) {
        try {
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

            // Crear un nuevo carrito para el usuario
            const newCart = await CartModel.create({ products: [] });

            // Registrar el usuario con el ID del carrito
            const userData = {
                first_name,
                last_name,
                email,
                age,
                password,
                cart: newCart._id
            };

            const nuevoUsuario = await userService.registerUser(userData);

            // Actualizar el carrito con el ID del usuario
            await CartModel.findByIdAndUpdate(newCart._id, { user: nuevoUsuario._id });

            const token = jwt.sign({
                usuario: `${nuevoUsuario.first_name} ${nuevoUsuario.last_name}`,
                email: nuevoUsuario.email,
                role: nuevoUsuario.role,
                cart: newCart._id
            }, process.env.JWT_SECRET, { expiresIn: "1h" });

            res.cookie("coderCookieToken", token, {
                maxAge: 3600000,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production'
            });

            res.redirect("/products");
        } catch (error) {
            console.error("Error en el registro:", error);
            res.status(500).json({ error: "Error en el registro de usuario" });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await userService.loginUser(email, password);

            if (!user) {
                return res.status(401).json({ error: "Credenciales inválidas" });
            }

            // Verificar si el usuario tiene un carrito
            let userCart = await CartModel.findById(user.cart);
            
            if (!userCart) {
                // Crear nuevo carrito si no existe
                userCart = await CartModel.create({
                    user: user._id,
                    products: []
                });
                
                // Actualizar usuario con el nuevo carrito
                user.cart = userCart._id;
                await user.save();
            }

            const token = jwt.sign({
                usuario: `${user.first_name} ${user.last_name}`,
                email: user.email,
                role: user.role,
                cart: user.cart
            }, process.env.JWT_SECRET, { expiresIn: "1h" });

            res.cookie("coderCookieToken", token, {
                maxAge: 3600000,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production'
            });

            res.redirect("/products");
        } catch (error) {
            console.error("Error en el login:", error);
            res.status(500).json({ error: "Error en el inicio de sesión" });
        }
    }

    async current(req, res) {
        if (!req.user) {
            return res.redirect('/login');
        }
        const userDTO = new UserDTO(req.user);
        res.render("products", { user: userDTO });
    }

    async logout(req, res) {
        res.clearCookie("coderCookieToken");
        res.redirect("/login");
    }
}

export default new UserController();