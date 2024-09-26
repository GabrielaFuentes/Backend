// main.js
document.addEventListener("DOMContentLoaded", () => {
    console.log("Esto está funcionando");

    const mainSocket = io();
    let carrito = [];

    mainSocket.on("productos", (data) => {
        renderProductos(data);
    });

    const renderProductos = (productos) => {
        const contenedorProductos = document.getElementById("contenedorProductos");
        if (!contenedorProductos) {
            console.error("El contenedor de productos no se encuentra en el DOM");
            return;
        }
        contenedorProductos.innerHTML = "";

        productos.forEach(item => {
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-text">$${item.price}</p>
                    <p class="card-text">${item.description}</p>
                                <button class="btn btn-success add-product" data-id="${item._id}">Agregar al carrito</button>
                                <button class="btn btn-danger delete-product" data-id="${item._id}">Eliminar</button>
                </div>
            `;

            contenedorProductos.appendChild(card);



            card.querySelector(".add-product").addEventListener("click", () => {
                agregarAlCarrito(item);
            });

            card.querySelector(".delete-product").addEventListener("click", () => {
                eliminarProducto(item._id);
            });
        });
    };

    const agregarAlCarrito = (producto) => {
        carrito.push(producto);
        actualizarCarrito(producto);
        console.log(`Agregar producto ${producto.title} con id ${id} al carrito`);
    };

    // Función para actualizar el ícono del carrito y mostrar los productos
    const actualizarCarrito = () => {
        const cartCount = document.getElementById("cart-count");
        cartCount.innerText = carrito.length; // Actualizar la cantidad en el ícono del carrito

        const cartItemsList = document.getElementById("cart-items-list");
        cartItemsList.innerHTML = ""; // Limpiar la lista antes de agregar productos

        carrito.forEach((producto, index) => {
            const item = document.createElement("li");
            item.className = "list-group-item d-flex justify-content-between align-items-center";
            item.innerHTML = `
                ${producto.title} - $${producto.price}
                <button class="btn btn-danger btn-sm" data-index="${index}">Eliminar</button>
            `;

            // Event listener para eliminar productos del carrito
            item.querySelector("button").addEventListener("click", () => {
                eliminarDelCarrito(index);
            });

            cartItemsList.appendChild(item);
        });
    };

    // Función para eliminar un producto del carrito
    const eliminarDelCarrito = (index) => {
        carrito.splice(index, 1); // Eliminar producto del carrito
        actualizarCarrito(); // Actualizar el carrito después de eliminar
    };

    // Mostrar el modal del carrito al hacer clic en el ícono del carrito
    document.querySelector(".nav-link").addEventListener("click", () => {
        $('#cartModal').modal('show');
    });
});

