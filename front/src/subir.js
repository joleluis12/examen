window.addEventListener('DOMContentLoaded', () => {
    const API_URL = "http://localhost:5000/fir-api-5a6f8/us-central1/app/api/productos";
    const tableBody = document.getElementById('tableBody');

    // donde se obtienen los datos del formulario 
    document.getElementById("productForm").addEventListener("submit", handleFormSubmit);

    async function handleFormSubmit(event) {
        event.preventDefault(); 

        const formData = {
            name: document.getElementById('name').value,
            description: document.getElementById('description').value,
            color: document.getElementById('color').value,
            price: document.getElementById('price').value,
            imageUrl: document.getElementById('imageUrl').value || 'No hay imagen disponible' 
        };

        for (const key in formData) {
            if (!formData[key]) {
                alert("Por favor completa todos los campos del formulario.");
                return;
            }
        }

        try {
            // solicitudes del POST
            const response = await fetch(API_URL, {
                method: "POST",
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

    function fetchProducts() {
        fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los productos');
            }
            return response.json();
        })
        .then(data => {
            // Ordenar el producto de menor a mayor
            data.sort((a, b) => a.id - b.id);

            data.forEach(producto => {
                const trElement = createProductTableRow(producto);
                tableBody.appendChild(trElement);
            });
        })
        .catch(error => console.error('Error:', error));
    }

    // creacion de  filas
    function createProductTableRow(producto) {
        const trElement = document.createElement('tr');

        for (const key in producto) {
            const tdElement = document.createElement('td');
            if (key === 'imageUrl') {
                
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

        const deleteButton = createDeleteButton(producto.id);
        const tdElement = document.createElement('td');
        tdElement.appendChild(deleteButton);
        trElement.appendChild(tdElement);

        return trElement;
    }

    function createDeleteButton(productId) {
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.classList.add('delete-btn');
        deleteButton.addEventListener('click', () => deleteProduct(productId));
        return deleteButton;
    }

    // eliminar productos
    function deleteProduct(productId) {
        fetch(`${API_URL}/${productId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar el producto');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
 
            tableBody.innerHTML = '';
            fetchProducts();
        })
        .catch(error => console.error('Error:', error));
    }

    fetchProducts();
});
