import mongoose from "mongoose";

const cartsColletions = "carts";

const cartsSchema = new mongoose.Schema({
    timestamp: { type: String, required: true },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
            quantity: { type: Number, default: 1 }
        }
    ],
});

const cartsModel = mongoose.model(cartsColletions, cartsSchema);

export default cartsModel;
