import express from "express";
import ProductManager from "./controllers/product-manager.js";
import productsRouter from "./routers/products.router.js";
import CartManager from "./controllers/carts-manager.js";
import cartsRouter from "./routers/carts.router.js";
import exphbs from 'express-handlebars';
import viewsRouter from "./routers/views.router.js";
import { Server } from "socket.io";
import path from 'path';
import { fileURLToPath } from 'url';

const PORT = 8080;


// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Express handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

export const productManager = new ProductManager();
export const cartManager = new CartManager();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PORT, () => {
    console.log(`Escuchando en el puerto: ${PORT}`);
})

const io = new Server(httpServer);

io.on("connection", async (socket) => {
    console.log("Un cliente se conectó");

    // Enviar productos actuales al cliente
    socket.emit("productos", await productManager.getProducts());

    // Escuchar eventos para eliminar productos
    socket.on("eliminarProducto", async (id) => {
        await productManager.deleteProduct(id);
        io.emit("productos", await productManager.getProducts()); // Emitir eventos a todos los clientes
    });

    // Escuchar eventos para agregar productos
    socket.on("agregarProducto", async (product) => {
        await productManager.addProduct(product);
        io.emit("productos", await productManager.getProducts()); // Emitir eventos a todos los clientes
    });
});
