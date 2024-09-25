import express from "express";
import ProductManager from "./dao/db/product-manager-db.js";
import productsRouter from "./routers/products.router.js";
import CartsManager from "./dao/db/carts-manager-db.js";
import cartsRouter from "./routers/carts.router.js";
import exphbs from 'express-handlebars';
import viewsRouter from "./routers/views.router.js";
import { Server } from "socket.io";
import path from 'path';
import { fileURLToPath } from 'url';
import "./database.js"
import passport from "passport";
import initializePassport from './config/passport.config.js';
import sessionRoutes from './routers/sessions.router.js';
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from 'mongoose';

const PORT = 8080;
const app = express();

const mongoUrl = "mongodb+srv://gabrielafuentes21:hola7175@cluster0.cxrrp.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Cluster0"

const database = async () => {
    try {
        await mongoose.connect(mongoUrl);
        console.log("Conectado a MongoDB Atlas");
    } catch (error) {
        console.error("Error de conexión a MongoDB", error);
        process.exit(1); // Termina el proceso si no puede conectarse
    }
};

database();


// Express handlebars
app.engine("handlebars", exphbs.engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
    }
}));
// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const productManager = new ProductManager();
export const cartsManager = new CartsManager();

app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));



app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: "hola7175",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: "mongodb+srv://gabrielafuentes21:hola7175@cluster0.cxrrp.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Cluster0" })
}));

initializePassport();
app.use(passport.initialize());

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use('/api/sessions', sessionRoutes);

const httpServer = app.listen(PORT, () => {
    console.log(`Escuchando en el puerto: ${PORT}`);
});

const io = new Server(httpServer);

io.on("connection", async (socket) => {
    console.log("Un cliente se conectó");

    socket.emit("productos", await productManager.getProducts());

    socket.on("eliminarProducto", async (id) => {
        await productManager.deleteProduct(id);
        io.emit("productos", await productManager.getProducts());
    });
});
