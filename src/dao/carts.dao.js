import CartsModel from "./models/carts.model.js";


class CartDao {
    async create() {
        const newCart = new CartsModel();
        return await newCart.save();
    }
    async findCartById(cartId) {
        return await CartsModel.findById(cartId).populate('products.product', '_id title price');
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
        const productIndex = cart.products.findIndex((p) => p.product.toString() == productId);
        if (productIndex > -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }
        return await cart.save();
    }
    async removeProductFromCart(productId, cartId) {
        const cart = await CartsModel.findById(cartId);
        if (!cart) {
            throw new Error('Cart not found');
        }
        cart.products = cart.products.filter((p) => p.product.toString() !== productId); return await cart.save();
    }
    async updateCart(cartId, products) {
        return await CartsModel.findByIdAndUpdate(cartId, { products }, { new: true });
    }
    async updateProductQuantity(productId, quantity, cartId) {
        const cart = await CartsModel.findById(cartId);
        if (!cart) {
            throw new Error('Cart not found');
        }
        const productIndex = cart.products.findIndex((p) => p.product.toString() == productId);
        if (productIndex > -1) {
            cart.products[productIndex].quantity = quantity;
        }
        else {
            throw new Error('Product not found');
        }
        return await cart.save();
    }

    async deleteCart(cartId) {
        return await CartsModel.findByIdAndDelete(cartId);
    }
}

export default new CartDao(); 