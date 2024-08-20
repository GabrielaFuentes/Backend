import express from "express";
import ProductManager from "./controllers/product-manager.js";
import productsRouter from "./routers/products.router.js";
import CartsManager from "./controllers/carts-manager.js";
import cartsRouter from "./routers/carts.router.js";
import exphbs from 'express-handlebars';
import viewsRouter from "./routers/views.router.js";
import { Server } from "socket.io";
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const PORT = 8080;
const app = express();

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Express handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

export const productManager = new ProductManager();
export const cartsManager = new CartsManager();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

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

//Nos conectamos con MongoDB Atlas
mongoose.connect("mongodb+srv://gabrielafuentes21:hola7175@cluster0.cxrrp.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("funciona"))
    .catch(() => console.log("NO funciona"))