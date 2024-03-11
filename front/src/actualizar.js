window.addEventListener('DOMContentLoaded', () => {
    const API_URL = "http://localhost:5000/fir-api-5a6f8/us-central1/app/api/productos";
    const tableBody = document.getElementById('tableBody');
    const productForm = document.getElementById("productForm");
    const productIdField = document.getElementById('productId');


    productForm.addEventListener("submit", handleFormSubmit);

  
    fetchProducts();

  
    async function handleFormSubmit(event) {
        event.preventDefault(); 

        const productId = productIdField.value;

     
        if (!productId) {
            alert("Por favor ingresa un ID válido para actualizar el producto.");
            return;
        }

        try {

            const existingProduct = await getProductById(productId);

            const formData = {
                name: document.getElementById('name').value || existingProduct.name,
                description: document.getElementById('description').value || existingProduct.description,
                color: document.getElementById('color').value || existingProduct.color,
                price: document.getElementById('price').value || existingProduct.price,
                imageUrl: document.getElementById('imageUrl').value || existingProduct.imageUrl || 'No hay imagen disponible'
            };

            // actualizar el producto
            const response = await fetch(`${API_URL}/${productId}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Error al enviar la solicitud');
            }

            const data = await response.json();
            console.log(data);
            

            tableBody.innerHTML = '';
            fetchProducts();
        } catch (error) {
            console.error('Error:', error);
        }
    }

    //aqui se consigue el id 
    async function getProductById(productId) {
        const response = await fetch(`${API_URL}/${productId}`);

        if (!response.ok) {
            alert("El ID seleccionado no existe en la base de datos.");
            throw new Error('Error al obtener el producto');
        }

        return await response.json();
    }

    // tabla
    function fetchProducts() {
        fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los productos');
            }
            return response.json();
        })
        .then(data => {
            // ordenar productos de menor a mayor
            data.sort((a, b) => a.id - b.id);

            data.forEach(producto => {
                const trElement = createProductTableRow(producto);
                trElement.addEventListener('click', () => loadProductDataToForm(producto)); 
                tableBody.appendChild(trElement);
            });
        })
        .catch(error => console.error('Error:', error));
    }

    // datos de la tabla 
    function loadProductDataToForm(producto) {
        productIdField.value = producto.id;
        document.getElementById('name').value = producto.name;
        document.getElementById('description').value = producto.description;
        document.getElementById('color').value = producto.color;
        document.getElementById('price').value = producto.price;
        document.getElementById('imageUrl').value = producto.imageUrl || ''; 
    }

    function createProductTableRow(producto) {
        const trElement = document.createElement('tr');

        for (const key in producto) {
            const tdElement = document.createElement('td');
            if (key === 'imageUrl') {
                // Verificar si hay una imagen
                if (producto[key]) {
                    const imgElement = document.createElement('img');
                    imgElement.src = producto[key];
                    imgElement.alt = "Product Image";
                    imgElement.style.maxWidth = "100px";
                    tdElement.appendChild(imgElement);
                } else {
                    tdElement.textContent = 'No hay imagen disponible';
                }
            } else {
                tdElement.textContent = producto[key];
            }
            trElement.appendChild(tdElement);
        }

        return trElement;
    }
});
