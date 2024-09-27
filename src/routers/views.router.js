import express from "express";
const router = express.Router();
import ProductsManager from "../dao/db/product-manager-db.js";
const manager = new ProductsManager();
import CartsManager from "../dao/db/carts-manager-db.js";
const cartsManager = new CartsManager();
import jwt from "jsonwebtoken";

router.get("/products", async (req, res) => {
    try {

        // Obtener parámetros de consulta, proporcionando valores predeterminados si no se especifican
        const limit = parseInt(req.query.limit) || 9; // Número de productos por página
        const page = parseInt(req.query.page) || 1; // Página actual
        const skip = (page - 1) * limit; // Número de productos a omitir
        const sortOrder = req.query.sortOrder || null; // Orden de los productos
        const filter = req.query.filter || {}; // Filtros aplicados

        const username = req.session.username; // Obtén el nombre del usuario
        req.session.username = null; // Limpia la sesión para no mostrar el mensaje de nuevo

        // Obtener los productos con paginación
        const productos = await manager.getProducts({
            limit,
            skip,
            sortOrder,
            filter,
            page
        });

        // Contar el total de productos para calcular el número total de páginas
        const totalProducts = await manager.countProducts(filter);
        const totalPages = Math.ceil(totalProducts / limit);

        // Determinar las páginas previa y siguiente
        const prevPage = page > 1 ? page - 1 : null;
        const nextPage = page < totalPages ? page + 1 : null;

        // Renderizar la vista con los datos necesarios
        res.render("home", {
            username,
            productos,
            prevPage,
            nextPage,
            sort: sortOrder,
            page,
            totalPages
        });
    } catch (error) {
        res.status(500).send('Error al obtener productos: ' + error.message);
    }
});


router.get("/products/:pid", async (req, res) => {
    const id = req.params.pid;
    try {
        const producto = await manager.getProductById(id);
        if (!producto) {
            res.status(404).send("Producto no encontrado");
        } else {
            res.render("product", { product: producto });
        }
    } catch (error) {
        res.status(500).send('Error al obtener producto por ID: ' + error.message);
    }
});

router.get("/carts/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartsManager.getCartById(cid);
        res.render("cartDetails", { cart, cid });
    } catch (error) {
        res.status(500).send("Error al obtener el carrito");
    }
});

router.get("/carrito", async (req, res) => {
    try {

        let cartId = req.session.cartId || req.query.cartId; // Asegúrate de obtener el ID del carrito
        console.log(cartId);
        if (!cartId) {
            const newCart = await cartsManager.addCart(); // Crear un nuevo carrito
            req.session.cartId = newCart._id; // Guardar el nuevo ID en la sesión
            cartId = newCart._id;
        }

        const carrito = await cartsManager.getCartById(cartId);

        if (!carrito || carrito.length === 0) {
            return res.status(404).send("El carrito está vacío");
        }

        res.render("carrito", { carrito }); // Renderiza la vista del carrito con los productos
    } catch (error) {
        res.status(500).send("Error al cargar el carrito: " + error.message);
    }
});


// Ruta de logout
router.get('/logout', (req, res) => {
    const username = req.session.username // Guardamos el nombre de usuario antes de destruir la sesión
    console.log(username)
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('No se pudo cerrar sesión');
        }
        // Redirigir a la página de despedida con el nombre del usuario
        res.render('logout')
    });
});


router.get("/realtimeproducts", (req, res) => {
    res.render("realtimeproducts");
});

router.get('/products/add', (req, res) => {
    res.render('addProduct');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

export default router