import express from "express";
import { engine as handlebarsEngine } from "express-handlebars";
import productsRouter from "./routers/products.router.js";
import cartsRouter from "./routers/carts.router.js";
import viewsRouter from "./routers/views.router.js";
import initializeDatabase from "./database.js"; // Cambié el nombre para reflejar que es una función
import passport from "passport";
import initializePassport from './config/passport.config.js';
import sessionRouter from './routers/sessions.router.js';
import cookieParser from "cookie-parser";

const PORT = 8080;
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"));
app.use(cookieParser());

// Passport
initializePassport();
app.use(passport.initialize());

// Express-Handlebars
app.engine(
    "handlebars",
    handlebarsEngine({
        defaultLayout: "main", // Usamos el layout por defecto "main"
    })
);
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Rutas
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionRouter);

// Conexión a la base de datos y levantamiento del servidor
const startServer = async () => {
    try {
        await initializeDatabase(); // Espera a que la base de datos se conecte correctamente
        app.listen(PORT, () => {
            console.log(`Servidor escuchando en el http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error inicializando la base de datos: ', error);
        process.exit(1); // Detiene el proceso si hay un error de conexión a la DB
    }
};

startServer();
