import express from "express";
import ProductManager from "../dao/db/product-manager-db.js";
import CartModel from "../dao/models/carts.model.js";
import { isAuthenticated, isAdmin, isUser } from "../middleware/auth.js";

const router = express.Router();
const productManager = new ProductManager();

// Rutas públicas
router.get("/", (req, res) => {
    res.render("home", { user: req.user });
});

router.get("/login", (req, res) => {
    if (req.user) return res.redirect('/products');
    res.render("login");
});

router.get("/register", (req, res) => {
    if (req.user) return res.redirect('/products');
    res.render("register");
});

// Rutas protegidas
router.get("/products", isAuthenticated, async (req, res) => {
    try {
        const { page = 1, limit = 9 } = req.query;
        const productos = await productManager.getProducts({
            page: parseInt(page),
            limit: parseInt(limit),
        });

        const nuevoArray = productos.docs.map(producto => {
            const { _id, ...rest } = producto.toObject();
            return { _id: _id.toString(), ...rest };
        });

        res.render("products", {
            productos: nuevoArray,
            hasPrevPage: productos.hasPrevPage,
            hasNextPage: productos.hasNextPage,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            currentPage: productos.page,
            totalPages: productos.totalPages,
            user: req.user
        });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.render("error", { message: "Error al cargar los productos" });
    }
});

router.get("/cart", isAuthenticated, async (req, res) => {
    try {
        if (!req.user || !req.user.cart) {
            return res.render("error", { message: "No se encontró el carrito" });
        }

        const cart = await CartModel.findById(req.user.cart)
            .populate('products.productId');

        if (!cart) {
            return res.render("error", { message: "Carrito no encontrado" });
        }

        // Calcular el total del carrito
        const cartTotal = cart.products.reduce((total, item) => {
            return total + (item.productId.price * item.quantity);
        }, 0);

        res.render("cart", {
            products: cart.products,
            cartId: cart._id,
            cartTotal,
            user: req.user
        });
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.render("error", { message: "Error al cargar el carrito" });
    }
});

router.get("/admin", isAuthenticated, isAdmin, async (req, res) => {
    try {
        const productos = await productManager.getProducts({});
        res.render("admin", {
            user: req.user,
            productos: productos.docs
        });
    } catch (error) {
        console.error("Error al cargar panel de administración:", error);
        res.render("error", { message: "Error al cargar el panel de administración" });
    }
});

router.get("/logout", isAuthenticated, (req, res) => {
    res.clearCookie("coderCookieToken");
    res.render("logout");
});

export default router;