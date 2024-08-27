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

    async getProducts() {
        try {
            const arrayProducts = await ProductsModel.find();
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
}





export default ProductManager;
