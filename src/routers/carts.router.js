import express from 'express';
import CartsController from '../controllers/cart.controller.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Rutas protegidas que requieren autenticación
router.use(isAuthenticated);

// Crear un nuevo carrito
router.post('/', CartsController.createCart);

// Obtener productos de un carrito
router.get('/:cid', CartsController.getCartProducts);

// Agregar producto a un carrito
router.post('/:cid/product/:pid', CartsController.addProductToCart);

// Eliminar producto de un carrito
router.delete('/:cid/product/:pid', CartsController.deleteProductFromCart);

// Actualizar carrito completo
router.put('/:cid', CartsController.updateCart);

// Realizar compra del carrito
router.post('/:cid/purchase', CartsController.purchaseCart);

export default router;