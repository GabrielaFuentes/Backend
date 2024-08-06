import express from "express";
import { Server } from "socket.io"; // Importar Server de socket.io
import http from "http"; // Importar el módulo http de Node.js
import path from 'path';
import { fileURLToPath } from 'url';
import productRouter from "./routers/products.router.js"; // Importar correctamente
import cartRouter from "./routers/carts.router.js"; // Importar correctamente
import viewsRouter from "./routers/views.router.js"; // Importar correctamente
import exphbs from 'express-handlebars';

import ProductManager from "./controllers/product-manager.js"; // Importar correctamente
import CartsManager from "./controllers/carts-manager.js"; // Importar correctamente

const app = express();
const PORT = 8080;

const productManager = new ProductManager();
const cartsManager = new CartsManager();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Asegúrate de que la ruta sea correcta

// Configuración de Handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);

// Crear el servidor HTTP
const httpServer = http.createServer(app);

// Crear instancia de Socket.IO
const io = new Server(httpServer);

io.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado");

    socket.emit("productos", await productManager.getProducts());

    socket.on("eliminarProducto", async (id) => {
        await productManager.deleteProduct(id);
        io.emit("productos", await productManager.getProducts()); // Asegúrate de que se llame a la función
    });
});
// Iniciar el servidor HTTP
httpServer.listen(PORT, () => {
    console.log(`Escuchando en el http://localhost:${PORT}`);
});




export { productManager, cartsManager };
