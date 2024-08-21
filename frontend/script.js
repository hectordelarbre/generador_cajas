document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generateButton');
    const passwordInputs = document.querySelectorAll('input[type="number"]');
    const hexInput = document.getElementById('hexValue');
    const uniquePasswordDisplay = document.getElementById('uniquePassword');
    const integrityStatusDisplay = document.getElementById('integrityStatus');
    const checkboxes = document.querySelectorAll('.verifyCheckbox');

    // Validación de los campos
    const validateInputs = () => {
        

        // Validar campos numéricos
        passwordInputs.forEach(input => {
            if (input.value.length !== 4 || isNaN(input.value)) {
                
            }
        });

        // Validar campo hexadecimal
        const hexValue = hexInput.value;
        if (hexValue.length !== 12 || !/^[0-9a-fA-F]+$/.test(hexValue)) {
            
        }

     
    };

    // Generación de la contraseña única
    const generateUniquePassword = () => {
        const passwords = Array.from(passwordInputs).map(input => parseInt(input.value, 10));

        let passwordSum = ((passwords[0] + passwords[1]) - (passwords[2] + passwords[3]) - (passwords[4] + passwords[5])) % 10000;
        passwordSum = Math.abs(passwordSum);

        const hexValue = hexInput.value;
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

        uniquePasswordDisplay.textContent = `#${finalResult.toString().padStart(4, '0')}`;
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

            // Hacer la función lógica AND entre integrityChecking e integrityResult
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

    // Manejo de clics en el campo hexadecimal
    const handleHexFocus = () => {
        // Desmarcar todas las casillas de verificación
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        // Deshabilitar el botón de generación
        generateButton.disabled = true;

        // Limpiar el estado de integridad
        integrityStatusDisplay.textContent = '';
    };

    // Escuchadores de eventos
    passwordInputs.forEach(input => input.addEventListener('input', validateInputs));
    hexInput.addEventListener('input', validateInputs);
    hexInput.addEventListener('focus', handleHexFocus); // Añadir evento de foco al campo hexadecimal
    generateButton.addEventListener('click', generateUniquePassword);
    checkboxes.forEach(checkbox => checkbox.addEventListener('change', handleCheckboxChange));
});
