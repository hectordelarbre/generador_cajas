const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Servir archivos estáticos desde el frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Ejemplo de ruta para la API
app.get('/api/estado', (req, res) => {
    res.json({ message: 'API funcionando correctamente' });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
