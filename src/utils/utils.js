import bcrypt from "bcrypt";
import Product from '../dao/models/products.model.js';

const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);

const calcularTotal = async (products) => {
    let total = 0;

    for (let item of products) {
        // Buscar el producto completo usando el productId
        const producto = await Product.findById(item.productId);

        if (producto && producto.price) {
            total += producto.price * item.quantity;  // Usamos el precio del producto completo
        }
    }

    return total;
};

export { createHash, isValidPassword, calcularTotal };