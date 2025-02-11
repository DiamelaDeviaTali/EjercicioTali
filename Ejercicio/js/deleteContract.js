import CONFIG from './config.js';
import { cargarDataContratos } from './listContract.js';

window.borrarContrato = async function(contractId) {
    const result = await Swal.fire({
        title: '¿Está seguro?',
        text: "¿Desea eliminar este contrato?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#6098d4',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) {
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
        
        await Swal.fire({
            title: '¡Eliminado!',
            text: 'El contrato ha sido eliminado exitosamente',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });

    } catch (error) {
        console.error('Error al eliminar el contrato:', error);
        
        await Swal.fire({
            title: 'Error',
            text: 'Error al eliminar el contrato. Por favor, intente nuevamente.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
}