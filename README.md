# Proyecto de Gestión de Productos

Este proyecto permite visualizar y gestionar productos en tiempo real. A continuación, encontrarás la estructura del repositorio y las instrucciones para su uso.

## Estructura del Repositorio
```bash
└── Backend/
    ├── package-lock.json
    ├── package.json
    └── src
        ├── app.js
        ├── controllers
        │   ├── carts-manager.js
        │   └── product-manager.js
        ├── data
        │   ├── carts.json
        │   └── productos.json
        ├── public
        │   ├── css
        │   │   └── style.css
        │   └── js
        │       ├── addProduct.js
        │       └── main.js
        ├── routers
        │   ├── carts.router.js
        │   ├── products.router.js
        │   └── views.router.js
        └── views
            ├── addProducts.handlebars
            ├── index.handlebars
            ├── layouts
            │   └── main.handlebars
            └── realtimeproducts.handlebars
```
  
## Instrucciones de Uso

### Instalación y Configuración

1. **Instalar Dependencias:**
   Ejecuta el siguiente comando en la consola para instalar las dependencias necesarias:
   
   ```bash
   npm install
   
2.  **Iniciar el Servidor:
   Luego, inicia el servidor con:
   ```bash
   npm run dev
   ```
### Visualización de Productos en Tiempo Real
Abre tu navegador y dirígete a http://localhost:8080/realtimeproducts para ver los productos en tiempo real.
### Agregar Nuevos Productos
Para agregar productos desde el front-end, ve a http://localhost:8080/products/add.
Completa el formulario con la información del nuevo producto y envíalo.
### Verificación
Regresa a http://localhost:8080/realtimeproducts para confirmar que los nuevos productos se han cargado correctamente.
