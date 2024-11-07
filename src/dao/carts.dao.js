import CartsModel from "./models/carts.model.js";
import ProductsModel from "./models/products.model.js"; // Asegúrate de importar el modelo de productos

class CartDao {
    async create() {
        const newCart = new CartsModel();
        return await newCart.save();
    }

    async findCartById(cartId) {
        return await CartsModel.findById(cartId).populate('products.productId', '_id title price');
    }

    async addProductToCart(productId, cartId, quantity) {
        const cart = await CartsModel.findById(cartId);
        if (!cart) {
            throw new Error('Cart not found');
        }
        const product = await ProductsModel.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        const productIndex = cart.products.findIndex((p) => p.productId.toString() === productId);
        if (productIndex > -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ productId, quantity });
        }
        return await cart.save();
    }

    async removeProductFromCart(productId, cartId) {
        const cart = await CartsModel.findById(cartId);
        if (!cart) {
            throw new Error('Cart not found');
        }
        cart.products = cart.products.filter((p) => p.productId.toString() !== productId);
        return await cart.save();
    }

    async updateCart(cartId, products) {
        return await CartsModel.findByIdAndUpdate(cartId, { products }, { new: true });
    }

    async updateProductQuantity(productId, quantity, cartId) {
        const cart = await CartsModel.findById(cartId);
        if (!cart) {
            throw new Error('Cart not found');
        }
        const productIndex = cart.products.findIndex((p) => p.productId.toString() === productId);
        if (productIndex > -1) {
            cart.products[productIndex].quantity = quantity;
        } else {
            throw new Error('Product not found');
        }
        return await cart.save();
    }

    async deleteCart(cartId) {
        return await CartsModel.findByIdAndDelete(cartId);
    }
}

export default new CartDao();
