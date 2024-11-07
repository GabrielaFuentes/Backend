import productRepository from "../repository/product.repository.js";

class ProductService {
    async getProducts(options) {
        try {
            return await productRepository.getProducts(options);
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw new Error('No se pudieron obtener los productos');
        }
    }

    async getProductById(id) {
        try {
            const product = await productRepository.getProductById(id);
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            return product;
        } catch (error) {
            console.error('Error al obtener el producto por ID:', error);
            throw new Error('No se pudo obtener el producto');
        }
    }

    async addProduct(productData) {
        try {
            return await productRepository.addProduct(productData);
        } catch (error) {
            console.error('Error al agregar producto:', error);
            throw new Error('No se pudo agregar el producto');
        }
    }

    async updateProduct(id, productData) {
        try {
            const updatedProduct = await productRepository.updateProduct(id, productData);
            if (!updatedProduct) {
                throw new Error('Producto no encontrado para actualizar');
            }
            return updatedProduct;
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            throw new Error('No se pudo actualizar el producto');
        }
    }

    async deleteProduct(id) {
        try {
            const deletedProduct = await productRepository.deleteProduct(id);
            if (!deletedProduct) {
                throw new Error('Producto no encontrado para eliminar');
            }
            return deletedProduct;
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            throw new Error('No se pudo eliminar el producto');
        }
    }
}

export default new ProductService();
