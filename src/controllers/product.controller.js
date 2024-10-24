import productService from "../services/product.service.js";

class ProductController {
    async getProducts(req, res) {
        try {
            const { limit = 10, page = 1, sort, query } = req.query;
            const products = await productService.getProducts({ limit, page, sort, query });
            res.json({
                status: "success",
                payload: products,
                totalPages: products.totalPages,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                page: products.page,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevLink: products.hasPrevPage ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : null,
                nextLink: products.hasNextPage ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : null,
            });
        } catch (error) {
            console.error("Error al obtener productos", error);
            res.status(500).json({ status: "error", error: "Error interno del servidor" });
        }
    }

    async getProductById(req, res) {
        const { id } = req.params;
        try {
            const product = await productService.getProductById(id);
            if (!product) return res.status(404).send("Producto no encontrado");
            res.json(product);
        } catch (error) {
            res.status(500).send("Error interno del servidor");
        }
    }

    async addProduct(req, res) {
        const newProduct = req.body;
        try {
            await productService.addProduct(newProduct);
            res.status(201).json({ message: "Producto agregado exitosamente" });
        } catch (error) {
            console.error("Error al agregar producto", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
    async createProduct(req, res) {
        try {
            const product = await productService.createProduct(req.body);
            res.status(201).json(product);
        } catch (error) {
            res.status(500).send("Error interno del servidor");
        }

    }

    async updateProduct(req, res) {
        const { id } = req.params;
        try {
            const updateProduct = await productService.updateProduct(id, req.body);
            if (!updateProduct) return res.status(404).send("Producto no encontrado");
            res.json(updateProduct);
        } catch (error) {
            res.status(500).send("Error interno del servidor");
        }

    }

    async deleteProduct(req, res) {
        const { id } = req.params;
        try {
            const deleteProduct = await productService.deleteProduct(id);
            if (!deleteProduct) return res.status(404).send("Producto no encontrado");
            res.json({ message: "Producto eliminado!" });
        } catch (error) {
            res.status(500).send("Error interno del servidor");
        }
    }

}
const productController = new ProductController();


export default productController; 