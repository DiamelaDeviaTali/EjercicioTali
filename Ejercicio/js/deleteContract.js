import CONFIG from './config.js';
import { cargarDataContratos } from './listContract.js';

window.borrarContrato = async function(contractId) {
    if (!confirm('¿Está seguro que desea eliminar este contrato?')) {
        return;
    }

    try {
        const response = await fetch(`${CONFIG.apiUrl}?id=eq.${contractId}`, {
            method: 'DELETE',
            headers: CONFIG.headers()
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        await cargarDataContratos();
        alert('Contrato eliminado exitosamente');

    } catch (error) {
        console.error('Error al eliminar el contrato:', error);
        alert('Error al eliminar el contrato. Por favor, intente nuevamente.');
    }
}