document.addEventListener("DOMContentLoaded", () => {
    console.log("Esto está funcionando");

    const mainSocket = io();
    let carrito = [];

    // Fetch inicial para obtener los productos
    mainSocket.on("productos", (data) => {
        renderProductos(data);
    });

    // Renderizar productos
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

            // Eventos para agregar al carrito y eliminar
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
        actualizarCarrito();
        console.log(`Agregar producto ${producto.title} con id ${producto._id} al carrito`);
    };

    const actualizarCarrito = () => {
        const cartCount = document.getElementById("cart-count");
        cartCount.innerText = carrito.length;

        const cartItemsList = document.getElementById("cart-items-list");
        cartItemsList.innerHTML = "";

        carrito.forEach((producto, index) => {
            const item = document.createElement("li");
            item.className = "list-group-item d-flex justify-content-between align-items-center";
            item.innerHTML = `
                ${producto.title} - $${producto.price}
                <button class="btn btn-danger btn-sm" data-index="${index}">Eliminar</button>
            `;
            item.querySelector("button").addEventListener("click", () => {
                eliminarDelCarrito(index);
            });

            cartItemsList.appendChild(item);
        });
    };

    const eliminarDelCarrito = (index) => {
        carrito.splice(index, 1);
        actualizarCarrito();
    };

    document.querySelector(".nav-link").addEventListener("click", () => {
        $('#cartModal').modal('show');
    });

    // Escuchar el submit del formulario
    const addProductForm = document.getElementById("addProductForm");

    if (addProductForm) {
        addProductForm.addEventListener("submit", async (event) => {
            event.preventDefault(); // Prevenir el envío normal del formulario
            const title = document.getElementById("title").value;
            const description = document.getElementById("description").value;
            const price = document.getElementById("price").value;
            const code = document.getElementById("code").value;
            const stock = document.getElementById("stock").value;
            const category = document.getElementById("category").value;
            const status = document.getElementById("status").value === "true";

            const nuevoProducto = {
                title,
                description,
                price,
                code,
                stock,
                category,
                status,
            };

            try {
                const response = await fetch("/api/products", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(nuevoProducto),
                });

                const messageElement = document.getElementById("message");

                if (response.ok) {
                    const data = await response.json();
                    console.log("Producto agregado exitosamente:", data);
                    mainSocket.emit("obtenerProductos");
                    messageElement.textContent = "Producto agregado exitosamente";
                    messageElement.classList.remove("text-danger");
                    messageElement.classList.add("text-success");
                } else {
                    const errorData = await response.json();
                    console.error("Error al agregar producto:", errorData.error);
                    messageElement.textContent = errorData.error || "Error al agregar el producto";
                    messageElement.classList.remove("text-success");
                    messageElement.classList.add("text-danger");
                }
            } catch (error) {
                console.error("Error al enviar el formulario:", error);
            }
        });
    }
});
