/* Desarrollar el servidor basado en Node.JS y express, que escuche en el puerto 8080 y disponga de dos grupos de rutas: /products y /carts. Dichos endpoints estarán implementados con el router de express, con las siguientes especificaciones:
Para el manejo de productos, el cual tendrá su router en /api/products/ , configurar las siguientes rutas:
La ruta raíz GET / deberá listar todos los productos de la base.
La ruta GET /:pid deberá traer sólo el producto con el id proporcionado
La ruta raíz POST / deberá agregar un nuevo producto con los campos:
id: Number/String (A tu elección, el id NO se manda desde body, se autogenera como lo hemos visto desde los primeros entregables, asegurando que NUNCA se repetirán los ids en el archivo.
title:String, description:String,code:String,price:Number,status:Boolean,stock:Number,category:String,thumbnails:Array de Strings que contengan las rutas donde están almacenadas las imágenes referentes a dicho producto
La ruta GET /:cid deberá listar los productos que pertenezcan al carrito con el parámetro cid proporcionados.
La ruta POST  /:cid/product/:pid deberá agregar el producto al arreglo “products” del carrito seleccionado, agregándose como un objeto bajo el siguiente formato:
product: SÓLO DEBE CONTENER EL ID DEL PRODUCTO (Es crucial que no agregues el producto completo)
quantity: debe contener el número de ejemplares de dicho producto. El producto, de momento, se agregará de uno en uno.

Además, si un producto ya existente intenta agregarse al producto, incrementar el campo quantity de dicho producto. 
 */

import express from "express"; 
const app = express(); 
const PORT = 8080; 

import productRouter from "./routers/products.router.js";
import cartRouter from "./routers/carts.router.js";

//NO SE OLVIDEN DE LOS MIDDLEWARE: 
app.use(express.json());

//Rutas
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

//Listen 

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    console.log(`Escuchando en el http://localhost:${PORT}`);
});

