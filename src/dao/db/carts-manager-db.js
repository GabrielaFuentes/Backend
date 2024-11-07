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
    async getCartById(cartId) {
        if (!cartId) {
            throw new Error("Cart ID is required");
        }
        try {
            const cart = await CartsModel.findById(cartId).populate('products.productId');
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
                cart.products.push({ product: productId, quantity });
            }

            cart.markModified("products");


            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error adding product to cart:", error);
            throw new Error("Error adding product to cart");
        }
    }

    async deleteCart(cartId) {
        try {
            const deletedCart = await CartsModel.findByIdAndDelete(cartId);
            if (!deletedCart) {
                console.log("No cart found with the provided ID");
                return null;
            }
            console.log("Cart deleted successfully");
            return deletedCart;
        } catch (error) {
            console.log("Error deleting the cart", error);
            throw error;
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            // Find the cart and update by removing the specific product
            const updatedCart = await CartsModel.findByIdAndUpdate(cartId, { $pull: { products: { product: productId } } }, { new: true });

            if (!updatedCart) {
                console.log("No cart found with the ID or the product was not found in the cart");
                return null;
            }

            console.log(`Producto ${productId} eliminado del carrito ${cartId}:`, updatedCart);
            return updatedCart;
        } catch (error) {
            console.log("Error removing product from cart", error);
            throw error;
        }
    }

    async updateCart(cartId, products) {
        try {
            const cart = await CartsModel.findById(cartId);
            if (!cart) {
                console.log("No cart found with the ID");
                return null;
            }

            cart.products = products;

            // Mark the "products" property as modified before saving
            cart.markModified("products");

            await cart.save();
            console.log("Cart updated successfully:", cart);
            return cart;
        } catch (error) {
            console.log("Error updating the cart", error);
            throw error;
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await CartsModel.findById(cartId);
            if (!cart) {
                console.log(`No cart found with the ID ${cartId}`);
                return null;
            }

            const productToUpdate = cart.products.find(item => item.productId.toString() === productId);
            if (!productToUpdate) {
                console.log(`Product ${productId} not found in the cart ${cartId}`);
                return null;
            }

            productToUpdate.quantity = quantity;

            cart.markModified("products");

            await cart.save();
            console.log("Product quantity updated successfully:", cart);
            return cart;
        } catch (error) {
            console.log("Error updating product quantity", error);
            throw error;
        }
    }



}

export default CartManager;