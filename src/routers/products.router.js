import { Router } from "express";
import ProductManager from "../controllers/product-manager.js";

const router = Router(); 
const manager = new ProductManager("./src/data/productos.json");

//ruta ‘/products’, la cual debe leer el archivo de productos y devolverlos dentro de un objeto.

//Realizamos ejemplo con el limit:

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


//ruta ‘/products/:pid’, la cual debe recibir por req.params el pid (product Id), y devolver sólo el producto solicitado, en lugar de todos los productos. 

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

//La ruta raíz POST / deberá agregar un nuevo producto

router.post("/", async (req, res) => {
    const { title, description, price, code, stock, category, thumbnails } = req.body;

    // Validación de campos obligatorios
    if (!title || !description || !price || !code || !stock || !category) {
        return res.status(400).send({ status: "error", message: "Todos los campos son obligatorios" });
    }

    try {
        await manager.addProduct({ title, description, price, code, stock, category, thumbnails });
        res.status(201).send({ message: "Producto agregado exitosamente" });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

//actualizar las product

router.put("/:pid", async (req, res) => {
    const id = req.params.pid;
    const { title, description, price, code, stock, category, thumbnails } = req.body;

    // Validación de campos obligatorios
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

// delete
router.delete("/:pid", async (req,res)=>{
    let id = req.params.pid;
    try {
        await manager.deleteProduct(id);
        res.status(200).send("Producto eliminado");
    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }

})


export default router;