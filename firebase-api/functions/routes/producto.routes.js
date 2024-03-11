const { Router } = require('express')
const router = Router()
const admin = require('firebase-admin');

const db = admin.firestore();

router.post('/api/productos', async (req, res) => {
    try {
        const { name, description, color, price, imageUrl } = req.body;
        
        // Consultar el último ID utilizado en la colección de productos
        const lastProduct = await db.collection('productos').orderBy('id', 'desc').limit(1).get();
        let newId = 1; 

        
        if (!lastProduct.empty) {
            const lastProductId = lastProduct.docs[0].data().id;
            newId = lastProductId + 1;
        }

        // Crea el nuevo producto 
        await db.collection('productos').doc(newId.toString()).set({ 
            id: newId,
            name,
            description,
            color,
            price,
            imageUrl
        });

        return res.status(200).json({ message: 'Product created successfully', id: newId }); 
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

router.get('/api/productos/:productos_id', async (req, res) => {
    try {
        const doc = await db.collection('productos').doc(req.params.productos_id).get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const data = doc.data();
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

router.get('/api/productos', async (req, res) => {
    try {
        const querySnapshot = await db.collection('productos').get();
        const productos = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            productos.push({
                id: doc.id,
                name: data.name,
                description: data.description,
                color: data.color,
                price: data.price,
                imageUrl: data.imageUrl
            });
        });
        return res.status(200).json(productos);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

router.delete('/api/productos/:productos_id', async (req, res) => {
    try {
        await db.collection('productos').doc(req.params.productos_id).delete();
        return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error); 
        return res.status(500).json();
    }
});

router.put('/api/productos/:productos_id', async (req, res) => {
    try {
        const { name, description, color, price, imageUrl } = req.body;

        if (!name || !description || !color || !price || !imageUrl) {
            return res.status(400).json({ message: 'Por favor, proporciona todos los campos necesarios' });
        }

        await db.collection('productos').doc(req.params.productos_id).update({
            name,
            description,
            color,
            price,
            imageUrl
        });

        return res.status(200).json({ message: 'Producto actualizado exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al actualizar el producto' });
    }
});

module.exports = router;
