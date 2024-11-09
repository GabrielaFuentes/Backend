import express from "express";
import { engine as handlebarsEngine } from "express-handlebars";
import productsRouter from "./routers/products.router.js";
import cartsRouter from "./routers/carts.router.js";
import viewsRouter from "./routers/views.router.js";
import sessionRouter from './routers/sessions.router.js';
import initializeDatabase from "./database.js";
import passport from "passport";
import initializePassport from './config/passport.config.js';
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import http from 'http';
import { Server as socketIo } from 'socket.io';
import Handlebars from 'handlebars';
import { calcularTotal } from './utils/utils.js';



dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new socketIo(server);
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));
app.use(cookieParser());

// Passport
initializePassport();
app.use(passport.initialize());

// Handlebars
app.engine("handlebars", handlebarsEngine({
    defaultLayout: "main",
    helpers: {
        eq: function (a, b) {
            return a === b;
        }
    }
}));
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionRouter);
app.use("/", viewsRouter);

// Socket.IO
io.on("connection", (socket) => {
    console.log("Cliente conectado");
    socket.on("disconnect", () => {
        console.log("Cliente desconectado");
    });
});


// Ruta para renderizar el carrito
app.get('/carrito', async (req, res) => {
    // Supongamos que obtienes los productos desde la base de datos
    const productos = await obtenerProductosDelCarrito(); // Aquí obtienes los productos con productId y quantity

    // Calcula el total
    const total = await calcularTotal(productos);

    // Renderiza la plantilla pasándole los productos y el total
    res.render('carrito', { products, total });
});
// Iniciar servidor
const startServer = async () => {
    try {
        await initializeDatabase();
        server.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

startServer();