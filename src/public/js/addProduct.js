// addProduct.js
const form = document.getElementById('addProductForm');
console.log("Formulario encontrado:", form);

if (form) {
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const price = parseFloat(document.getElementById('price').value);
        const code = document.getElementById('code').value;
        const status = document.getElementById('status').value;
        const stock = parseInt(document.getElementById('stock').value);
        const category = document.getElementById('category').value;

        const product = {
            title,
            description,
            price,
            code,
            status,
            stock,
            category
        };

        try {
            console.log('Enviando producto:', product);

            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product)
            });

            if (response.ok) {
                alert('Producto agregado exitosamente');
                form.reset();
                socket.emit('agregarProducto', product);
            } else {
                const errorData = await response.json();
                alert('Error al agregar el producto');
                console.error('Error:', response.status, errorData);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
} else {
    console.error("No se encontró el formulario con ID 'addProductForm'");
}
