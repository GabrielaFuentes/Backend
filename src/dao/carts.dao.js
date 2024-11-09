import CartModel from "./models/carts.model.js";

class CartDao {
    async create(userId) {
        try {
            const newCart = new CartModel({
                user: userId,
                products: []
            });
            return await newCart.save();
        } catch (error) {
            console.error("Error al crear carrito:", error);
            throw error;
        }
    }

    async findCartById(cartId) {
        try {
            return await CartModel.findById(cartId).populate('products.productId');
        } catch (error) {
            console.error("Error al buscar carrito:", error);
            throw error;
        }
    }

    async addProductToCart(productId, cartId, quantity) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) throw new Error("Carrito no encontrado");

            const productIndex = cart.products.findIndex(
                item => item.productId.toString() === productId
            );

            if (productIndex >= 0) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({ productId, quantity });
            }

            return await cart.save();
        } catch (error) {
            console.error("Error al agregar producto al carrito:", error);
            throw error;
        }
    }

    async removeProductFromCart(productId, cartId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) throw new Error("Carrito no encontrado");

            cart.products = cart.products.filter(
                item => item.productId.toString() !== productId
            );

            return await cart.save();
        } catch (error) {
            console.error("Error al eliminar producto del carrito:", error);
            throw error;
        }
    }

    async updateCart(cartId, products) {
        try {
            return await CartModel.findByIdAndUpdate(
                cartId,
                { products },
                { new: true }
            );
        } catch (error) {
            console.error("Error al actualizar carrito:", error);
            throw error;
        }
    }
}

export default new CartDao();