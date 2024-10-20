import ProductsModel from "./models/products.model.js";

class ProductDao {
    async getProducts({ limit, page, sort, query }) {
        const options = { limit, page, sort: sort ? { [sort]: 1 } : null };
        return await ProductsModel.paginate(query ? { category: query } : {}, options);
    }
    async getProductById(id) {
        return await ProductsModel.findById(id);
    }
    async addProduct(productData) {
        return await ProductsModel.create(productData);
    }

    async updateProduct(id, productData) {
        return await ProductsModel.findByIdAndUpdate(id, productData, { new: true });
    }

    async deleteProduct(id) {
        return await ProductsModel.findByIdAndDelete(id);
    }

}

export default new ProductDao(); 