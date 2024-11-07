import cartsService from "../services/carts.services.js";

class CartsController {

    async createCart(req, res) {
        try {
            const newCart = await cartsService.createCart();
            res.status(201).json(newCart);
        } catch (error) {
            res.status(500).send("Error interno del servidor");
        }
    }

    async getCartProducts(req, res) {
        const { cid } = req.params;
        try {
            const cart = await cartsService.getCartById(cid);
            if (!cart) return res.status(404).send("Carrito no encontrado");
            res.json(cart.products);
        } catch (error) {
            res.status(500).send("Error interno del servidor");
        }
    }

    async addProductToCart(req, res) {
        const { cid, pid } = req.params;
        const { quantity = 1 } = req.body;
        try {
            const cart = await cartsService.getCartById(cid);
            if (!cart) return res.status(404).send("Carrito no encontrado");

            const existingProduct = cart.products.find(item => item.product.toString() === pid);
            if (existingProduct) {
                existingProduct.quantity = (existingProduct.quantity || 0) + quantity;
            } else {
                cart.products.push({ product: pid, quantity });
            }
            await cartsService.updateCart(cid, cart);
            res.json(cart);
        } catch (error) {
            res.status(500).send("Error interno del servidor");
        }
    }
    async getAllCarts(req, res) {
        try {
            const carts = await cartsService.getAllCarts();
            res.json(carts);
        } catch (error) {
            res.status(500).send("Error interno del servidor");
        }
    }
    async getCartById(req, res) {
        try {
            const cart = await cartsService.getCartById(req.cartId);
            res.json(cart);
        } catch (error) {
            res.status(500).send("Error interno del servidor");
        }
    }
    async deleteCart(req, res) {
        const cartId = req.params.cid;
        try {
            const result = await cartsService.deleteCart(cartId);
            if (!result) {
                return res.status(404).json({ error: "Carrito no encontrado" });
            }
            res.json({ message: "Carrito eliminado exitosamente" });
        } catch (error) {
            console.error("Error al eliminar carrito", error);
            res.status(500).send(`Error interno del servidor: ${error.message}`);
        }
    }

    async deleteProductFromCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        try {
            const updatedCart = await cartsService.deleteProductFromCart(cartId, productId);
            if (updatedCart) {
                res.json({ message: "Producto eliminado del carrito exitosamente", carrito: updatedCart });
            } else {
                res.status(404).json({ error: "Carrito o producto no encontrado" });
            }
        } catch (error) {
            console.error("Error al eliminar producto del carrito", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async updateCart(req, res) {
        const cartId = req.params.cid;
        const products = req.body.products;
        try {
            const updatedCart = await cartsService.updateCart(cartId, products);
            if (!updatedCart) {
                return res.status(404).json({ error: "Carrito no encontrado" });
            }
            res.json({ message: "Carrito actualizado exitosamente", carrito: updatedCart });
        } catch (error) {
            console.error("Error al actualizar el carrito", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async updateProductQuantity(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const { quantity } = req.body;
        if (!quantity || quantity < 1) {
            return res.status(400).json({ error: "La cantidad debe ser un número positivo" });
        }
        try {
            const updatedCart = await cartsService.updateProductQuantity(cartId, productId, quantity);
            if (!updatedCart) {
                return res.status(404).json({ error: "Carrito o producto no encontrado" });
            }
            res.json({ message: "Cantidad de producto actualizada exitosamente", carrito: updatedCart });
        } catch (error) {
            console.error("Error al actualizar la cantidad del producto", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
    async purchaseCart(req, res) {
        const carritoId = req.params.cid;
        try {
            const carrito = await CartModel.findById(carritoId).populate("products.product");
            if (!carrito) {
                return res.status(404).json({ message: "Carrito no encontrado" });
            }

            const productosNoDisponibles = [];
            const productosComprados = [];

            for (const item of carrito.products) {
                const product = await ProductModel.findById(item.product._id);
                if (product && product.stock >= item.quantity) {
                    product.stock -= item.quantity;
                    await product.save();
                    productosComprados.push(item);
                } else {
                    productosNoDisponibles.push(item);
                }
            }

            const usuarioDelCarrito = await UsuarioModel.findOne({ cart: carritoId });
            if (!usuarioDelCarrito) {
                return res.status(404).json({ message: "Usuario del carrito no encontrado" });
            }

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
            console.error("Error en el proceso de compra:", error);
            res.status(500).send("Error del servidor al crear ticket");
        }
    }
}



export default CartsController;

