import express from "express";
import productController from "../controllers/product.controller.js";
import passport from "passport";
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Ruta para obtener productos con paginación
router.get("/", passport.authenticate("jwt", { session: false }), productController.getProducts);

// Ruta para obtener un producto por ID
router.get("/:pid", productController.getProductById);

// Ruta para agregar un nuevo producto con validación
router.post("/",
    passport.authenticate("jwt", { session: false }),
    [
        body('title').isString().notEmpty(),
        body('description').isString().notEmpty(),
        body('price').isNumeric().notEmpty(),
        body('code').isString().notEmpty(),
        body('status').isString().notEmpty(),
        body('stock').isNumeric().notEmpty(),
        body('category').isString().notEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        return productController.addProduct(req, res);
    }
);

// Ruta para actualizar un producto por ID
router.put("/:pid",
    passport.authenticate("jwt", { session: false }),
    // Agrega validaciones similares aquí si es necesario
    productController.updateProduct
);

// Ruta para eliminar un producto por ID
router.delete("/:pid",
    passport.authenticate("jwt", { session: false }),
    productController.deleteProduct
);

export default router;
