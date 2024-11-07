import passport from "passport";
import local from "passport-local";
import UserModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils/utils.js";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import CartManager from "../dao/db/carts-manager-db.js";

const LocalStrategy = local.Strategy;
const cartManager = new CartManager();

const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["coderCookieToken"];
    }
    return token;
};

const initializePassport = () => {
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done) => {
        const { first_name, last_name, age, role } = req.body;
        try {
            const userExists = await UserModel.findOne({ email: username });
            if (userExists) return done(null, false, { message: "Correo ya registrado." });

            const cart = await cartManager.createCart();
            const newUser = {
                first_name,
                last_name,
                email: username,
                cart_id: cart._id,
                age,
                password: createHash(password),
                role: role || "user"
            };

            const result = await UserModel.create(newUser);
            return done(null, result);
        } catch (error) {
            return done(error);
        }
    }));

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

    passport.use("jwt", new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_SECRET // usa la clave desde el entorno
    }, async (jwt_payload, done) => {
        try {
            const user = await UserModel.findOne({ email: jwt_payload.email });
            if (!user) {
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));
};

export default initializePassport;
