import ProductModel from "../models/products.model.js";

class ProductManager {
    // Agregar un nuevo producto
    async addProduct({ title, description, price, img, code, stock, category, thumbnails }) {
        try {
            // Validar que todos los campos requeridos estén presentes
            if (!title || !description || !price || !code || !stock || !category) {
                console.log("Todos los campos son obligatorios");
                return;
            }

            // Verificar si el código del producto ya existe
            const existeProducto = await ProductModel.findOne({ code: code });
            if (existeProducto) {
                console.log("El código debe ser único, ¡malditooo!");
                return;
            }

            // Crear el nuevo producto
            const newProduct = new ProductModel({
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                status: true,
                thumbnails: thumbnails || []
            });

            // Guardar el producto en la base de datos
            await newProduct.save();
            console.log("Producto agregado exitosamente");

        } catch (error) {
            console.log("Error al agregar producto", error);
            throw error;
        }
    }

    // Obtener productos con paginación y filtros
    async getProducts({ limit = 10, page = 1, sort, query } = {}) {
        try {
            const skip = (page - 1) * limit;
            let queryOptions = {};

            // Aplicar filtro de categoría
            if (query) {
                queryOptions = { category: query };
            }

            // Configurar opciones de ordenación
            const sortOptions = {};
            if (sort) {
                sortOptions.price = sort === 'asc' ? 1 : -1;
            }

            // Consultar productos con paginación y orden
            const productos = await ProductModel
                .find(queryOptions)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit);

            const totalProducts = await ProductModel.countDocuments(queryOptions);
            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            return {
                docs: productos,
                totalPages,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
            };
        } catch (error) {
            console.log("Error al obtener los productos", error);
            throw error;
        }
    }

    // Obtener producto por ID
    async getProductById(id) {
        try {
            const producto = await ProductModel.findById(id);
            if (!producto) {
                console.log("Producto no encontrado");
                return null;
            }
            console.log("Producto encontrado!! Claro que siiiiii");
            return producto;
        } catch (error) {
            console.log("Error al traer un producto por ID", error);
            throw error;
        }
    }

    // Actualizar un producto
    async updateProduct(id, productoActualizado) {
        try {
            const updateado = await ProductModel.findByIdAndUpdate(id, productoActualizado, { new: true });
            if (!updateado) {
                console.log("No se encuentra el producto");
                return null;
            }
            console.log("Producto actualizado con éxito, ¡como todo en mi vida!");
            return updateado;
        } catch (error) {
            console.log("Error al actualizar el producto", error);
            throw error;
        }
    }

    // Eliminar un producto
    async deleteProduct(id) {
        try {
            const deleteado = await ProductModel.findByIdAndDelete(id);
            if (!deleteado) {
                console.log("Producto no encontrado");
                return null;
            }
            console.log("Producto eliminado correctamente");
        } catch (error) {
            console.log("Error al eliminar el producto", error);
            throw error;
        }
    }
}

export default ProductManager;
