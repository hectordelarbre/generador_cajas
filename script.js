document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generateButton');
    const passwordInputs = document.querySelectorAll('input[type="number"]');
    const hexInput = document.getElementById('hexValue');
    const uniquePasswordDisplay = document.getElementById('uniquePassword');
    const integrityStatusDisplay = document.getElementById('integrityStatus');
    const checkboxes = document.querySelectorAll('.verifyCheckbox');

    const apiUrl = 'http://localhost:3000/generate-password'; // URL del backend

    // Validación de los campos
    const validateInputs = () => {
        let allValid = true;

        // Validar campos numéricos
        passwordInputs.forEach(input => {
            if (input.value.length !== 4 || isNaN(input.value)) {
                allValid = false;
            }
        });

        // Validar campo hexadecimal
        const hexValue = hexInput.value;
        if (hexValue.length !== 12 || !/^[0-9a-fA-F]+$/.test(hexValue)) {
            allValid = false;
        }

        // Deshabilitar el botón de generación si los campos no son válidos
        generateButton.disabled = !allValid;
    };

    // Generación de la contraseña única
    const generateUniquePassword = async () => {
        const passwords = Array.from(passwordInputs).map(input => parseInt(input.value, 10));
        const hexValue = hexInput.value;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ passwords, hexValue }),
        });

        const data = await response.json();
        uniquePasswordDisplay.textContent = data.uniquePassword;
    };

    // Verificación de la integridad
    const verifyIntegrity = () => {
        const selectedCheckbox = Array.from(checkboxes).find(checkbox => checkbox.checked);

        if (selectedCheckbox) {
            const selectedPasswordIndex = parseInt(selectedCheckbox.dataset.password);
            const selectedPasswordValue = parseInt(passwordInputs[selectedPasswordIndex].value, 10);
            const hexRightDecimal = parseInt(hexInput.value.slice(8, 12), 16);
            const rightComplement = (9999 - hexRightDecimal) - selectedPasswordValue;

            const hexValue = hexInput.value;
            const leftHex = hexValue.slice(0, 4);
            const centerHex = hexValue.slice(4, 8);

            const leftDecimal = parseInt(leftHex, 16);
            const centerDecimal = parseInt(centerHex, 16);

            const leftComplement = (9999 - leftDecimal) % 10000;

            // Comparar leftComplement - centerDecimal con 0 para obtener el estado de integridad
            const integrityChecking = (leftComplement - centerDecimal) === 0 ? 'OK' : 'Error';

            // Verificar si el complemento es cero para la integridad
            const integrityResult = (rightComplement === 0) ? 'OK' : 'Error';

            // Hacer la función lógica AND entre integrityChecking y integrityResult
            const integrityCheck = (integrityChecking === 'OK' ? 1 : 0) & (integrityResult === 'OK' ? 1 : 0);

            integrityStatusDisplay.textContent = integrityCheck === 1 ? 'OK' : 'Error';

            // Habilitar el botón de generación si ambas condiciones son "OK"
            generateButton.disabled = integrityCheck !== 1;
        } else {
            // Si no hay ninguna casilla seleccionada, deshabilitar el botón de generación
            generateButton.disabled = true;
            integrityStatusDisplay.textContent = ''; // Limpiar el estado de integridad
        }
    };

    // Manejo de cambios en las casillas de verificación
    const handleCheckboxChange = (event) => {
        // Desmarcar todas las otras casillas
        checkboxes.forEach(checkbox => {
            if (checkbox !== event.target) {
                checkbox.checked = false;
            }
        });

        // Realizar la verificación cuando se selecciona una casilla
        verifyIntegrity();
    };

    // Escuchadores de eventos
    passwordInputs.forEach(input => input.addEventListener('input', validateInputs));
    hexInput.addEventListener('input', validateInputs);
    generateButton.addEventListener('click', generateUniquePassword);
    checkboxes.forEach(checkbox => checkbox.addEventListener('change', handleCheckboxChange));
});
