import { Router } from "express";
import ProductManager from "../controllers/product-manager.js";

const router = Router();
const manager = new ProductManager("./src/data/productos.json");



router.get("/", async (req, res) => {
    let limit = req.query.limit;
    try {
        const arrayProductos = await manager.getProducts();

        if (limit) {
            res.send(arrayProductos.slice(0, limit));
        } else {
            res.send(arrayProductos);
        }
    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
})



router.get("/:pid", async (req, res) => {
    let id = req.params.pid;
    try {
        const producto = await manager.getProductById(id);
        if (!producto) {
            res.status(404).send('No se encuentra el producto deseado.');
        } else {
            res.send(producto);
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
        await manager.addProduct({ title, description, price, code, stock, category, thumbnails });
        res.status(201).send({ message: "Producto agregado exitosamente" });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});



router.put("/:pid", async (req, res) => {
    const id = req.params.pid;
    const { title, description, price, code, stock, category, thumbnails } = req.body;

    if (!title || !description || !price || !code || !stock || !category) {
        return res.status(400).send({ status: "error", message: "Todos los campos son obligatorios" });
    }

    try {
        await manager.updateProduct(id, { title, description, price, code, stock, category, thumbnails });
        res.status(200).send({ message: "Producto actualizado exitosamente" });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});


router.delete("/:pid", async (req, res) => {
    let id = req.params.pid;
    try {
        await manager.deleteProduct(id);
        res.status(200).send("Producto eliminado");
    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }

})




export default router;