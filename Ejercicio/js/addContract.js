import CONFIG from './config.js';

async function addContract(contractData) {
    try {
        
        const formattedData = {
            ...contractData,
            fecha_inicio: new Date(contractData.fecha_inicio).toISOString(),
            fecha_fin: new Date(contractData.fecha_fin).toISOString()
        };

        const response = await fetch(CONFIG.apiUrl, {
            method: 'POST',
            headers: CONFIG.headers(),
            body: JSON.stringify(formattedData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error HTTP: ${response.status}. ${errorText}`);
        }

        const result = await response.text();
        return result;
    } catch (error) {
        console.error('Error al agregar contrato:', error);
        throw error;
    }
}

function enviarContrato(event) {
    event.preventDefault();
    
    const contractData = {
        nombre: document.getElementById('nombre').value,
        descripcion: document.getElementById('descripcion').value,
        manager: document.getElementById('manager').value,
        cliente: document.getElementById('cliente').value,
        unidad_negocio: document.getElementById('unidad_negocio_form').value,
        tipo_contrato: document.getElementById('tipo_contrato_form').value,
        fecha_inicio: document.getElementById('fecha_inicio').value,
        fecha_fin: document.getElementById('fecha_fin').value
    };


    addContract(contractData)
        .then(() => {
            Swal.fire({
                icon: 'success',
                text: 'Contrato agregado exitosamente'
            }).then(() => {
                window.location.href = 'listado.html';
            });
            event.target.reset();
            if (typeof window.loadContracts === 'function') {
                window.loadContracts();
            }
        })
        .catch(error => {
            console.error('Error completo:', error);
            Swal.fire({
                icon: 'error',
                text: 'Error al agregar el contrato: ' + error.message
            });
        });
}

export { addContract, enviarContrato };

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-contract-form');
    if (form) {
        form.addEventListener('submit', enviarContrato);
    } else {
        console.error('No se encontró el formulario');
    }
});