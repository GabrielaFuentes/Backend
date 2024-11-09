import productService from "../services/product.service.js";

class ProductController {
    async getProducts(req, res) {
        try {
            const { limit = 10, page = 1, sort, category } = req.query;
            const options = {
                limit: parseInt(limit),
                page: parseInt(page),
                sort: sort ? { price: sort === 'price_asc' ? 1 : -1 } : undefined,
                query: category ? { category } : {}
            };

            const products = await productService.getProducts(options);
            
            // Obtener categorías únicas para el filtro
            const allProducts = await productService.getProducts({ limit: 1000 });
            const categories = [...new Set(allProducts.docs.map(p => p.category))];

            // Si es una solicitud API, devolver JSON
            if (req.headers.accept?.includes('application/json')) {
                return res.json({
                    status: "success",
                    payload: products,
                    totalPages: products.totalPages,
                    prevPage: products.prevPage,
                    nextPage: products.nextPage,
                    page: products.page,
                    hasPrevPage: products.hasPrevPage,
                    hasNextPage: products.hasNextPage,
                });
            }

            // Si es una solicitud web, renderizar vista
            const productsArray = products.docs.map(product => {
                const { _id, ...rest } = product.toObject();
                return { _id: _id.toString(), ...rest };
            });

            res.render("products", {
                productos: productsArray,
                categories,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                currentPage: products.page,
                totalPages: products.totalPages,
                user: req.user
            });
        } catch (error) {
            console.error("Error al obtener productos", error);
            res.status(500).json({ status: "error", error: "Error interno del servidor" });
        }
    }

    async getRandomProducts(req, res) {
        try {
            const allProducts = await productService.getProducts({ limit: 1000 });
            const products = allProducts.docs;
            const randomProducts = [];
            
            // Seleccionar 3 productos aleatorios
            for (let i = 0; i < 3; i++) {
                const randomIndex = Math.floor(Math.random() * products.length);
                randomProducts.push(products[randomIndex]);
                products.splice(randomIndex, 1);
            }

            return randomProducts;
        } catch (error) {
            console.error("Error al obtener productos aleatorios", error);
            throw error;
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
        const { title, price } = req.body;
        if (!title || typeof price !== 'number' || price <= 0) {
            return res.status(400).json({ error: "Título y precio son obligatorios, y el precio debe ser un número positivo." });
        }
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