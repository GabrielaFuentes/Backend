import mongoose from 'mongoose';

const connectionString = "mongodb+srv://gabrielafuentes21:hola7175@cluster0.cxrrp.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Cluster0"


const database = async () => {
    try {
        await mongoose.connect(connectionString);
        console.log('Conectado a MongoDB Atlas');
    } catch (error) {
        console.error('Error al conectar a MongoDB Atlas:', error);
        process.exit(1); // Salir del proceso si hay un error de conexión
    }
};

export default database;