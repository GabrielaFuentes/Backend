import express from "express";
import ProductManager from "../controllers/product-manager.js";

const router = express.Router();
const manager = new ProductManager("./src/data/productos.json");

router.get("/products", async (req, res) => {
    const productos = await manager.getProducts();
    res.render("index", { productos });
});
router.get("/realtimeproducts", (req, res) => {
    res.render("realtimeproducts");
})
router.get('/products/add', (req, res) => {
    res.render('addProducts');
});

export default router;
