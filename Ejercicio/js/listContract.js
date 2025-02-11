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

    $.fn.dataTable.ext.search.push(function(settings, data) {
        const unidadSeleccionada = $('#unidad_negocio').val();
        const tipoSeleccionado = $('#tipo_contrato').val();

        const unidad = data[3] || '';
        const tipo = data[2] || '';

        const coincideUnidad = !unidadSeleccionada || unidad === unidadSeleccionada;
        const coincideTipo = !tipoSeleccionado || tipo === tipoSeleccionado;

        return coincideUnidad && coincideTipo;
    });

    selectUnidad.addEventListener('change', () => dataTable.draw());
    selectTipo.addEventListener('change', () => dataTable.draw());
}

let dataTable;

function cargarTabla(contratos) {
    if ($.fn.DataTable.isDataTable('#contracts-table')) {
        $('#contracts-table').DataTable().destroy();
    }

    const tbody = document.querySelector('#contracts-table tbody');
    
    if (!tbody) {
        console.error('No se encontró el tbody de la tabla');
        return;
    }
    
    tbody.innerHTML = '';
    
    contratos.forEach(contrato => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td data-label>${contrato.id || ''}</td>
            <td data-label>${contrato.nombre || ''}</td>
            <td data-label>${contrato.tipo_contrato || ''}</td>
            <td data-label>${contrato.unidad_negocio || ''}</td>
            <td data-label>${contrato.cliente || ''}</td>
            <td data-label>${contrato.manager || ''}</td>
            <td data-label>${contrato.fecha_inicio || ''}</td>
            <td data-label>${contrato.fecha_fin || ''}</td>
            <td>
                <a href="editContract.html?id=${contrato.id}" class="icon-link">
                    <img src="../img/edit.svg" alt="Editar" class="action-icon">
                </a>
            </td>
            <td>
                <a href="#" onclick="borrarContrato(${contrato.id}); return false;" class="icon-link">
                    <img src="../img/trash.svg" alt="Eliminar" class="action-icon">
                </a>
            </td>
        `;
        
        tbody.appendChild(row);
    });

    dataTable = $('#contracts-table').DataTable({
        responsive: true,
        pageLength: 10,
        dom: '<"custom-search">frtip',
        lengthChange: false,
        info: "",
        infoEmpty: "",
        language: {
            search: "",
            searchPlaceholder: "Buscar..."
        },
        columnDefs: [
            { 
                targets: [-1, -2], 
                orderable: false,  
                searchable: false
            }
        ]
    });
}

document.addEventListener('DOMContentLoaded', cargarDataContratos);

export { cargarDataContratos, cargarTabla, cargarFiltros };