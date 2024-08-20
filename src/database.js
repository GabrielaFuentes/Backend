import mongoose from 'mongoose';

//Nos conectamos con MongoDB Atlas
mongoose.connect("mongodb+srv://gabrielafuentes21:hola7175@cluster0.cxrrp.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("Estamos conectados a la BD"))
    .catch(() => console.log("NO ESTAMOS CONECTAMOS HAHAHHA..!"))