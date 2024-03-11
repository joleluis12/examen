import React, { useState, useEffect } from 'react';
import './src/css/style.css';

function Update() {
    const API_URL = "http://localhost:5000/fir-api-5a6f8/us-central1/app/api/productos";
    const [productos, setProductos] = useState([]);
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        description: '',
        color: '',
        price: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleFormSubmit = (event) => {
        event.preventDefault();

        for (const key in formData) {
            if (!formData[key]) {
                alert("Por favor completa todos los campos del formulario.");
                return;
            }
        }

        fetch(API_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            fetchProducts();
        })
        .catch(error => console.error('Error:', error));
    };

    const fetchProducts = () => {
        fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            setProductos(data);
        })
        .catch(error => console.error('Error:', error));
    };

    const updateProduct = (productId) => {
        console.log("Actualizar producto con ID:", productId);
        // Aquí puedes implementar la lógica para mostrar un formulario con los campos prellenados con los datos actuales del producto
        // y luego enviar una solicitud PUT al servidor con los nuevos datos.
        // Podrías utilizar un modal o un formulario insertado directamente en la página, dependiendo de tus preferencias de diseño.
        // Para mantener este ejemplo simple, no se proporcionará la implementación completa de la actualización del producto.
    };

    return (
        <div>
            <div id="formulario">
                <h2>Actualizar</h2>
                <form onSubmit={handleFormSubmit}>
                    <label htmlFor="id">ID:</label>
                    <input type="text" id="id" name="id" /><br />

                    <label htmlFor="name">Nombre:</label>
                    <input type="text" id="name" name="name" /><br />

                    <label htmlFor="description">Descripción:</label>
                    <input type="text" id="description" name="description" /><br />

                    <label htmlFor="color">Color:</label>
                    <input type="text" id="color" name="color" /><br />

                    <label htmlFor="price">Precio:</label>
                    <input type="text" id="price" name="price" /><br />

                    <button type="submit">Actualizar</button>
                </form>
            </div>

            <ul>
                {productos.map(producto => (
                    <li key={producto.id}>
                        {Object.entries(producto).map(([key, value]) => (
                            <div key={key}>
                                <strong>{key}:</strong> {value}
                            </div>
                        ))}
                        <button onClick={() => updateProduct(producto.id)}>Actualizar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Update;
