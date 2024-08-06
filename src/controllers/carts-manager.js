import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';

class CartManager {
    constructor() {
        this.path = './src/data/carts.json';;
        this.carts = [];
        this.loadCarts();
    }

    async loadCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            this.carts = JSON.parse(data);
        } catch (error) {
            console.error("Error loading carts:", error);
            this.carts = [];
        }
    }

    async saveCarts() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
        } catch (error) {
            console.error("Error saving carts:", error);
            throw error;
        }
    }
    async addCart() {
        await this.loadCarts(); // Asegúrate de que los carritos estén cargados
        const id = uuidv4();
        const newCart = { id, products: [] };
        this.carts.push(newCart);
        await this.saveCarts();
        return newCart;
    }

    async getCarts() {
        return this.carts;
    }

    async getCartById(id) {

        return this.carts.find(cart => cart.id === id);

    }

    async deleteCart(id) {
        const index = this.carts.findIndex(cart => cart.id === id);
        if (index !== -1) {
            this.carts.splice(index, 1);
            await this.saveCarts();
            return true;
        } else {
            throw new Error("Cart not found");
        }
    }
    async addProductToCart(cartId, productId) {
        await this.loadCarts(); // Asegúrate de que los carritos estén cargados
        const cart = this.carts.find(cart => cart.id === cartId);
        if (!cart) {
            throw new Error("Cart not found");
        }

        // Validar que el producto exista
        // Aquí deberías hacer una validación real, dependiendo de tu implementación
        if (!productId) {
            throw new Error("Invalid product ID");
        }

        const existingProduct = cart.products.find(item => item.product === productId);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await this.saveCarts();

        return cart;
    }

    async deleteCart(cartId) {
        const index = this.carts.findIndex(cart => cart.id === cartId);
        if (index !== -1) {
            this.carts.splice(index, 1);
            await this.saveCarts();
            return true;
        } else {
            throw new Error("Cart not found");
        }

    }
}



export default CartManager;