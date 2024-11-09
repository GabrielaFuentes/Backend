import mongoose from 'mongoose';
import UserModel from '../dao/models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

const makeAdmin = async (userId) => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://gabrielafuentes21:hola7175@cluster0.cxrrp.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Cluster0");

        const user = await UserModel.findById(userId);
        if (!user) {
            console.log('Usuario no encontrado');
            return;
        }

        user.role = 'admin';
        await user.save();

        console.log(`Usuario ${user.email} ahora es administrador`);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

// Para usar el script: node makeAdmin.js <userId>
const userId = process.argv[2];
if (!userId) {
    console.log('Por favor proporciona un ID de usuario');
} else {
    makeAdmin(userId);
}