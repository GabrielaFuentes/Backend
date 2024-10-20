import mongoose from "mongoose";

const cartsColletions = "carts";

const cartsSchema = new mongoose.Schema({
    timestamp: { type: String, required: true },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
            quantity: {
                type: Number, required: true, default: 1
            }
        }
    ],
});

cartsSchema.pre('findOne', function (next) {
    this.populate('products.product', '_id title price');
    next();
});
const cartsModel = mongoose.model(cartsColletions, cartsSchema);

export default cartsModel;
