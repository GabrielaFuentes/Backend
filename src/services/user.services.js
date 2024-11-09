import UserModel from "../dao/models/user.model.js";
import CartModel from "../dao/models/carts.model.js";
import { createHash, isValidPassword } from "../utils/utils.js";

class UserService {
    async registerUser(userData) {
        try {
            const { email, password, cart, ...otherData } = userData;
            
            const userExists = await UserModel.findOne({ email });
            if (userExists) {
                throw new Error("El correo ya está registrado.");
            }

            const newUser = new UserModel({
                ...otherData,
                email,
                password: createHash(password),
                cart: cart,
                role: email.includes('@admin.com') ? 'admin' : 'user'
            });

            await newUser.save();
            return newUser;
        } catch (error) {
            console.error("Error en registerUser:", error);
            throw error;
        }
    }

    async loginUser(email, password) {
        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                throw new Error("Usuario no encontrado.");
            }

            if (!isValidPassword(password, user)) {
                throw new Error("Contraseña incorrecta.");
            }

            // Verificar y crear carrito si no existe
            if (!user.cart) {
                const newCart = await CartModel.create({
                    user: user._id,
                    products: []
                });
                user.cart = newCart._id;
                await user.save();
            }

            return user;
        } catch (error) {
            console.error("Error en loginUser:", error);
            throw error;
        }
    }

    async getUserByEmail(email) {
        try {
            return await UserModel.findOne({ email }).populate('cart');
        } catch (error) {
            console.error("Error en getUserByEmail:", error);
            throw error;
        }
    }
}

export default new UserService();