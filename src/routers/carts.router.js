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

// Obtener un carrito por ID con productos desglosados
router.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cart = await cartsModel.findById(cartId).populate("products.productId");
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

//Actualiza todo el carrito con un nuevo arreglo de productos.
router.put('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const { products } = req.body;

    try {
        const cart = await cartsModel.findByIdAndUpdate(cartId, { products }, { new: true });
        if (!cart) {
            return res.status(404).send({ status: "error", message: "Carrito no encontrado" });
        }

        res.status(200).send({ status: "success", message: "Carrito actualizado exitosamente", cart });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

//Actualiza solo la cantidad de un producto especifico.
router.put('/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;

    try {
        const cart = await cartsModel.findById(cartId);
        if (!cart) {
            return res.status(404).send({ status: "error", message: "Carrito no encontrado" });
        }

        const product = cart.products.find(p => p.productId.toString() === productId);
        if (!product) {
            return res.status(404).send({ status: "error", message: "Producto no encontrado en el carrito" });
        }

        product.quantity = quantity;
        await cart.save();

        res.status(200).send({ status: "success", message: "Cantidad de producto actualizada", cart });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

//elimina todo el carrito
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

//elimina un producto específico del carrito.
router.delete('/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const cart = await cartsModel.findById(cartId);
        if (!cart) {
            return res.status(404).send({ status: "error", message: "Carrito no encontrado" });
        }

        cart.products = cart.products.filter(p => p.productId.toString() !== productId);
        await cart.save();

        res.status(200).send({ status: "success", message: "Producto eliminado del carrito", cart });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});


export default router;

