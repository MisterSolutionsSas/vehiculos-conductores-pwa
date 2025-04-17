import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import Navbar from '../../../components/Navbar';

const HistorialVehiculo = () => {
  const router = useRouter();
  const { placa } = router.query;

  const [vehiculo, setVehiculo] = useState(null);
  const [nuevoMantenimiento, setNuevoMantenimiento] = useState({
    descripcion: '',
    valor: '',
    fecha: '',
    factura: ''
  });
  const [modoEdicion, setModoEdicion] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [fechaFiltro, setFechaFiltro] = useState('');

  useEffect(() => {
    const vehiculos = JSON.parse(localStorage.getItem('vehiculos')) || [];
    const encontrado = vehiculos.find(v => v.placa === placa);
    if (encontrado) {
      if (!encontrado.historial) encontrado.historial = [];
      setVehiculo(encontrado);
    }
  }, [placa]);

  const handleChange = (e) => {
    setNuevoMantenimiento({ ...nuevoMantenimiento, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNuevoMantenimiento(prev => ({ ...prev, factura: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const guardarCambios = () => {
    const confirmacion = window.confirm('¿Estás seguro de que deseas guardar los cambios en este mantenimiento?');
    if (!confirmacion) return;

    const actualizados = JSON.parse(localStorage.getItem('vehiculos')) || [];
    const index = actualizados.findIndex(v => v.placa === placa);
    if (index === -1) return;

    const historial = actualizados[index].historial.map(m => {
      if (m.id === modoEdicion) {
        return { ...m, ...nuevoMantenimiento };
      }
      return m;
    });

    actualizados[index].historial = historial;
    localStorage.setItem('vehiculos', JSON.stringify(actualizados));
    setVehiculo(actualizados[index]);
    setNuevoMantenimiento({ descripcion: '', valor: '', fecha: '', factura: '' });
    setModoEdicion(null);
    alert('Mantenimiento actualizado exitosamente.');
  };

  const cancelarEdicion = () => {
    setNuevoMantenimiento({ descripcion: '', valor: '', fecha: '', factura: '' });
    setModoEdicion(null);
  };

  const agregarMantenimiento = () => {
    const confirmacion = window.confirm('¿Estás seguro de que deseas agregar este nuevo mantenimiento?');
    if (!confirmacion) return;

    const actualizados = JSON.parse(localStorage.getItem('vehiculos')) || [];
    const index = actualizados.findIndex(v => v.placa === placa);
    if (index === -1) return;

    const mantenimiento = {
      ...nuevoMantenimiento,
      id: Date.now()
    };

    actualizados[index].historial = actualizados[index].historial || [];
    actualizados[index].historial.push(mantenimiento);
    localStorage.setItem('vehiculos', JSON.stringify(actualizados));
    setVehiculo(actualizados[index]);
    setNuevoMantenimiento({ descripcion: '', valor: '', fecha: '', factura: '' });
    alert('Mantenimiento agregado exitosamente.');
  };

  const eliminarMantenimiento = (id) => {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este mantenimiento? Esta acción no se puede deshacer.');
    if (!confirmacion) return;

    const actualizados = JSON.parse(localStorage.getItem('vehiculos')) || [];
    const index = actualizados.findIndex(v => v.placa === placa);
    if (index === -1) return;

    actualizados[index].historial = actualizados[index].historial.filter(m => m.id !== id);
    localStorage.setItem('vehiculos', JSON.stringify(actualizados));
    setVehiculo(actualizados[index]);
    alert('Mantenimiento eliminado exitosamente.');
  };

  const editarMantenimiento = (mantenimiento) => {
    setModoEdicion(mantenimiento.id);
    setNuevoMantenimiento({
      descripcion: mantenimiento.descripcion,
      valor: mantenimiento.valor,
      fecha: mantenimiento.fecha,
      factura: mantenimiento.factura || ''
    });
    document.getElementById('seccion-edicion').scrollIntoView({ behavior: 'smooth' });
  };

  const verFactura = (base64) => {
    const blob = dataURLtoBlob(base64);
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const filtrarMantenimientos = () => {
    if (!vehiculo || !vehiculo.historial) return [];

    return vehiculo.historial.filter(mantenimiento => {
      const descripcionMatch = mantenimiento.descripcion.toLowerCase().includes(busqueda.toLowerCase());
      const fechaMatch = fechaFiltro ? new Date(mantenimiento.fecha).toLocaleDateString('es-ES') === new Date(fechaFiltro).toLocaleDateString('es-ES') : true;
      return descripcionMatch && fechaMatch;
    }).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  };

  const exportarHistorialAExcel = () => {
    if (!vehiculo || !vehiculo.historial || vehiculo.historial.length === 0) {
      alert('No hay historial de mantenimientos para exportar.');
      return;
    }

    const formatearPesos = valor =>
      new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(valor);

    const sumarTotal = (mantenimientos) => 
      mantenimientos.reduce((sum, m) => sum + Number(m.valor || 0), 0);

    const wb = XLSX.utils.book_new();
    const wsCols = [{ wch: 30 }, { wch: 15 }, { wch: 20 }, { wch: 15 }];

    // Hoja de Historial Completo
    const historialCompleto = vehiculo.historial.map(mantenimiento => ({
      Descripción: mantenimiento.descripcion,
      Valor: Number(mantenimiento.valor),
      Fecha: formatearFecha(mantenimiento.fecha),
      'Factura adjunta': mantenimiento.factura ? 'Sí' : 'No'
    }));

    const wsCompleto = XLSX.utils.json_to_sheet(historialCompleto);
    const totalCompleto = sumarTotal(vehiculo.historial);
    XLSX.utils.sheet_add_aoa(wsCompleto, [[''], ['TOTAL GASTADO:', formatearPesos(totalCompleto)]], { origin: -1 });
    wsCompleto['!cols'] = wsCols;
    XLSX.utils.book_append_sheet(wb, wsCompleto, 'Historial Completo');

    // Hoja Semanal
    const mantenimientosPorSemana = vehiculo.historial.reduce((acc, m) => {
      const date = new Date(m.fecha);
      const year = date.getFullYear();
      const month = date.getMonth();
      const monthName = date.toLocaleString('es-ES', { month: 'long' });
      const firstDayOfMonth = new Date(year, month, 1);
      const daysSinceMonthStart = Math.floor((date - firstDayOfMonth) / (1000 * 60 * 60 * 24));
      const weekOfMonth = Math.floor(daysSinceMonthStart / 7) + 1;
      const key = `${year}-${month}-${weekOfMonth}`;
      if (!acc[key]) acc[key] = { mantenimientos: [], monthName, year, weekOfMonth };
      acc[key].mantenimientos.push(m);
      return acc;
    }, {});

    const datosSemanales = [];
    Object.entries(mantenimientosPorSemana)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .forEach(([key, { mantenimientos, monthName, year, weekOfMonth }]) => {
        datosSemanales.push({ 
          Descripción: `Semana ${year}, Semana ${weekOfMonth} de ${monthName}`, 
          Valor: '', 
          Fecha: '', 
          'Factura adjunta': '' 
        });
        mantenimientos.forEach(m => {
          datosSemanales.push({
            Descripción: m.descripcion,
            Valor: Number(m.valor),
            Fecha: formatearFecha(m.fecha),
            'Factura adjunta': m.factura ? 'Sí' : 'No'
          });
        });
        const totalSemana = sumarTotal(mantenimientos);
        datosSemanales.push({ Descripción: 'Total Semana', Valor: totalSemana, Fecha: '', 'Factura adjunta': '' });
        datosSemanales.push({ Descripción: '', Valor: '', Fecha: '', 'Factura adjunta': '' });
      });

    const wsSemanal = XLSX.utils.json_to_sheet(datosSemanales);
    wsSemanal['!cols'] = wsCols;
    XLSX.utils.book_append_sheet(wb, wsSemanal, 'Vista Semanal');

    // Hoja Mensual
    const mantenimientosPorMes = vehiculo.historial.reduce((acc, m) => {
      const date = new Date(m.fecha);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(m);
      return acc;
    }, {});

    const datosMensuales = [];
    Object.entries(mantenimientosPorMes).forEach(([key, mantenimientos]) => {
      const [year, month] = key.split('-');
      const mesNombre = new Date(year, month - 1).toLocaleString('es-ES', { month: 'long', year: 'numeric' });
      datosMensuales.push({ Descripción: `Mes ${mesNombre}`, Valor: '', Fecha: '', 'Factura adjunta': '' });
      mantenimientos.forEach(m => {
        datosMensuales.push({
          Descripción: m.descripcion,
          Valor: Number(m.valor),
          Fecha: formatearFecha(m.fecha),
          'Factura adjunta': m.factura ? 'Sí' : 'No'
        });
      });
      const totalMes = sumarTotal(mantenimientos);
      datosMensuales.push({ Descripción: 'Total Mes', Valor: totalMes, Fecha: '', 'Factura adjunta': '' });
      datosMensuales.push({ Descripción: '', Valor: '', Fecha: '', 'Factura adjunta': '' });
    });

    const wsMensual = XLSX.utils.json_to_sheet(datosMensuales);
    wsMensual['!cols'] = wsCols;
    XLSX.utils.book_append_sheet(wb, wsMensual, 'Vista Mensual');

    // Hoja Anual
    const mantenimientosPorAnio = vehiculo.historial.reduce((acc, m) => {
      const year = new Date(m.fecha).getFullYear();
      if (!acc[year]) acc[year] = [];
      acc[year].push(m);
      return acc;
    }, {});

    const datosAnuales = [];
    Object.entries(mantenimientosPorAnio).forEach(([year, mantenimientos]) => {
      datosAnuales.push({ Descripción: `Año ${year}`, Valor: '', Fecha: '', 'Factura adjunta': '' });
      mantenimientos.forEach(m => {
        datosAnuales.push({
          Descripción: m.descripcion,
          Valor: Number(m.valor),
          Fecha: formatearFecha(m.fecha),
          'Factura adjunta': m.factura ? 'Sí' : 'No'
        });
      });
      const totalAnio = sumarTotal(mantenimientos);
      datosAnuales.push({ Descripción: 'Total Año', Valor: totalAnio, Fecha: '', 'Factura adjunta': '' });
      datosAnuales.push({ Descripción: '', Valor: '', Fecha: '', 'Factura adjunta': '' });
    });

    const wsAnual = XLSX.utils.json_to_sheet(datosAnuales);
    wsAnual['!cols'] = wsCols;
    XLSX.utils.book_append_sheet(wb, wsAnual, 'Vista Anual');

    XLSX.writeFile(wb, `historial_${vehiculo.placa}.xlsx`);
  };

  if (!vehiculo) return <p style={styles.loading}>Cargando vehículo...</p>;

  return (
    <div style={styles.container}>
      <Navbar />
      <h1 style={styles.title}>Historial de Mantenimientos - {vehiculo.placa}</h1>

      <div id="seccion-edicion" style={styles.section}>
        <h3 style={styles.sectionTitle}>{modoEdicion ? 'Editar Mantenimiento' : 'Agregar Nuevo Mantenimiento'}</h3>
        <div style={styles.form}>
          <input 
            type="text" 
            name="descripcion" 
            placeholder="Descripción del mantenimiento" 
            value={nuevoMantenimiento.descripcion} 
            onChange={handleChange} 
            style={styles.input} 
          />
          <input 
            type="number" 
            name="valor" 
            placeholder="Valor en pesos colombianos" 
            value={nuevoMantenimiento.valor} 
            onChange={handleChange} 
            style={styles.input} 
          />
          <input 
            type="date" 
            name="fecha" 
            value={nuevoMantenimiento.fecha} 
            onChange={handleChange} 
            style={styles.input} 
          />
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            style={styles.inputFile} 
          />
          <div style={styles.buttonContainer}>
            <button 
              onClick={modoEdicion ? guardarCambios : agregarMantenimiento} 
              style={modoEdicion ? styles.buttonSave : styles.buttonAdd}
            >
              {modoEdicion ? 'Guardar Cambios' : 'Agregar Mantenimiento'}
            </button>
            {modoEdicion && (
              <button 
                onClick={cancelarEdicion} 
                style={styles.buttonCancel}
              >
                Cancelar Edición
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Historial de Mantenimientos</h3>
        <div style={styles.filterContainer}>
          <input 
            type="text" 
            placeholder="Buscar por descripción" 
            value={busqueda} 
            onChange={(e) => setBusqueda(e.target.value)} 
            style={styles.inputFilter} 
          />
          <input 
            type="date" 
            placeholder="Filtrar por fecha" 
            value={fechaFiltro} 
            onChange={(e) => setFechaFiltro(e.target.value)} 
            style={styles.inputFilter} 
          />
          <button 
            onClick={exportarHistorialAExcel} 
            style={styles.buttonExport}
          >
            Exportar a Excel
          </button>
        </div>

        {filtrarMantenimientos().length === 0 ? (
          <p style={styles.noData}>No se encontraron mantenimientos.</p>
        ) : (
          <ul style={styles.list}>
            {filtrarMantenimientos().map((mantenimiento) => (
              <li key={mantenimiento.id} style={styles.listItem}>
                <div style={styles.itemInfo}>
                  <strong style={styles.itemTitle}>{mantenimiento.descripcion}</strong>
                  <p style={styles.itemDetails}>
                    {Number(mantenimiento.valor).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })} - {formatearFecha(mantenimiento.fecha)}
                  </p>
                </div>
                <div style={styles.actions}>
                  {mantenimiento.factura && (
                    <button 
                      onClick={() => verFactura(mantenimiento.factura)} 
                      style={styles.viewButton}
                    >
                      Ver Factura
                    </button>
                  )}
                  <button 
                    onClick={() => editarMantenimiento(mantenimiento)} 
                    style={styles.editButton}
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => eliminarMantenimiento(mantenimiento.id)} 
                    style={styles.deleteButton}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '3rem 2rem',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    fontFamily: "'Inter', sans-serif",
    maxWidth: '1200px',
    margin: '0 auto',
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#4b5563',
    marginTop: '2rem',
  },
  title: {
    textAlign: 'center',
    marginBottom: '3rem',
    color: '#1f2937',
    fontSize: '2.5rem',
    fontWeight: '700',
  },
  section: {
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '12px',
    marginBottom: '2.5rem',
    boxShadow: '0 6px 20px rgba(0,0,0,0.05)',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: '#1f2937',
    marginBottom: '1.5rem',
    fontWeight: '600',
  },
  form: {
    display: 'grid',
    gap: '1rem',
    maxWidth: '600px',
  },
  input: {
    width: '100%',
    padding: '0.9rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '1rem',
    color: '#374151',
    backgroundColor: '#f9fafb',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    outline: 'none',
  },
  inputFile: {
    width: '100%',
    padding: '0.9rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '1rem',
    color: '#374151',
    backgroundColor: '#f9fafb',
    cursor: 'pointer',
  },
  buttonContainer: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  buttonAdd: {
    padding: '0.9rem',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s, transform 0.1s',
  },
  buttonSave: {
    padding: '0.9rem',
    backgroundColor: '#059669',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s, transform 0.1s',
  },
  buttonCancel: {
    padding: '0.9rem',
    backgroundColor: '#6b7280',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s, transform 0.1s',
  },
  filterContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '2rem',
    alignItems: 'center',
  },
  inputFilter: {
    flex: '1 1 200px',
    padding: '0.9rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '1rem',
    color: '#374151',
    backgroundColor: '#f9fafb',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    outline: 'none',
  },
  buttonExport: {
    padding: '0.9rem 1.5rem',
    backgroundColor: '#16a34a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s, transform 0.1s',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    backgroundColor: '#f9fafb',
    padding: '1.5rem',
    marginBottom: '1rem',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s',
  },
  itemInfo: {
    flex: '1 1 60%',
    minWidth: '200px',
  },
  itemTitle: {
    fontSize: '1.1rem',
    color: '#1f2937',
    fontWeight: '600',
    marginBottom: '0.5rem',
  },
  itemDetails: {
    fontSize: '0.95rem',
    color: '#6b7280',
    margin: 0,
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  viewButton: {
    padding: '0.6rem 1.2rem',
    backgroundColor: '#0284c7',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s, transform 0.1s',
  },
  editButton: {
    padding: '0.6rem 1.2rem',
    backgroundColor: '#f59e0b',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s, transform 0.1s',
  },
  deleteButton: {
    padding: '0.6rem 1.2rem',
    backgroundColor: '#dc2626',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s, transform 0.1s',
  },
  noData: {
    textAlign: 'center',
    fontSize: '1rem',
    color: '#6b7280',
    marginTop: '2rem',
  }
};

function dataURLtoBlob(dataurl) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

export default HistorialVehiculo;