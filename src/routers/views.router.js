import { Router } from "express";
import ProductsModel from "../dao/models/products.model.js";
import cartsModel from "../dao/models/carts.model.js";

const router = Router();

// Ruta para mostrar todos los productos con paginación
router.get('/products', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // Número de productos por página

    try {
        const products = await ProductsModel.paginate({}, { page, limit });

        res.render('index', {
            products: products.docs,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            cartId: '66c3e790508594df391d098e'  // Reemplaza con el ID del carrito actual
        });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

// Ruta para ver los detalles de un producto específico
router.get('/products/:pid', async (req, res) => {
    const productId = req.params.pid;

    try {
        const product = await ProductsModel.findById(productId);
        if (!product) {
            return res.status(404).send({ status: "error", message: "Producto no encontrado" });
        }

        res.render('product', {
            product,
            cartId: '66c3e790508594df391d098e'  // Reemplaza con el ID del carrito actual
        });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

// Ruta para agregar un producto al carrito (sin ver detalles)
router.post('/carts/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const cart = await cartsModel.findById(cartId);
        if (!cart) {
            return res.status(404).send({ status: "error", message: "Carrito no encontrado" });
        }

        const productInCart = cart.products.find(p => p.productId.toString() === productId);
        if (productInCart) {
            productInCart.quantity += 1;
        } else {
            cart.products.push({ productId, quantity: 1 });
        }

        await cart.save();
        res.redirect('/products');
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

export default router;

