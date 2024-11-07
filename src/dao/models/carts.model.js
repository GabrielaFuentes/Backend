import mongoose from "mongoose";

const cartsCollection = "carts";

const cartsSchema = new mongoose.Schema({
    timestamp: { type: String, required: true },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
            quantity: { type: Number, required: true, default: 1 }
        }
    ],
});

// Middleware para asegurarse de que los productos se llenan correctamente
cartsSchema.pre('findOne', function (next) {
    this.populate('products.productId', '_id title price');
    next();
});

const cartsModel = mongoose.model(cartsCollection, cartsSchema);

export default cartsModel;

