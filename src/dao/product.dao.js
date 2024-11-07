import ProductsModel from "./models/products.model.js";

class ProductDao {
    async getProducts({ limit, page, sort, query }) {
        try {
            const options = {
                limit,
                page,
                sort: sort ? { [sort]: 1 } : {}, // Cambiar a objeto vacío si no hay sort
            };
            const filter = query ? { category: query } : {};
            return await ProductsModel.paginate(filter, options);
        } catch (error) {
            console.error("Error al obtener productos:", error);
            throw error; // Lanzar el error para que pueda ser manejado en el controlador
        }
    }

    async getProductById(id) {
        try {
            const product = await ProductsModel.findById(id);
            if (!product) {
                console.log("Producto no encontrado");
                return null; // Retornar null si no se encuentra el producto
            }
            return product;
        } catch (error) {
            console.error("Error al obtener producto por ID:", error);
            throw error; // Lanzar el error
        }
    }

    async addProduct(productData) {
        try {
            return await ProductsModel.create(productData);
        } catch (error) {
            console.error("Error al agregar producto:", error);
            throw error; // Lanzar el error
        }
    }

    async updateProduct(id, productData) {
        try {
            const updatedProduct = await ProductsModel.findByIdAndUpdate(id, productData, { new: true });
            if (!updatedProduct) {
                console.log("Producto no encontrado para actualizar");
                return null; // Retornar null si no se encuentra el producto
            }
            return updatedProduct;
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
            throw error; // Lanzar el error
        }
    }

    async deleteProduct(id) {
        try {
            const deletedProduct = await ProductsModel.findByIdAndDelete(id);
            if (!deletedProduct) {
                console.log("Producto no encontrado para eliminar");
                return null; // Retornar null si no se encuentra el producto
            }
            return deletedProduct; // Retornar el producto eliminado
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            throw error; // Lanzar el error
        }
    }
}

export default new ProductDao();
