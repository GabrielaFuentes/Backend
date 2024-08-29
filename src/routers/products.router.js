import { Router } from "express";
import ProductsModel from "../dao/models/products.model.js";

import mongoose from 'mongoose';
import ProductManager from "../dao/db/product-manager-db.js";

const router = Router();
const manager = new ProductManager();


router.get("/products/:pid", async (req, res) => {
    const id = req.params.pid;
    try {
        const producto = await manager.getProductById(id);
        if (!producto) {
            res.status(404).send("Producto no encontrado");
        } else {
            res.json(producto);
        }
    } catch (error) {
        res.status(500).send('Error al obtener producto por ID: ' + error.message);
    }
});




router.get("/", async (req, res) => {
    const { limit = 30, page = 1, sort = null, query = '{}' } = req.query;

    const limitNumber = parseInt(limit);
    const pageNumber = parseInt(page);
    const skip = (pageNumber - 1) * limitNumber;
    let sortOrder = null;

    // Convertir el parámetro de query a un objeto
    let filter = {};
    try {
        filter = JSON.parse(query);
    } catch (error) {
        return res.status(400).json({ error: "El parámetro 'query' no es válido JSON" });
    }

    // Establecer el orden de clasificación basado en el parámetro de consulta
    if (sort === 'asc' || sort === 'desc') {
        sortOrder = { price: sort === 'asc' ? 1 : -1 };
    }

    try {
        const productos = await manager.getProducts({
            limit: limitNumber,
            skip: skip,
            sortOrder: sortOrder,
            filter: filter
        });

        const totalProducts = await manager.countProducts(filter);
        const totalPages = Math.ceil(totalProducts / limitNumber);

        res.json({
            productos,
            totalPages,
            currentPage: pageNumber,
            limit: limitNumber
        });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener productos", details: error.message });
    }
});

router.get("/:pid", async (req, res) => {
    let id = req.params.pid;
    try {
        const product = await ProductsModel.findById(id)
        if (!product) {
            res.status(404).send('No se encuentra el producto deseado.');
        } else {
            res.json(product);
        }
    } catch (error) {
        res.status(500).send('Error interno del servidor');
    }
});

router.post("/", async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    if (!title || !description || !price || !status || !code || !stock || !category) {
        return res.status(400).send({ status: "error", message: "Todos los campos son obligatorios" });
    }

    try {
        const products = new ProductsModel({ title, description, code, price, status, stock, category, thumbnails });
        await products.save();

        res.status(201).send({ message: "Producto agregado exitosamente" });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});



router.put("/:pid", async (req, res) => {
    const { title, description, price, code, stock, category, thumbnails } = req.body;

    if (!title || !description || !price || !code || !stock || !category) {
        return res.status(400).send({ status: "error", message: "Todos los campos son obligatorios" });
    }

    try {
        const updatedProduct = await ProductsModel.findByIdAndUpdate(req.params.pid, req.body, { new: true });

        if (!updatedProduct) {
            // Aquí solo enviamos una respuesta y retornamos para evitar múltiples respuestas
            return res.status(404).send({ message: "Producto no encontrado" });
        }

        res.status(200).send({ message: "Producto actualizado exitosamente", product: updatedProduct });
    } catch (error) {
        console.error("Error al actualizar producto", error);
        res.status(500).send({ status: "error", message: error.message });
    }
});



router.delete("/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        // Verificamos si el ID es válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: "ID inválido" });
        }

        const product = await ProductsModel.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).send({ message: "Producto no encontrado" });
        }

        res.status(200).send({ message: "Producto eliminado exitosamente" });
    } catch (error) {
        console.error("Error al eliminar producto", error);
        res.status(500).send({ message: "Error interno del servidor" });
    }
});



export default router;