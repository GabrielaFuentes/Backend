import mongoose from "mongoose";

const productsColletions = "products";

const productsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
})

//Definimos modelo
const productsModel = mongoose.model(productsColletions, productsSchema);

export default productsModel;