import passport from "passport";
import local from "passport-local";
import UserModel from "../dao/models/user.model.js";
import CartsModel from "../dao/models/carts.model.js";
import { createHash, isValidPassword } from "../utils/utils.js";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

const LocalStrategy = local.Strategy;

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
        const { first_name, last_name, age } = req.body;
        try {
            const userExists = await UserModel.findOne({ email: username });
            if (userExists) {
                return done(null, false, { message: "El correo ya está registrado." });
            }

            // Crear carrito para el nuevo usuario
            const newCart = new CartsModel({
                timestamp: new Date(),
                products: []
            });
            await newCart.save();

            const newUser = new UserModel({
                first_name,
                last_name,
                email: username,
                age,
                password: createHash(password),
                cart: newCart._id,
                role: username.includes('@admin.com') ? 'admin' : 'user'
            });

            await newUser.save();
            return done(null, newUser);
        } catch (error) {
            return done(error);
        }
    }));

    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (email, password, done) => {
        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                return done(null, false, { message: "Usuario no encontrado." });
            }
            if (!isValidPassword(password, user)) {
                return done(null, false, { message: "Contraseña incorrecta." });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.use("jwt", new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_SECRET
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