import { Router } from "express";
import CartManager from "../controllers/carts-manager.js"

const router = Router(); 

const manager = new CartManager("./src/data/carts.json");

router.post('/', async (req, res) => {
    try {
        const newCart = await manager.addCart();
        res.status(201).send({ message: 'Carrito creado exitosamente', cart: newCart });
    } catch (error) {
        res.status(500).send('Error interno del servidor: ' + error.message);
    }
});

router.get('/:cid', async (req, res) => {
   const cartId = req.params.cid;
    try {
        const cart = await manager.getCartById(cartId);
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
        const cart = await manager.addProductToCart(cartId, productId);
        res.status(200).send(cart);
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
    console.log(cartId)
    console.log(productId)
});

router.delete('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    try {
        await manager.deleteCart(cartId);
        res.status(200).send({ status: "success", message: "Carrito eliminado correctamente" });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});



export default router;

