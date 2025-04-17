import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import withAuth from '../../utils/withAuth';
import * as XLSX from 'xlsx';

const Vehiculos = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarEnAlerta, setMostrarEnAlerta] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Detectar si es móvil
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cargar vehículos
  useEffect(() => {
    const fetchVehiculos = () => {
      try {
        setIsLoading(true);
        const localData = JSON.parse(localStorage.getItem('vehiculos')) || [];
        setVehiculos(localData);
      } catch (error) {
        console.error('Error al cargar vehículos:', error);
        setVehiculos([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVehiculos();
  }, []);

  // Formatear fechas
  const formatearFecha = useCallback((fecha) => {
    if (!fecha) return 'N/A';
    const opciones = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
  }, []);

  // Calcular alertas de vencimiento
  const obtenerAlertaVencimiento = useCallback((fechaVigencia) => {
    if (!fechaVigencia) return { fecha: 'N/A', mensaje: 'Sin fecha', color: 'transparent', icon: '❓' };
    
    const fechaVencimiento = new Date(fechaVigencia);
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

  // Filtrar vehículos
  const vehiculosFiltrados = useMemo(() => {
    let resultado = vehiculos.filter(vehiculo => {
      const placaMatch = vehiculo.placa?.toLowerCase().includes(busqueda.toLowerCase());
      const conductorMatch = vehiculo.conductor?.toLowerCase().includes(busqueda.toLowerCase());
      return placaMatch || conductorMatch;
    });

    if (mostrarEnAlerta) {
      resultado = resultado.filter(vehiculo => {
        const soatDiferencia = vehiculo.soatVigencia 
          ? Math.floor((new Date(vehiculo.soatVigencia) - new Date()) / (1000 * 60 * 60 * 24))
          : Infinity;
        
        const tecnoDiferencia = vehiculo.tecnoMecanicaVigencia 
          ? Math.floor((new Date(vehiculo.tecnoMecanicaVigencia) - new Date()) / (1000 * 60 * 60 * 24))
          : Infinity;
        
        return soatDiferencia <= 15 || tecnoDiferencia <= 15;
      });
    }

    return resultado;
  }, [vehiculos, busqueda, mostrarEnAlerta]);

  // Acciones CRUD
  const eliminarVehiculo = useCallback((placa) => {
    const confirmar = window.confirm('¿Eliminar este vehículo?');
    if (!confirmar) return;

    try {
      const localData = JSON.parse(localStorage.getItem('vehiculos')) || [];
      const updatedLocalData = localData.filter(v => v.placa !== placa);
      
      localStorage.setItem('vehiculos', JSON.stringify(updatedLocalData));
      setVehiculos(updatedLocalData);
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

  // Exportar a Excel
  const exportarAExcel = useCallback(() => {
    const vehiculosParaExportar = vehiculosFiltrados.map(vehiculo => ({
      'Conductor': vehiculo.conductor || 'N/A',
      'Placa': vehiculo.placa || 'N/A',
      'Marca': vehiculo.marca || 'N/A',
      'Modelo': vehiculo.modelo || 'N/A',
      'Año': vehiculo.año || 'N/A',
      'SOAT': `${formatearFecha(vehiculo.soatVigencia)} - ${obtenerAlertaVencimiento(vehiculo.soatVigencia).mensaje}`,
      'TecnoMecánica': `${formatearFecha(vehiculo.tecnoMecanicaVigencia)} - ${obtenerAlertaVencimiento(vehiculo.tecnoMecanicaVigencia).mensaje}`,
    }));

    const ws = XLSX.utils.json_to_sheet(vehiculosParaExportar);
    
    const columnWidths = [
      { wch: 20 },  // Conductor
      { wch: 12 },  // Placa
      { wch: 15 },  // Marca
      { wch: 15 },  // Modelo
      { wch: 8 },   // Año
      { wch: 30 },  // SOAT
      { wch: 30 }   // TecnoMecánica
    ];
    
    ws['!cols'] = columnWidths;
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Vehículos');
    XLSX.writeFile(wb, 'vehiculos.xlsx');
  }, [vehiculosFiltrados, formatearFecha, obtenerAlertaVencimiento]);

  // Estilos responsivos
  const styles = {
    container: {
      padding: isMobile ? '0.5rem' : '2rem 5%',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      fontFamily: "'Inter', sans-serif",
      width: '100%',
      maxWidth: '1400px',
      margin: '0 auto',
      boxSizing: 'border-box'
    },
    header: {
      marginBottom: isMobile ? '1rem' : '2rem',
    },
    title: {
      textAlign: 'center',
      marginBottom: isMobile ? '1rem' : '1.8rem',
      color: '#1f2937',
      fontSize: isMobile ? '1.5rem' : '2.2rem',
      fontWeight: '700',
    },
    controls: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? '0.8rem' : '1.5rem',
      marginBottom: isMobile ? '1rem' : '2rem',
      alignItems: 'center',
      width: '100%',
    },
    searchInput: {
      padding: isMobile ? '1rem' : '1.2rem 1.5rem',
      border: '1px solid #d1d5db',
      borderRadius: '10px',
      fontSize: isMobile ? '1rem' : '1.2rem',
      backgroundColor: '#fff',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      width: '100%',
      transition: 'all 0.3s ease',
      outline: 'none',
      ':focus': {
        borderColor: '#3b82f6',
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.2)'
      }
    },
    buttonGroup: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: '0.8rem',
      width: '100%',
    },
    button: {
      padding: isMobile ? '1rem' : '1rem 1.5rem',
      border: 'none',
      borderRadius: '10px',
      fontSize: isMobile ? '1rem' : '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      width: isMobile ? '100%' : 'auto',
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    buttonAdd: {
      backgroundColor: '#2563eb',
      color: '#fff',
      ':hover': {
        backgroundColor: '#1d4ed8'
      }
    },
    buttonExport: {
      backgroundColor: '#16a34a',
      color: '#fff',
      ':hover': {
        backgroundColor: '#15803d'
      }
    },
    buttonAlerta: {
      backgroundColor: mostrarEnAlerta ? '#d97706' : '#6b7280',
      color: '#fff',
      ':hover': {
        backgroundColor: mostrarEnAlerta ? '#b45309' : '#4b5563'
      }
    },
    tableContainer: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      width: '100%',
      overflowX: 'auto',
      maxWidth: '100%'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    th: {
      padding: isMobile ? '0.8rem' : '1.2rem',
      textAlign: 'left',
      backgroundColor: '#1f2937',
      color: '#fff',
      fontSize: isMobile ? '0.9rem' : '1rem',
      fontWeight: '600',
      position: 'sticky',
      top: 0,
      whiteSpace: 'nowrap'
    },
    td: {
      padding: isMobile ? '0.8rem' : '1rem',
      borderBottom: '1px solid #e5e7eb',
      fontSize: isMobile ? '0.9rem' : '1rem',
      verticalAlign: 'top',
      whiteSpace: 'nowrap'
    },
    alertCell: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.3rem'
    },
    alertText: {
      fontSize: isMobile ? '0.8rem' : '0.9rem',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '0.3rem'
    },
    actions: {
      display: 'flex',
      gap: isMobile ? '0.5rem' : '0.8rem',
      flexWrap: 'wrap'
    },
    actionButton: {
      padding: isMobile ? '0.5rem 0.8rem' : '0.6rem 1rem',
      borderRadius: '8px',
      fontSize: isMobile ? '0.8rem' : '0.9rem',
      border: 'none',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      transition: 'all 0.2s ease'
    },
    editButton: {
      backgroundColor: '#f59e0b',
      color: '#fff',
      ':hover': {
        backgroundColor: '#d97706'
      }
    },
    deleteButton: {
      backgroundColor: '#dc2626',
      color: '#fff',
      ':hover': {
        backgroundColor: '#b91c1c'
      }
    },
    historialButton: {
      backgroundColor: '#0284c7',
      color: '#fff',
      ':hover': {
        backgroundColor: '#0369a1'
      }
    },
    emptyState: {
      padding: isMobile ? '1.5rem' : '2.5rem',
      textAlign: 'center',
      color: '#6b7280',
      fontSize: isMobile ? '1rem' : '1.1rem',
      lineHeight: '1.6'
    },
    mobileCard: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      padding: '1.2rem',
      marginBottom: '1rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '0.8rem',
      borderBottom: '1px solid #e5e7eb',
      paddingBottom: '0.8rem'
    },
    cardTitle: {
      fontWeight: 'bold',
      fontSize: '1.1rem',
      color: '#1f2937'
    },
    cardContent: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem',
      marginTop: '0.8rem'
    },
    cardItem: {
      marginBottom: '0.8rem'
    },
    cardLabel: {
      fontWeight: '600',
      fontSize: '0.85rem',
      color: '#6b7280',
      marginBottom: '0.3rem'
    },
    cardValue: {
      fontSize: '0.95rem',
      color: '#1f2937'
    }
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
              ? 'No hay vehículos con documentos por vencer' 
              : busqueda
                ? 'No se encontraron vehículos con esa búsqueda'
                : 'No hay vehículos registrados'}
          </div>
        ) : isMobile ? (
          <div>
            {vehiculosFiltrados.map((vehiculo) => {
              const soatAlerta = obtenerAlertaVencimiento(vehiculo.soatVigencia);
              const tecnoAlerta = obtenerAlertaVencimiento(vehiculo.tecnoMecanicaVigencia);

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
                        fontSize: '0.85rem'
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
                        fontSize: '0.85rem'
                      }}>
                        {tecnoAlerta.icon} {tecnoAlerta.mensaje}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
                    <button 
                      onClick={() => verHistorial(vehiculo.placa)} 
                      style={{ 
                        ...styles.actionButton, 
                        ...styles.historialButton,
                        flex: 1,
                        padding: '0.8rem'
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
                        padding: '0.8rem'
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
                        padding: '0.8rem'
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
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {vehiculosFiltrados.map((vehiculo) => {
                const soatAlerta = obtenerAlertaVencimiento(vehiculo.soatVigencia);
                const tecnoAlerta = obtenerAlertaVencimiento(vehiculo.tecnoMecanicaVigencia);

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