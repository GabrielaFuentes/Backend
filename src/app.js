import express from "express";
import { engine as handlebarsEngine } from "express-handlebars";
import productsRouter from "./routers/products.router.js";
import cartsRouter from "./routers/carts.router.js";
import viewsRouter from "./routers/views.router.js";
import "./database.js"
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


app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionRouter);


app.listen(PORT, () => {
    console.log(`Servidor escuchando en el http://localhost:${PORT}`);
});
