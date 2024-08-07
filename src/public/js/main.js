// main.js
console.log("Esto está funcionando");

const mainSocket = io();

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
                <button class="btn btn-danger">Eliminar</button>
            </div>
        `;

        contenedorProductos.appendChild(card);

        card.querySelector("button").addEventListener("click", () => {
            eliminarProducto(item.id);
        });
    });
};

const eliminarProducto = (id) => {
    mainSocket.emit("eliminarProducto", id);
};
