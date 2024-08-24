import { Router } from "express";
import ProductsModel from "../dao/models/products.model.js";

const router = Router();


router.get("/", async (req, res) => {
    let limit = req.query.limit;
    try {
        const arrayProductos = ProductsModel.find()

        if (limit) {
            res.json(arrayProductos.slice(0, limit));
        } else {
            res.json(arrayProductos);
        }
    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
})

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
        const product = await ProductsModel.findByIdAndUpdate(req.params.pid, req.body);
        if (!product) {
            res.status(404).send({ message: "Producto no encontrado" });
        }
        res.status(200).send({ message: "Producto actualizado exitosamente" });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});


router.delete("/:pid", async (req, res) => {
    let id = req.params.pid;
    try {
        const product = await ProductsModel.findByIdAndDelete(id);
        if (!product) {
            res.status(404).send({ message: "Producto no encontrado" });
        }
        res.status(200).send("Producto eliminado");
    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }

})


export default router;