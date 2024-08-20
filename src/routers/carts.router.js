import { Router } from "express";
import cartsModel from "../models/carts.model.js";

const router = Router();


router.post('/', async (req, res) => {
    try {
        const newCart = new cartsModel({ timestamp: new Date().toISOString(), products: [] });
        await newCart.save();
        res.status(201).send({ message: 'Carrito creado exitosamente', cart: newCart });
    } catch (error) {
        res.status(500).send('Error interno del servidor: ' + error.message);
    }
});

router.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cart = await cartsModel.findById(cartId);
        if (!cart) {
            res.status(404).send({ status: "error", message: "Carrito no encontrado" });
        } else {
            res.status(200).send(cart);
        }
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

router.post('/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const cart = await cartsModel.findById(cartId);
        if (!cart) {
            return res.status(404).send({ status: "error", message: "Carrito no encontrado" });
        }

        // Añadir el producto al array de productos
        cart.products.push({ productId });
        await cart.save();

        res.status(200).send({ status: "success", message: "Producto agregado al carrito", cart });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

router.delete('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cart = await cartsModel.findByIdAndDelete(cartId);
        if (!cart) {
            return res.status(404).send({ status: "error", message: "Carrito no encontrado" });
        }
        res.status(200).send({ status: "success", message: "Carrito eliminado correctamente" });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

export default router;

