const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());
app.use(cors());

// Ruta para generar la contraseña única
app.post('/generate-password', (req, res) => {
    const { passwords, hexValue } = req.body;

    let passwordSum = ((passwords[0] + passwords[1]) - (passwords[2] + passwords[3]) - (passwords[4] + passwords[5])) % 10000;
    passwordSum = Math.abs(passwordSum);

    const leftHex = hexValue.slice(0, 4);
    const centerHex = hexValue.slice(4, 8);
    const rightHex = hexValue.slice(8, 12);

    const leftDecimal = parseInt(leftHex, 16);
    const centerDecimal = parseInt(centerHex, 16);
    const rightDecimal = parseInt(rightHex, 16);

    const leftComplement = (9999 - leftDecimal) % 10000;
    const rightComplement = (9999 - rightDecimal) % 10000;

    let hexResult = (leftComplement * rightComplement) % 10000;
    hexResult = Math.abs(hexResult);

    let finalResult = (hexResult + passwordSum) % 10000;
    finalResult = Math.abs(finalResult);

    res.json({ uniquePassword: `#${finalResult.toString().padStart(4, '0')}` });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
