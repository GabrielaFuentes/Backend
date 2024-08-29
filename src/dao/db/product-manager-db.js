import ProductsModel from "../models/products.model.js";

class ProductManager {
    async addProduct({ title, description, code, price, status, stock, category, thumbnails }) {
        try {
            if (!title || !description || !price || !status || !code || !stock || !category) {
                console.log("Todos los campos son obligatorios");
                return;
            }

            const codeExists = await ProductsModel.findOne({ code: code });
            if (codeExists) {
                console.log("El código debe ser único");
                return;
            }

            const newProduct = new ProductsModel({
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
                thumbnails
            });

            await newProduct.save();
            console.log("Producto agregado exitosamente");

        } catch (error) {
            console.error("Error al agregar producto", error);
            throw error;
        }
    }
    async getProducts({ limit = 10, skip = 0, sortOrder = null, filter = {} } = {}) {
        try {
            // Configurar la consulta
            let query = ProductsModel.find(filter);

            // Aplicar ordenación si se especifica
            if (sortOrder) {
                const sort = sortOrder === 'asc' ? 1 : -1;
                query = query.sort({ price: sort }); // Ordenar por precio como ejemplo, puedes cambiar el campo
            }

            // Aplicar paginación
            query = query.skip(skip).limit(limit);

            // Ejecutar la consulta
            const arrayProducts = await query.exec();
            return arrayProducts;
        } catch (error) {
            console.error("Error al obtener productos", error);
            throw error;
        }
    }


    async getProductById(id) {
        try {
            const searchProduct = await ProductsModel.findById(id);
            if (!searchProduct) {
                console.log("Producto no encontrado");
                return null;
            }
            console.log("Producto encontrado");
            return searchProduct;
        } catch (error) {
            console.error("Error al obtener producto", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const result = await ProductsModel.findByIdAndDelete(id);
            if (!result) {
                console.log("Producto no encontrado");
                return null;
            }
            console.log("Producto eliminado exitosamente");
            return result;
        } catch (error) {
            console.error("Error al eliminar producto", error);
            throw error;
        }
    }

    async updateProduct(id, { title, description, code, price, status, stock, category, thumbnails }) {
        try {
            const updateData = { title, description, code, price, status, stock, category, thumbnails };

            // Filtramos las propiedades no definidas para evitar la actualización con valores `undefined`
            Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

            const updatedProduct = await ProductsModel.findByIdAndUpdate(id, updateData, { new: true });
            if (!updatedProduct) {
                console.log("Producto no encontrado");
                return null;
            }
            console.log("Producto actualizado exitosamente");
            return updatedProduct;
        } catch (error) {
            console.error("Error al actualizar producto", error);
            throw error;
        }
    }
    // Contar productos
    countProducts = async (filter = {}) => {
        try {
            const count = await ProductsModel.countDocuments(filter).exec();
            return count;
        } catch (error) {
            throw new Error('Error al contar productos: ' + error.message);
        }
    }
}






export default ProductManager;
