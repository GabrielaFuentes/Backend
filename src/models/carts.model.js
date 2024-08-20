import mongoose from "mongoose";


const cartsColletions = "carts";

const cartsSchema = new mongoose.Schema({
    timestamp: { type: String, required: true },
    products: { type: Array, required: true },
})


const cartsModel = mongoose.model(cartsColletions, cartsSchema);

export default cartsModel;