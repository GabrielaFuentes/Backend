import express from "express";
import passport from "passport";
import ProductManager from "../dao/db/product-manager-db.js";
import CartManager from "../dao/db/carts-manager-db.js";
import { onlyAdmin, onlyUser } from "../middleware/auth.js";


const router = express.Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

// Ruta para el formulario de login:
router.get("/login", (req, res) => {
    if (req.session?.login) {
        return res.redirect("/products");
    }
    res.render("login");
});

// Ruta para el formulario de Register:
router.get("/register", (req, res) => {
    if (req.session?.login) {
        return res.redirect("/products");
    }
    res.render("register");
});

// Ruta para el formulario de Perfil:
router.get("/profile", passport.authenticate("jwt", { session: false }), (req, res) => {
    if (!req.user) {
        return res.redirect("/login");
    }
    res.render("profile", {
        first_name: req.user.first_name,
        user: req.user,
    });
});

// Rutas de productos
router.get("/products", passport.authenticate("jwt", { session: false }), onlyUser, async (req, res) => {
    try {
        const { page = 1, limit = 9 } = req.query;  // Usamos los parámetros de paginación
        const productos = await productManager.getProducts({
            page: parseInt(page),
            limit: parseInt(limit),
        });
        console.log("Ruta /products alcanzada");


        const nuevoArray = productos.docs.map((producto) => {
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
            user: req.user,
            //cartId: req.user.cart._id,
        });
        console.log(req.user);
    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).json({
            status: "error",
            error: "Error interno del servidor",
        });
    }
});

// Ruta para ver producto por ID:
router.get("/products/:pid", async (req, res) => {
    const id = req.params.pid;
    try {
        const producto = await productManager.getProductById(id);
        if (!producto) {
            res.status(404).send("Producto no encontrado");
        } else {
            res.render("product", { product: producto });
        }
    } catch (error) {
        res.status(500).send('Error al obtener producto por ID: ' + error.message);
    }
});

// Rutas relacionadas a carritos
router.get("/carts/:cid", async (req, res) => {
    const cartId = req.params.cid;
    try {
        const carrito = await cartManager.getCarritoById(cartId);
        if (!carrito) {
            console.log("No existe ese carrito con el id");
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        const productosEnCarrito = carrito.products.map((item) => ({
            product: item.product.toObject(),
            quantity: item.quantity,
        }));

        res.render("carts", { productos: productosEnCarrito });
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Ruta para crear un carrito:
router.get("/createCart", (req, res) => {
    res.render("createCart");
});

// Ruta para eliminar un carrito:
router.get("/deleteCart", (req, res) => {
    res.render("deleteCart");
});

// Nueva ruta para listar carritos:
router.get("/listCarts", passport.authenticate("jwt", { session: false }), (req, res) => {
    if (!req.user) {
        return res.redirect("/login");
    }
    res.render("listCarts", {
        cartId: req.user.cart._id,
    });
});

// Otras rutas
router.get("/realtimeproducts", passport.authenticate("jwt", { session: false }), onlyAdmin, (req, res) => {
    res.render("realtimeproducts");
});

// Ruta de logout
router.get('/logout', (req, res) => {
    const username = req.session.username;
    console.log(username);
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('No se pudo cerrar sesión');
        }
        res.render('logout');
    });
});

// Ruta para la página de inicio:
router.get("/", (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user) => {
        if (err) return next(err);
        if (!user) {
            res.render("login");
        } else {
            req.user = user;
            res.render("home", {
                first_name: user.first_name,
                user: user,
            });
        }
    })(req, res, next);
});

export default router;
