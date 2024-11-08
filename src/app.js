import express from "express";
import { engine as handlebarsEngine } from "express-handlebars";
import productsRouter from "./routers/products.router.js";
import cartsRouter from "./routers/carts.router.js";
import viewsRouter from "./routers/views.router.js";
import initializeDatabase from "./database.js";
import passport from "passport";
import initializePassport from './config/passport.config.js';
import sessionRouter from './routers/sessions.router.js';
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import http from 'http';
import { Server as socketIo } from 'socket.io';
dotenv.config();

// Verifica que el JWT_SECRET esté siendo cargado
console.log("JWT_SECRET:", process.env.JWT_SECRET);

const PORT = 8080;
const app = express();

// Crea el servidor HTTP con Express
const server = http.createServer(app);

// Inicializa Socket.IO con el servidor HTTP
const io = new socketIo(server);
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

// Conexión de Socket.IO
io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");

    // Puedes emitir productos o datos desde el servidor cuando un cliente se conecta
    socket.emit("productos", /* tu lista de productos */);

    // Puedes agregar más lógica según sea necesario
    socket.on("disconnect", () => {
        console.log("Cliente desconectado");
    });
});

// Conexión a la base de datos y levantamiento del servidor
const startServer = async () => {
    try {
        await initializeDatabase(); // Espera a que la base de datos se conecte correctamente
        server.listen(PORT, () => {
            console.log(`Servidor escuchando en el http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error inicializando la base de datos: ', error);
        process.exit(1); // Detiene el proceso si hay un error de conexión a la DB
    }
};

startServer();
