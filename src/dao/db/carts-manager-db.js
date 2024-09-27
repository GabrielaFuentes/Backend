import CartsModel from '../models/carts.model.js';

class CartManager {
    async addCart() {
        try {
            const newCart = new CartsModel({
                timestamp: new Date().toLocaleString(),
                products: [],
            });
            await newCart.save();
            return newCart;
        } catch (error) {
            console.error("Error saving cart:", error);
            throw new Error("Could not save cart");
        }
    }
    async getCartById(id) {
        if (!id) {
            throw new Error("Cart ID is required");
        }
        try {
            const cart = await CartsModel.findById(id).populate('products.productId');
            if (!cart) {
                throw new Error("Cart not found");
            }
            return cart;
        } catch (error) {
            console.error("Error getting cart:", error);
            throw new Error("Error retrieving cart");
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        if (!cartId || !productId || quantity <= 0) {
            throw new Error("Invalid input parameters");
        }
        try {
            const cart = await this.getCartById(cartId);
            const existingProduct = cart.products.find(item => item.productId.toString() === productId);
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({ productId, quantity });
            }
            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error adding product to cart:", error);
            throw new Error("Error adding product to cart");
        }
    }

    async deleteCart(cartId) {
        if (!cartId) {
            throw new Error("Cart ID is required");
        }
        try {
            const cart = await CartsModel.findByIdAndDelete(cartId);
            if (!cart) {
                throw new Error("Cart not found");
            }
            return true;
        } catch (error) {
            console.error("Error deleting cart:", error);
            throw new Error("Error deleting cart");
        }
    }
}

export default CartManager;