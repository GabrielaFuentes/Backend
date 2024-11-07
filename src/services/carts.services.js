import cartsRepository from "../repository/carts.repository.js";

class CartsService {
    async createCart() {
        try {
            return await cartsRepository.createCart();
        } catch (error) {
            console.error("Error al crear el carrito:", error);
            throw new Error("No se pudo crear el carrito.");
        }
    }

    async getCartProducts(cartId) {
        try {
            return await cartsRepository.getCartById(cartId);
        } catch (error) {
            console.error("Error al obtener los productos del carrito:", error);
            throw new Error("No se pudieron obtener los productos del carrito.");
        }
    }

    async addProductToCart(cartId, productId, quantity) {
        try {
            return await cartsRepository.addProductToCart(cartId, productId, quantity);
        } catch (error) {
            console.error("Error al agregar producto al carrito:", error);
            throw new Error("No se pudo agregar el producto al carrito.");
        }
    }

    async getAllCarts() {
        try {
            return await cartsRepository.getAllCarts();
        } catch (error) {
            console.error("Error al obtener todos los carritos:", error);
            throw new Error("No se pudieron obtener los carritos.");
        }
    }

    async getCartById(cartId) {
        try {
            return await cartsRepository.getCartById(cartId);
        } catch (error) {
            console.error("Error al obtener el carrito:", error);
            throw new Error("No se pudo obtener el carrito.");
        }
    }

    async deleteCart(cartId) {
        try {
            return await cartsRepository.deleteCart(cartId);
        } catch (error) {
            console.error("Error al eliminar el carrito:", error);
            throw new Error("No se pudo eliminar el carrito.");
        }
    }

    async deleteProductFromCart(cartId, productId) {
        try {
            return await cartsRepository.deleteProductFromCart(cartId, productId);
        } catch (error) {
            console.error("Error al eliminar el producto del carrito:", error);
            throw new Error("No se pudo eliminar el producto del carrito.");
        }
    }

    async updateCart(cartId, products) {
        try {
            if (!Array.isArray(products)) {
                throw new Error("El formato de los productos es inválido.");
            }
            return await cartsRepository.updateCart(cartId, products);
        } catch (error) {
            console.error("Error al actualizar el carrito:", error);
            throw new Error("No se pudo actualizar el carrito.");
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            return await cartsRepository.updateProductQuantity(cartId, productId, quantity);
        } catch (error) {
            console.error("Error al actualizar la cantidad de productos en el carrito:", error);
            throw new Error("No se pudo actualizar la cantidad del producto.");
        }
    }

    async purchaseCart(cartId) {
        try {
            return await cartsRepository.purchaseCart(cartId);
        } catch (error) {
            console.error("Error al procesar la compra del carrito:", error);
            throw new Error("No se pudo procesar la compra del carrito.");
        }
    }
}

export default new CartsService();
