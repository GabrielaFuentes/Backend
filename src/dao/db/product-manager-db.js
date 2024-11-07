import ProductModel from "../models/products.model.js";

class ProductManager {
    // Agregar un nuevo producto
    async addProduct({ title, description, price, code, stock, category, thumbnails }) {
        try {
            // Validar que todos los campos requeridos estén presentes
            if (!title || !description || typeof price !== 'number' || !code || typeof stock !== 'number' || !category) {
                console.log("Todos los campos son obligatorios y deben tener el formato correcto.");
                throw new Error("Validación fallida: Campos obligatorios no válidos.");
            }

            // Verificar si el código del producto ya existe
            const existeProducto = await ProductModel.findOne({ code });
            if (existeProducto) {
                console.log("El código debe ser único.");
                throw new Error("El código debe ser único.");
            }

            // Crear el nuevo producto
            const newProduct = new ProductModel({
                title,
                description,
                price,
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
            console.error("Error al agregar producto:", error.message);
            throw error; // Propagar el error para manejarlo en el controlador
        }
    }

    // Obtener productos con paginación y filtros
    async getProducts({ limit = 10, page = 1, sort, query } = {}) {
        try {
            const skip = (page - 1) * limit;
            let queryOptions = {};

            // Aplicar filtro de categoría
            if (query) {
                queryOptions.category = query;
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
            console.error("Error al obtener los productos:", error.message);
            throw error; // Propagar el error para manejarlo en el controlador
        }
    }

    // Obtener producto por ID
    async getProductById(id) {
        try {
            const producto = await ProductModel.findById(id);
            if (!producto) {
                console.log("Producto no encontrado con ID:", id);
                return null;
            }
            console.log("Producto encontrado:", producto);
            return producto;
        } catch (error) {
            console.error("Error al traer un producto por ID:", error.message);
            throw error; // Propagar el error para manejarlo en el controlador
        }
    }

    // Actualizar un producto
    async updateProduct(id, productoActualizado) {
        try {
            const updateado = await ProductModel.findByIdAndUpdate(id, productoActualizado, { new: true });
            if (!updateado) {
                console.log("No se encuentra el producto con ID:", id);
                return null;
            }
            console.log("Producto actualizado con éxito:", updateado);
            return updateado;
        } catch (error) {
            console.error("Error al actualizar el producto:", error.message);
            throw error; // Propagar el error para manejarlo en el controlador
        }
    }

    // Eliminar un producto
    async deleteProduct(id) {
        try {
            const deleteado = await ProductModel.findByIdAndDelete(id);
            if (!deleteado) {
                console.log("Producto no encontrado con ID:", id);
                return null;
            }
            console.log("Producto eliminado correctamente:", id);
        } catch (error) {
            console.error("Error al eliminar el producto:", error.message);
            throw error; // Propagar el error para manejarlo en el controlador
        }
    }
}

export default ProductManager;
