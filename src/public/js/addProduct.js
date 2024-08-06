const form = document.getElementById('productForm');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const category = document.getElementById('category').value;
    const stock = document.getElementById('stock').value;

    const product = {
        title,
        description,
        price,
        category,
        stock
    };

    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });

        if (response.ok) {
            alert('Producto agregado con éxito');
            event.target.reset(); // Limpiar el formulario
        } else {
            alert('Error al agregar el producto');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al agregar el producto');
    }
});
