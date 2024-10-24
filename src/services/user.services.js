import UserModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils/utils.js";

class UserService {
    // Método para registrar un nuevo usuario
    async registerUser(userData) {
        const { first_name, last_name, age, email, password } = userData;
        try {
            const userExists = await UserModel.findOne({
                email
            });
            if (userExists) return {
                message: "Correo ya registrado."
            };

            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            };

            const result = await UserModel.create(newUser);
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Método para iniciar sesión
    async loginUser(email, password) {
        try {
            const user = await UserModel.findOne({
                email
            });
            if (!user) return {
                message: "Usuario no encontrado."
            };
            if (!isValidPassword(password, user)) return {
                message: "Contraseña incorrecta."
            };
            return user;
        } catch (error) {
            throw new Error(error.message);
        }
    }


    // Método para obtener un usuario por su email
    async getUserByEmail(email) {
        try {
            return await UserModel.findOne({
                email
            });
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default new UserService();
