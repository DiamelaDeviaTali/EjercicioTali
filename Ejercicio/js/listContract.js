import CONFIG from './config.js';

async function cargarDataContratos() {
    try {
        
        const response = await fetch(CONFIG.apiUrl, {
            method: 'GET',
            headers: CONFIG.headers()
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        cargarTabla(data);
        cargarFiltros(data);
        
    } catch (error) {
        console.error('Error al cargar los contratos:', error);
    }
}

function filtrarValores(array, key) {
    return [...new Set(array.map(item => item[key]))].filter(Boolean);
}

function cargarFiltros(contratos) {
    const unidadesUnicas = filtrarValores(contratos, 'unidad_negocio');
    const selectUnidad = document.getElementById('unidad_negocio');
    selectUnidad.innerHTML = '<option value="">Todas las Unidades</option>';
    unidadesUnicas.forEach(unidad => {
        const option = document.createElement('option');
        option.value = unidad;
        option.textContent = unidad;
        selectUnidad.appendChild(option);
    });

    const tiposUnicos = filtrarValores(contratos, 'tipo_contrato');
    const selectTipo = document.getElementById('tipo_contrato');
    selectTipo.innerHTML = '<option value="">Todos los Tipos</option>';
    tiposUnicos.forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo;
        option.textContent = tipo;
        selectTipo.appendChild(option);
    });

    selectUnidad.addEventListener('change', () => aplicarFiltros(contratos));
    selectTipo.addEventListener('change', () => aplicarFiltros(contratos));
    document.getElementById('search').addEventListener('input', () => aplicarFiltros(contratos));
}

function aplicarFiltros(contratos) {
    const unidadSeleccionada = document.getElementById('unidad_negocio').value;
    const tipoSeleccionado = document.getElementById('tipo_contrato').value;
    const busqueda = document.getElementById('search').value.toLowerCase();

    const contratosFiltrados = contratos.filter(contrato => {
        const coincideUnidad = !unidadSeleccionada || contrato.unidad_negocio === unidadSeleccionada;
        const coincideTipo = !tipoSeleccionado || contrato.tipo_contrato === tipoSeleccionado;
        const coincideBusqueda = !busqueda || 
            Object.values(contrato).some(valor => 
                String(valor).toLowerCase().includes(busqueda)
            );

        return coincideUnidad && coincideTipo && coincideBusqueda;
    });

    cargarTabla(contratosFiltrados);
}

function cargarTabla(contratos) {
    const tbody = document.querySelector('#contracts-table tbody');
    
    if (!tbody) {
        console.error('No se encontró el tbody de la tabla');
        return;
    }
    
    tbody.innerHTML = '';
    
    contratos.forEach(contrato => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${contrato.id || ''}</td>
            <td>${contrato.nombre || ''}</td>
            <td>${contrato.tipo_contrato || ''}</td>
            <td>${contrato.unidad_negocio || ''}</td>
            <td>${contrato.cliente || ''}</td>
            <td>${contrato.manager || ''}</td>
            <td>${contrato.fecha_inicio || ''}</td>
            <td>${contrato.fecha_fin || ''}</td>
             <td>
                <a href="modificar.html?id=${contrato.id}" class="icon-link">
                    <img src="https://www.iconbolt.com/iconsets/akar-icons/edit.svg" alt="Editar" class="action-icon">
                </a>
            </td>
            <td>
                <a href="#" onclick="borrarContrato(${contrato.id}); return false;" class="icon-link">
                    <img src="https://www.iconbolt.com/iconsets/akar-icons/trash-can.svg" alt="Eliminar" class="action-icon">
                </a>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', cargarDataContratos);

export { cargarDataContratos, cargarTabla, cargarFiltros, aplicarFiltros };