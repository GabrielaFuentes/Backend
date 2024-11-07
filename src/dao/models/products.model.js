import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    price: { type: Number, required: true, min: 0 }, // Asegurarse de que el precio sea no negativo
    status: { type: Boolean, required: true, default: true }, // Cambiado a Booleano
    stock: { type: Number, required: true, min: 0 }, // Asegurarse de que el stock sea no negativo
    category: { type: String, required: true },
    thumbnails: { type: [String], default: [] } // Valor predeterminado para thumbnails
}, { timestamps: true }); // Agregar timestamps

productsSchema.plugin(mongoosePaginate);

const ProductsModel = mongoose.model("Product", productsSchema);

export default ProductsModel;
