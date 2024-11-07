import cartDao from "../dao/carts.dao.js";

class CartsRepository {
    async createCart() {
        return await cartDao.create();
    }

    async getCartById(cartId) {
        return await cartDao.findCartById(cartId);
    }

    async addProductToCart(cartId, productId, quantity) {
        return await cartDao.addProductToCart(productId, cartId, quantity);
    }

    async getAllCarts() {
        return await cartDao.findAll();
    }

    async deleteCart(cartId) {
        return await cartDao.deleteCart(cartId);
    }

    async deleteProductFromCart(cartId, productId) {
        return await cartDao.removeProductFromCart(productId, cartId);
    }

    async updateCart(cartId, products) {
        return await cartDao.updateCart(cartId, products);
    }

    async updateProductQuantity(cartId, productId, quantity) {
        return await cartDao.updateProductQuantity(productId, quantity, cartId);
    }
}

export default new CartsRepository();
