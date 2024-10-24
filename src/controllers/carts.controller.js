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
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({ product: pid, quantity });
            }
            await cartService.updateCart(cid, cart);
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
            const result = await cartService.deleteCart(cartId);
            if (!result) {
                return res.status(404).json({ error: "Carrito no encontrado" });
            }
            res.json({ message: "Carrito eliminado exitosamente" });
        } catch (error) {
            console.error("Error al eliminar carrito", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async deleteProductFromCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        try {
            const updatedCart = await cartService.deleteProductFromCart(cartId, productId);
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
            const updatedCart = await cartService.updateCart(cartId, products);
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
            const updatedCart = await cartService.updateProductQuantity(cartId, productId, quantity);
            if (!updatedCart) {
                return res.status(404).json({ error: "Carrito o producto no encontrado" });
            }
            res.json({ message: "Cantidad de producto actualizada exitosamente", carrito: updatedCart });
        } catch (error) {
            console.error("Error al actualizar la cantidad del producto", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}



export default CartsController;

