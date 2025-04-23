import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import withAuth from '../../utils/withAuth';
import * as XLSX from 'xlsx';
import { supabase } from '../../supabaseClient';

const Vehiculos = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarEnAlerta, setMostrarEnAlerta] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const busquedaGuardada = localStorage.getItem('busquedaVehiculos') || '';
    setBusqueda(busquedaGuardada);
  }, []);

  useEffect(() => {
    localStorage.setItem('busquedaVehiculos', busqueda);
  }, [busqueda]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchVehiculos = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('vehiculos')
          .select('*');

        if (error) throw error;
        setVehiculos(data || []);
      } catch (error) {
        console.error('Error al cargar vehículos desde Supabase:', error);
        setVehiculos([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVehiculos();
  }, []);

  const formatearFecha = useCallback((fecha) => {
    if (!fecha || fecha === null || fecha === undefined) return 'N/A';
    try {
      const fechaParsed = new Date(fecha);
      if (isNaN(fechaParsed.getTime())) return 'N/A';
      const opciones = { year: 'numeric', month: 'short', day: 'numeric' };
      return fechaParsed.toLocaleDateString('es-ES', opciones);
    } catch (error) {
      console.error('Error al formatear fecha:', fecha, error);
      return 'N/A';
    }
  }, []);

  const obtenerAlertaVencimiento = useCallback((fechaVigencia) => {
    if (!fechaVigencia || fechaVigencia === null || fechaVigencia === undefined) {
      return { fecha: 'N/A', mensaje: 'Sin fecha', color: 'transparent', icon: '❓' };
    }
    
    const fechaVencimiento = new Date(fechaVigencia);
    if (isNaN(fechaVencimiento.getTime())) {
      return { fecha: 'N/A', mensaje: 'Fecha inválida', color: 'transparent', icon: '❓' };
    }
    
    const hoy = new Date();
    const diferencia = Math.floor((fechaVencimiento - hoy) / (1000 * 60 * 60 * 24));

    const fechaFormateada = formatearFecha(fechaVigencia);
    let mensaje = '';
    let color = 'transparent';
    let icon = '';

    if (diferencia <= 0) {
      mensaje = `Vencido (${Math.abs(diferencia)} días)`;
      color = '#fee2e2';
      icon = '❗';
    } else if (diferencia <= 15) {
      mensaje = `Vence en ${diferencia} días`;
      color = '#ffedd5';
      icon = '⚠️';
    } else {
      mensaje = `${diferencia} días restantes`;
      icon = '✅';
    }

    return { fecha: fechaFormateada, mensaje, color, icon };
  }, [formatearFecha]);

  const obtenerAlertaCambioAceite = useCallback((fechaUltimoCambio) => {
    if (!fechaUltimoCambio || fechaUltimoCambio === null || fechaUltimoCambio === undefined) {
      return { fecha: 'N/A', mensaje: 'Sin fecha', color: 'transparent', icon: '❓' };
    }

    const fechaCambio = new Date(fechaUltimoCambio);
    if (isNaN(fechaCambio.getTime())) {
      return { fecha: 'N/A', mensaje: 'Fecha inválida', color: 'transparent', icon: '❓' };
    }

    const fechaProximoCambio = new Date(fechaCambio);
    fechaProximoCambio.setDate(fechaCambio.getDate() + 60);
    
    const hoy = new Date();
    const diferencia = Math.floor((fechaProximoCambio - hoy) / (1000 * 60 * 60 * 24));
    const diasDesdeCambio = Math.floor((hoy - fechaCambio) / (1000 * 60 * 60 * 24));

    const fechaFormateada = formatearFecha(fechaUltimoCambio);
    let mensaje = '';
    let color = 'transparent';
    let icon = '';

    if (diferencia <= 0) {
      mensaje = `Vencido (${Math.abs(diferencia)} días)`;
      color = '#fee2e2';
      icon = '❗';
    } else if (diferencia <= 7) {
      mensaje = `Próximo en ${diferencia} días`;
      color = '#ffedd5';
      icon = '⚠️';
    } else {
      mensaje = `Último cambio hace ${diasDesdeCambio} días`;
      icon = '✅';
    }

    return { fecha: fechaFormateada, mensaje, color, icon };
  }, [formatearFecha]);

  const vehiculosFiltrados = useMemo(() => {
    let resultado = vehiculos.filter(vehiculo => {
      const placaMatch = vehiculo.placa?.toLowerCase().includes(busqueda.toLowerCase());
      const conductorMatch = vehiculo.conductor?.toLowerCase().includes(busqueda.toLowerCase());
      return placaMatch || conductorMatch;
    });

    if (mostrarEnAlerta) {
      resultado = resultado.filter(vehiculo => {
        const soatDiferencia = vehiculo.soatvigencia 
          ? Math.floor((new Date(vehiculo.soatvigencia) - new Date()) / (1000 * 60 * 60 * 24))
          : Infinity;
        
        const tecnoDiferencia = vehiculo.tecnomecanicavigencia 
          ? Math.floor((new Date(vehiculo.tecnomecanicavigencia) - new Date()) / (1000 * 60 * 60 * 24))
          : Infinity;
        
        const aceiteDiferencia = vehiculo.ultimocambioaceite
          ? Math.floor((new Date(new Date(vehiculo.ultimocambioaceite).setDate(new Date(vehiculo.ultimocambioaceite).getDate() + 60)) - new Date()) / (1000 * 60 * 60 * 24))
          : Infinity;

        return soatDiferencia <= 15 || tecnoDiferencia <= 15 || aceiteDiferencia <= 7;
      });
    }

    return resultado;
  }, [vehiculos, busqueda, mostrarEnAlerta]);

  const eliminarVehiculo = useCallback(async (placa) => {
    const confirmar = window.confirm('¿Eliminar este vehículo?');
    if (!confirmar) return;

    try {
      const { error } = await supabase
        .from('vehiculos')
        .delete()
        .eq('placa', placa);

      if (error) throw error;

      setVehiculos(prevVehiculos => prevVehiculos.filter(v => v.placa !== placa));
    } catch (error) {
      console.error('Error al eliminar vehículo:', error);
      alert('No se pudo eliminar el vehículo');
    }
  }, []);

  const editarVehiculo = useCallback((placa) => {
    router.push(`/vehiculos/editar/${placa}`);
  }, [router]);

  const verHistorial = useCallback((placa) => {
    router.push(`/vehiculos/historial/${placa}`);
  }, [router]);

  const exportarAExcel = useCallback(() => {
    const vehiculosParaExportar = vehiculosFiltrados.map(vehiculo => ({
      'Conductor': vehiculo.conductor || 'N/A',
      'Placa': vehiculo.placa || 'N/A',
      'Marca': vehiculo.marca || 'N/A',
      'Modelo': vehiculo.modelo || 'N/A',
      'Año': vehiculo.año || 'N/A',
      'SOAT': `${formatearFecha(vehiculo.soatvigencia)} - ${obtenerAlertaVencimiento(vehiculo.soatvigencia).mensaje}`,
      'TecnoMecánica': `${formatearFecha(vehiculo.tecnomecanicavigencia)} - ${obtenerAlertaVencimiento(vehiculo.tecnomecanicavigencia).mensaje}`,
      'Último Cambio Aceite': `${formatearFecha(vehiculo.ultimocambioaceite)} - ${obtenerAlertaCambioAceite(vehiculo.ultimocambioaceite).mensaje}`,
    }));

    const ws = XLSX.utils.json_to_sheet(vehiculosParaExportar);
    
    const columnWidths = [
      { wch: 20 },
      { wch: 12 },
      { wch: 15 },
      { wch: 15 },
      { wch: 8 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
    ];
    
    ws['!cols'] = columnWidths;
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Vehículos');
    XLSX.writeFile(wb, 'vehiculos.xlsx');
  }, [vehiculosFiltrados, formatearFecha, obtenerAlertaVencimiento, obtenerAlertaCambioAceite]);

  const styles = {
    container: {
      padding: isMobile ? '1rem' : '2rem 5%',
      backgroundColor: '#f7fafc',
      minHeight: '100vh',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      width: '100%',
      maxWidth: '1600px',
      margin: '0 auto',
      boxSizing: 'border-box',
    },
    header: {
      marginBottom: isMobile ? '1.5rem' : '2.5rem',
    },
    title: {
      textAlign: 'center',
      marginBottom: isMobile ? '1.2rem' : '2rem',
      color: '#1a202c',
      fontSize: isMobile ? '1.75rem' : '2.25rem',
      fontWeight: '700',
    },
    controls: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? '1rem' : '1.5rem',
      marginBottom: isMobile ? '1.5rem' : '2.5rem',
      alignItems: 'center',
      width: '100%',
    },
    searchInput: {
      padding: isMobile ? '0.875rem' : '1rem 1.5rem',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: isMobile ? '0.875rem' : '1rem',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
      width: '100%',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      outline: 'none',
      ':focus': {
        borderColor: '#2b6cb0',
        boxShadow: '0 0 0 3px rgba(43, 108, 176, 0.2)',
      },
    },
    buttonGroup: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: '0.75rem',
      width: isMobile ? '100%' : 'auto',
    },
    button: {
      padding: isMobile ? '1rem' : '0.875rem 1.5rem',
      border: 'none',
      borderRadius: '8px',
      fontSize: isMobile ? '0.875rem' : '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      width: isMobile ? '100%' : 'auto',
      transition: 'background-color 0.2s ease, transform 0.1s ease',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      ':hover': {
        transform: 'translateY(-1px)',
      },
      ':active': {
        transform: 'translateY(0)',
      },
    },
    buttonAdd: {
      backgroundColor: '#2b6cb0',
      color: '#fff',
      ':hover': {
        backgroundColor: '#2c5282',
      },
    },
    buttonExport: {
      backgroundColor: '#2f855a',
      color: '#fff',
      ':hover': {
        backgroundColor: '#276749',
      },
    },
    buttonAlerta: {
      backgroundColor: mostrarEnAlerta ? '#d97706' : '#4a5568',
      color: '#fff',
      ':hover': {
        backgroundColor: mostrarEnAlerta ? '#b45309' : '#2d3748',
      },
    },
    tableContainer: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      width: '100%',
      overflowX: 'auto',
      maxWidth: '100%',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      padding: isMobile ? '0.75rem' : '1rem',
      textAlign: 'left',
      backgroundColor: '#2d3748',
      color: '#ffffff',
      fontSize: isMobile ? '0.75rem' : '0.875rem',
      fontWeight: '600',
      position: 'sticky',
      top: 0,
      whiteSpace: 'nowrap',
    },
    td: {
      padding: isMobile ? '0.75rem' : '1rem',
      borderBottom: '1px solid #edf2f7',
      fontSize: isMobile ? '0.75rem' : '0.875rem',
      verticalAlign: 'top',
      whiteSpace: 'nowrap',
    },
    alertCell: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem',
    },
    alertText: {
      fontSize: isMobile ? '0.75rem' : '0.875rem',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
    },
    actions: {
      display: 'flex',
      gap: isMobile ? '0.5rem' : '0.75rem',
      flexWrap: 'wrap',
    },
    actionButton: {
      padding: isMobile ? '0.5rem 0.75rem' : '0.5rem 1rem',
      borderRadius: '8px',
      fontSize: isMobile ? '0.75rem' : '0.875rem',
      border: 'none',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      transition: 'background-color 0.2s ease, transform 0.1s ease',
      ':hover': {
        transform: 'translateY(-1px)',
      },
      ':active': {
        transform: 'translateY(0)',
      },
    },
    editButton: {
      backgroundColor: '#d97706',
      color: '#fff',
      ':hover': {
        backgroundColor: '#b45309',
      },
    },
    deleteButton: {
      backgroundColor: '#c53030',
      color: '#fff',
      ':hover': {
        backgroundColor: '#9b2c2c',
      },
    },
    historialButton: {
      backgroundColor: '#3182ce',
      color: '#fff',
      ':hover': {
        backgroundColor: '#2b6cb0',
      },
    },
    emptyState: {
      padding: isMobile ? '1.5rem' : '2.5rem',
      textAlign: 'center',
      color: '#4a5568',
      fontSize: isMobile ? '0.875rem' : '1rem',
      lineHeight: '1.6',
    },
    mobileCard: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '1.25rem',
      marginBottom: '1rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '0.75rem',
      borderBottom: '1px solid #edf2f7',
      paddingBottom: '0.75rem',
    },
    cardTitle: {
      fontWeight: '600',
      fontSize: '1rem',
      color: '#1a202c',
    },
    cardContent: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem',
      marginTop: '0.75rem',
    },
    cardItem: {
      marginBottom: '0.75rem',
    },
    cardLabel: {
      fontWeight: '600',
      fontSize: '0.75rem',
      color: '#4a5568',
      marginBottom: '0.25rem',
      textTransform: 'uppercase',
    },
    cardValue: {
      fontSize: '0.875rem',
      color: '#2d3748',
    },
  };

  return (
    <div style={styles.container}>
      <Navbar isMobile={isMobile} />
      
      <div style={styles.header}>
        <h1 style={styles.title}>Gestión de Vehículos</h1>

        <div style={styles.controls}>
          <input
            type="text"
            placeholder="Buscar por placa o conductor..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={styles.searchInput}
          />
          
          <div style={styles.buttonGroup}>
            <Link href="/vehiculos/registrar" passHref>
              <button style={{ ...styles.button, ...styles.buttonAdd }}>
                🚗 {isMobile ? 'Nuevo Vehículo' : 'Registrar Vehículo'}
              </button>
            </Link>
            
            <button 
              onClick={exportarAExcel} 
              style={{ ...styles.button, ...styles.buttonExport }}
            >
              📄 {isMobile ? 'Exportar Excel' : 'Exportar a Excel'}
            </button>
            
            <button 
              onClick={() => setMostrarEnAlerta(!mostrarEnAlerta)} 
              style={{ ...styles.button, ...styles.buttonAlerta }}
            >
              {mostrarEnAlerta ? '✅ Mostrar Todos' : '⚠️ Documentos por Vencer'}
            </button>
          </div>
        </div>
      </div>

      <div style={styles.tableContainer}>
        {isLoading ? (
          <div style={styles.emptyState}>Cargando vehículos...</div>
        ) : vehiculosFiltrados.length === 0 ? (
          <div style={styles.emptyState}>
            {mostrarEnAlerta 
              ? 'No hay vehículos con documentos o cambio de aceite por vencer' 
              : busqueda
                ? 'No se encontraron vehículos con esa búsqueda'
                : 'No hay vehículos registrados'}
          </div>
        ) : isMobile ? (
          <div>
            {vehiculosFiltrados.map((vehiculo) => {
              const soatAlerta = obtenerAlertaVencimiento(vehiculo.soatvigencia);
              const tecnoAlerta = obtenerAlertaVencimiento(vehiculo.tecnomecanicavigencia);
              const aceiteAlerta = obtenerAlertaCambioAceite(vehiculo.ultimocambioaceite);

              return (
                <div key={vehiculo.placa} style={styles.mobileCard}>
                  <div style={styles.cardHeader}>
                    <div style={styles.cardTitle}>{vehiculo.placa || 'N/A'}</div>
                    <div style={styles.cardTitle}>{vehiculo.marca || 'N/A'}</div>
                  </div>
                  
                  <div style={styles.cardContent}>
                    <div style={styles.cardItem}>
                      <div style={styles.cardLabel}>Conductor</div>
                      <div style={styles.cardValue}>{vehiculo.conductor || 'N/A'}</div>
                    </div>
                    
                    <div style={styles.cardItem}>
                      <div style={styles.cardLabel}>Modelo</div>
                      <div style={styles.cardValue}>{vehiculo.modelo || 'N/A'}</div>
                    </div>
                    
                    <div style={styles.cardItem}>
                      <div style={styles.cardLabel}>Año</div>
                      <div style={styles.cardValue}>{vehiculo.año || 'N/A'}</div>
                    </div>
                    
                    <div style={styles.cardItem}>
                      <div style={styles.cardLabel}>SOAT</div>
                      <div style={styles.cardValue}>{soatAlerta.fecha}</div>
                      <div style={{ 
                        padding: '0.4rem 0.6rem',
                        borderRadius: '6px',
                        backgroundColor: soatAlerta.color,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        marginTop: '0.4rem',
                        fontSize: '0.75rem',
                      }}>
                        {soatAlerta.icon} {soatAlerta.mensaje}
                      </div>
                    </div>
                    
                    <div style={styles.cardItem}>
                      <div style={styles.cardLabel}>TecnoMecánica</div>
                      <div style={styles.cardValue}>{tecnoAlerta.fecha}</div>
                      <div style={{ 
                        padding: '0.4rem 0.6rem',
                        borderRadius: '6px',
                        backgroundColor: tecnoAlerta.color,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        marginTop: '0.4rem',
                        fontSize: '0.75rem',
                      }}>
                        {tecnoAlerta.icon} {tecnoAlerta.mensaje}
                      </div>
                    </div>
                    
                    <div style={styles.cardItem}>
                      <div style={styles.cardLabel}>Último Cambio Aceite</div>
                      <div style={styles.cardValue}>{aceiteAlerta.fecha}</div>
                      <div style={{ 
                        padding: '0.4rem 0.6rem',
                        borderRadius: '6px',
                        backgroundColor: aceiteAlerta.color,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        marginTop: '0.4rem',
                        fontSize: '0.75rem',
                      }}>
                        {aceiteAlerta.icon} {aceiteAlerta.mensaje}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                    <button 
                      onClick={() => verHistorial(vehiculo.placa)} 
                      style={{ 
                        ...styles.actionButton, 
                        ...styles.historialButton,
                        flex: 1,
                        padding: '0.75rem',
                      }}
                    >
                      📄 Historial
                    </button>
                    <button 
                      onClick={() => editarVehiculo(vehiculo.placa)} 
                      style={{ 
                        ...styles.actionButton, 
                        ...styles.editButton,
                        flex: 1,
                        padding: '0.75rem',
                      }}
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      onClick={() => eliminarVehiculo(vehiculo.placa)} 
                      style={{ 
                        ...styles.actionButton, 
                        ...styles.deleteButton,
                        flex: 1,
                        padding: '0.75rem',
                      }}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Placa</th>
                <th style={styles.th}>Conductor</th>
                <th style={styles.th}>Marca</th>
                <th style={styles.th}>Modelo</th>
                <th style={styles.th}>Año</th>
                <th style={styles.th}>SOAT</th>
                <th style={styles.th}>TecnoMecánica</th>
                <th style={styles.th}>Último Cambio Aceite</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {vehiculosFiltrados.map((vehiculo) => {
                const soatAlerta = obtenerAlertaVencimiento(vehiculo.soatvigencia);
                const tecnoAlerta = obtenerAlertaVencimiento(vehiculo.tecnomecanicavigencia);
                const aceiteAlerta = obtenerAlertaCambioAceite(vehiculo.ultimocambioaceite);

                return (
                  <tr key={vehiculo.placa}>
                    <td style={styles.td}>{vehiculo.placa || 'N/A'}</td>
                    <td style={styles.td}>{vehiculo.conductor || 'N/A'}</td>
                    <td style={styles.td}>{vehiculo.marca || 'N/A'}</td>
                    <td style={styles.td}>{vehiculo.modelo || 'N/A'}</td>
                    <td style={styles.td}>{vehiculo.año || 'N/A'}</td>
                    <td style={{ ...styles.td, backgroundColor: soatAlerta.color }}>
                      <div style={styles.alertCell}>
                        <div>{soatAlerta.fecha}</div>
                        <div style={styles.alertText}>
                          {soatAlerta.icon} {soatAlerta.mensaje}
                        </div>
                      </div>
                    </td>
                    <td style={{ ...styles.td, backgroundColor: tecnoAlerta.color }}>
                      <div style={styles.alertCell}>
                        <div>{tecnoAlerta.fecha}</div>
                        <div style={styles.alertText}>
                          {tecnoAlerta.icon} {tecnoAlerta.mensaje}
                        </div>
                      </div>
                    </td>
                    <td style={{ ...styles.td, backgroundColor: aceiteAlerta.color }}>
                      <div style={styles.alertCell}>
                        <div>{aceiteAlerta.fecha}</div>
                        <div style={styles.alertText}>
                          {aceiteAlerta.icon} {aceiteAlerta.mensaje}
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actions}>
                        <button 
                          onClick={() => verHistorial(vehiculo.placa)} 
                          style={{ ...styles.actionButton, ...styles.historialButton }}
                        >
                          Historial
                        </button>
                        <button 
                          onClick={() => editarVehiculo(vehiculo.placa)} 
                          style={{ ...styles.actionButton, ...styles.editButton }}
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => eliminarVehiculo(vehiculo.placa)} 
                          style={{ ...styles.actionButton, ...styles.deleteButton }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default withAuth(Vehiculos);