import CartModel from "../dao/models/carts.model.js";
import ProductModel from "../dao/models/products.model.js";
import TicketModel from "../dao/models/tickets.model.js";
import UserModel from "../dao/models/user.model.js";

class CartsController {
    async createCart(req, res) {
        try {
            const newCart = await CartModel.create({
                user: req.user?._id,
                products: []
            });
            res.status(201).json(newCart);
        } catch (error) {
            console.error("Error al crear carrito:", error);
            res.status(500).json({ error: "Error al crear el carrito" });
        }
    }

    async getCartProducts(req, res) {
        try {
            const cart = await CartModel.findById(req.params.cid).populate('products.productId');

            if (!cart) {
                return res.status(404).json({ error: "Carrito no encontrado" });
            }

            // Confirma que los productos tienen toda la información
            console.log("Productos en el carrito:", cart.products);
            res.json({ productos: cart.products }); // Asegúrate de que el nombre coincide con el que usas en la vista
        } catch (error) {
            console.error("Error al obtener productos del carrito:", error);
            res.status(500).json({ error: "Error al obtener productos del carrito" });
        }
    }


    async addProductToCart(req, res) {
        try {
            const { cid, pid } = req.params;
            const { quantity = 1 } = req.body;

            const cart = await CartModel.findById(cid);
            if (!cart) {
                return res.status(404).json({ error: "Carrito no encontrado" });
            }

            const product = await ProductModel.findById(pid);
            if (!product) {
                return res.status(404).json({ error: "Producto no encontrado" });
            }

            const productIndex = cart.products.findIndex(
                item => item.productId.toString() === pid
            );

            if (productIndex >= 0) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({ productId: pid, quantity });
            }

            await cart.save();
            res.json(cart);
        } catch (error) {
            console.error("Error al agregar producto al carrito:", error);
            res.status(500).json({ error: "Error al agregar producto al carrito" });
        }
    }

    async deleteProductFromCart(req, res) {
        try {
            const { cid, pid } = req.params;

            const cart = await CartModel.findById(cid);
            if (!cart) {
                return res.status(404).json({ error: "Carrito no encontrado" });
            }

            cart.products = cart.products.filter(
                item => item.productId.toString() !== pid
            );

            await cart.save();
            res.json({ message: "Producto eliminado del carrito", cart });
        } catch (error) {
            console.error("Error al eliminar producto del carrito:", error);
            res.status(500).json({ error: "Error al eliminar producto del carrito" });
        }
    }

    async updateCart(req, res) {
        try {
            const { cid } = req.params;
            const { products } = req.body;

            const cart = await CartModel.findById(cid);
            if (!cart) {
                return res.status(404).json({ error: "Carrito no encontrado" });
            }

            cart.products = products;
            await cart.save();
            res.json(cart);
        } catch (error) {
            console.error("Error al actualizar carrito:", error);
            res.status(500).json({ error: "Error al actualizar carrito" });
        }
    }

    async purchaseCart(req, res) {
        try {
            const { cid } = req.params;
            const cart = await CartModel.findById(cid).populate('products.productId');

            if (!cart) {
                return res.status(404).json({ error: "Carrito no encontrado" });
            }

            const user = await UserModel.findOne({ cart: cid });
            if (!user) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            let totalAmount = 0;
            const failedProducts = [];
            const successfulProducts = [];

            for (const item of cart.products) {
                const product = await ProductModel.findById(item.productId);

                if (product && product.stock >= item.quantity) {
                    product.stock -= item.quantity;
                    await product.save();

                    totalAmount += product.price * item.quantity;
                    successfulProducts.push(item);
                } else {
                    failedProducts.push(item);
                }
            }

            if (successfulProducts.length > 0) {
                const ticket = await TicketModel.create({
                    purchaser: user.email,
                    amount: totalAmount
                });

                cart.products = failedProducts;
                await cart.save();

                res.json({
                    status: "success",
                    ticket,
                    failedProducts
                });
            } else {
                res.status(400).json({
                    status: "error",
                    message: "No se pudo procesar ningún producto"
                });
            }
        } catch (error) {
            console.error("Error en la compra:", error);
            res.status(500).json({ error: "Error al procesar la compra" });
        }
    }
}

export default new CartsController();