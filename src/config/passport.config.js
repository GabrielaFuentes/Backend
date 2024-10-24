import passport from "passport";
import local from "passport-local";
import UserModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils/utils.js";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { private_key } from "../utils/jsonwebtoken.js";


const LocalStrategy = local.Strategy;

// Función para extraer el token JWT desde las cookies
const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["coderCookieToken"];
    }
    return token;
};
const initializePassport = () => {
    // Estrategia de registro
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done) => {
        const { first_name, last_name, age } = req.body;
        try {
            const userExists = await UserModel.findOne({ email: username });
            if (userExists) return done(null, false, { message: "Correo ya registrado." });

            const newUser = {
                first_name,
                last_name,
                email: username,
                age,
                password: createHash(password)
            };

            const result = await UserModel.create(newUser);
            return done(null, result);
        } catch (error) {
            return done(error);
        }
    }));

    // Estrategia de login
    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (email, password, done) => {
        try {
            const user = await UserModel.findOne({ email });
            if (!user) return done(null, false, { message: "Usuario no encontrado." });
            if (!isValidPassword(password, user)) return done(null, false, { message: "Contraseña incorrecta." });
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

}
// Estrategia de autenticación JWT basada en cookies
passport.use("jwt", new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: private_key
}, async (jwt_payload, done) => {
    try {
        // Buscar al usuario por el campo 'email' que viene en el token
        const user = await UserModel.findOne({ email: jwt_payload.email });
        if (!user) {
            return done(null, false);  // Usuario no encontrado
        }
        return done(null, user);  // Usuario encontrado
    } catch (error) {
        return done(error);
    }
}));


export default initializePassport;