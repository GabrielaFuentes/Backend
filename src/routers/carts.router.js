import express from "express";
const router = express.Router();

import CartsController from "../controllers/carts.controller.js";
const cartsController = new CartsController();
import CartModel from "../dao/models/carts.model.js";
import ProductModel from "../dao/models/products.model.js";
import UsuarioModel from "../dao/models/user.model.js";
import TicketModel from "../dao/models/tickets.model.js";
import { calcularTotal } from "../utils/utils.js";

// Crear un nuevo carrito
router.post("/", cartsController.createCart);

// Obtener los productos de un carrito
router.get("/:cid", cartsController.getCartProducts);

// Agregar productos a un carrito
router.post("/:cid/product/:pid", cartsController.addProductToCart);

// Obtener todos los carritos
router.get("/", cartsController.getAllCarts);

// Eliminar un carrito
router.delete("/:cid", cartsController.deleteCart);

// Eliminar un producto de un carrito
router.delete("/:cid/product/:pid", cartsController.deleteProductFromCart);

// Actualizar un carrito
router.put("/:cid", cartsController.updateCart);

// Actualizar cantidad de productos en un carrito
router.put("/:cid/products/:pid", cartsController.updateProductQuantity);

router.get("/:cid/purchase", async (req, res) => {
    const carritoId = req.params.cid;
    try {
        const carrito = await CartModel.findById(carritoId);
        const arrayProductos = carrito.products;

        const productosNoDisponibles = [];
        const productosComprados = [];

        for (const item of arrayProductos) {
            const productId = item.product;
            const product = await ProductModel.findById(productId);
            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await product.save();
                productosComprados.push(item);
            } else {
                productosNoDisponibles.push(item);
            }
        }

        const usuarioDelCarrito = await UsuarioModel.findOne({ cart: carritoId });

        const ticket = new TicketModel({
            purchase_datetime: new Date(),
            amount: calcularTotal(productosComprados),
            purchaser: usuarioDelCarrito.email,
        });

        await ticket.save();

        carrito.products = productosNoDisponibles;

        await carrito.save();

        res.json({
            message: "Compra generada",
            ticket: {
                id: ticket._id,
                amount: ticket.amount,
                purchaser: ticket.purchaser,
            },
            productosNoDisponibles: productosNoDisponibles.map((item) => item.product),
        });
    } catch (error) {
        res.status(500).send("Error del servidor al crear ticket");
    }
});
export default router;







