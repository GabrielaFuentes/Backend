const form = document.getElementById('addProductForm');
console.log("Formulario encontrado:", form);

if (form) {
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Capturar valores del formulario
        const title = document.getElementById('title').value.trim();
        const description = document.getElementById('description').value.trim();
        const price = parseFloat(document.getElementById('price').value);
        const code = document.getElementById('code').value.trim();
        const status = document.getElementById('status').value.trim();
        const stock = parseInt(document.getElementById('stock').value);
        const category = document.getElementById('category').value.trim();

        // Validaciones
        if (!title || !description || isNaN(price) || price <= 0 || !code || !status || isNaN(stock) || stock < 0 || !category) {
            alert('Por favor, completa todos los campos correctamente.');
            return;
        }

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
                alert(`Error al agregar el producto: ${errorData.message || 'Error desconocido'}`);
                console.error('Error:', response.status, errorData);
            }
        } catch (error) {
            console.error('Error en la comunicación con el servidor:', error);
            alert('Ocurrió un error al intentar agregar el producto. Por favor, inténtalo de nuevo más tarde.');
        }
    });
} else {
    console.error("No se encontró el formulario con ID 'addProductForm'");
}
