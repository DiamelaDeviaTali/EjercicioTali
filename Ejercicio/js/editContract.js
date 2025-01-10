import CONFIG from './config.js';

async function obtenerDataContratos() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const contratoId = urlParams.get('id');
        
        const url = `${CONFIG.apiUrl}?id=eq.${contratoId}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: CONFIG.headers()
        });

        const data = await response.json();

        const contrato = data[0];

        document.getElementById('nombre').value = contrato.nombre || '';
        document.getElementById('descripcion').value = contrato.descripcion || '';
        document.getElementById('manager').value = contrato.manager || '';
        document.getElementById('cliente').value = contrato.cliente || '';
        document.getElementById('unidad_negocio_form').value = contrato.unidad_negocio || '';
        document.getElementById('tipo_contrato_form').value = contrato.tipo_contrato || '';
        document.getElementById('fecha_inicio').value = contrato.fecha_inicio || '';
        document.getElementById('fecha_fin').value = contrato.fecha_fin || '';

    } catch (error) {
        console.error('Error al cargar los datos:', error);
        alert('Error al cargar los datos del contrato: ' + error.message);
    }
}

function sendDataContrato() {
    const form = document.getElementById('edit-contract-form');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            const urlParams = new URLSearchParams(window.location.search);
            const contratoId = urlParams.get('id');

            const formData = {
                nombre: document.getElementById('nombre').value,
                descripcion: document.getElementById('descripcion').value,
                manager: document.getElementById('manager').value,
                cliente: document.getElementById('cliente').value,
                unidad_negocio: document.getElementById('unidad_negocio_form').value,
                tipo_contrato: document.getElementById('tipo_contrato_form').value,
                fecha_inicio: document.getElementById('fecha_inicio').value,
                fecha_fin: document.getElementById('fecha_fin').value
            };

            const url = `${CONFIG.apiUrl}?id=eq.${contratoId}`;

            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    ...CONFIG.headers(),
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`Error en la actualización: ${response.status}`);
            }

            alert('Contrato actualizado exitosamente');
            window.location.href = 'listado.html';

        } catch (error) {
            console.error('Error al actualizar:', error);
            alert('Error al actualizar el contrato: ' + error.message);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    obtenerDataContratos();
    sendDataContrato();
});

export { obtenerDataContratos, sendDataContrato };