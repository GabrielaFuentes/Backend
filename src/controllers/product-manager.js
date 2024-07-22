import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';

class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.loadProducts();
    }

    async loadProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            console.error("Error loading products:", error);
            this.products = [];
        }
    }
    async addProduct({ title, description, code, price, status, stock, category, thumbnails  }) {
        const id = uuidv4();
        let newProduct = { id, title, description, code, price, status, stock, category, thumbnails };
        this.products.push(newProduct);

        try {
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
            return newProduct;
        } catch (error) {
            console.error("Error writing file:", error);
            throw error;
        }
    }

    async getProducts() {
        await this.loadProducts();
        return this.products;
    }

    async getProductById(id) {
       await this.loadProducts();
        return this.products.find(product => product.id === id);
    }


async deleteProduct(id) {
  
    const index = this.products.findIndex(product => product.id === id);
    if (index !== -1) {
        this.products.splice(index, 1);
        try {
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.error("Error writing file:", error);
            throw error;
        }
        return true;
    } else {
        throw new Error("Product not found");
    }
}

async updateProduct(id, { title, description, code, price, status, stock, category, thumbnails }) {

    const index = this.products.findIndex(product => product.id === id);
    if (index !== -1) {
        this.products[index] = { id, title, description, price, thumbnails, code, stock, status, category };
        try {
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.error("Error writing file:", error);
            throw error;
        }
        return this.products[index];
    } else {
        throw new Error("Product not found");
    }
}
}



export default ProductManager;
