import productDao from "../dao/product.dao.js";

class ProductRepository {
    async getProducts(options) {
        return await productDao.getProducts(options);
    }

    async getProductsById(id) {
        return await productDao.getProductById(id);
    }

    async addProduct(productData) {
        return await productDao.addProduct(productData);
    }

    async updateProduct(id, productData) {
        return await productDao.updateProduct(id, productData); // Corrección aquí
    }

    async deleteProduct(id) {
        return await productDao.deleteProduct(id); // Agregado await para consistencia
    }
}

export default new ProductRepository();
