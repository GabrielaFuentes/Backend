import productDao from "../dao/product.dao.js";

class ProductRepository {

    async getProducts(options) {
        return await productDao.getProducts(options)
    }
    async getProductsById(id) {
        return await productDao.getProductById(id);
    }
    async addProduct(productData) {
        return await productDao.addProduct(productData);
    }

    async updateProduct(id, productData) {
        return await productDao.update(id, productData);
    }

    async deleteProduct(id) {
        return productDao.delete(id);
    }

}
export default new ProductRepository();