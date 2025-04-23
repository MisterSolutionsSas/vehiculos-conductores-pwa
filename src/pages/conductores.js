import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import * as XLSX from 'xlsx';
import { supabase } from '../supabaseClient'; // Ajusta la ruta según la ubicación de supabaseClient.js

const Conductores = () => {
  const [conductores, setConductores] = useState([]);
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

  // Cargar conductores desde Supabase
  useEffect(() => {
    const fetchConductores = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('conductores')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        setConductores(data || []);
      } catch (error) {
        console.error('Error al cargar conductores:', error);
        alert('No se pudieron cargar los conductores.');
        setConductores([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConductores();
  }, []);

  // Formatear fechas
  const formatearFecha = useCallback((fecha) => {
    if (!fecha) return 'N/A';
    const opciones = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
  }, []);

  // Calcular alertas de vencimiento
  const obtenerAlertaVencimiento = useCallback(
    (fechaVigencia) => {
      if (!fechaVigencia)
        return { fecha: 'N/A', mensaje: 'Sin fecha', color: 'transparent', icon: '❓' };

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
    },
    [formatearFecha]
  );

  // Filtrar conductores
  const conductoresFiltrados = useMemo(() => {
    let resultado = conductores.filter((conductor) => {
      const nombreMatch = conductor.nombre?.toLowerCase().includes(busqueda.toLowerCase());
      const licenciaMatch = conductor.numero_licencia
        ?.toLowerCase()
        .includes(busqueda.toLowerCase());
      return nombreMatch || licenciaMatch;
    });

    if (mostrarEnAlerta) {
      resultado = resultado.filter((conductor) => {
        const licenciaDiferencia = conductor.licencia_vigencia
          ? Math.floor(
              (new Date(conductor.licencia_vigencia) - new Date()) / (1000 * 60 * 60 * 24)
            )
          : Infinity;
        return licenciaDiferencia <= 15;
      });
    }

    return resultado;
  }, [conductores, busqueda, mostrarEnAlerta]);

  // Acciones CRUD
  const eliminarConductor = useCallback(async (id) => {
    const confirmar = window.confirm('¿Eliminar este conductor?');
    if (!confirmar) return;

    try {
      const { error } = await supabase.from('conductores').delete().eq('id', id);

      if (error) throw error;

      setConductores((prev) => prev.filter((c) => c.id !== id));
      alert('Conductor eliminado exitosamente.');
    } catch (error) {
      console.error('Error al eliminar conductor:', error);
      alert('No se pudo eliminar el conductor: ' + error.message);
    }
  }, []);

  const editarConductor = useCallback(
    (id) => {
      router.push(`/conductores/editar/${id}`);
    },
    [router]
  );

  // Exportar a Excel
  const exportarAExcel = useCallback(() => {
    const conductoresParaExportar = conductoresFiltrados.map((conductor) => ({
      Nombre: conductor.nombre || 'N/A',
      Documento: conductor.documento || 'N/A',
      Teléfono: conductor.telefono || 'N/A',
      Licencia: conductor.numero_licencia || 'N/A',
      Categoría: conductor.categoria_licencia || 'N/A',
      Vencimiento: `${formatearFecha(conductor.licencia_vigencia)} - ${
        obtenerAlertaVencimiento(conductor.licencia_vigencia).mensaje
      }`,
    }));

    const ws = XLSX.utils.json_to_sheet(conductoresParaExportar);

    const columnWidths = [
      { wch: 25 }, // Nombre
      { wch: 15 }, // Documento
      { wch: 15 }, // Teléfono
      { wch: 15 }, // Licencia
      { wch: 12 }, // Categoría
      { wch: 30 }, // Vencimiento
    ];

    ws['!cols'] = columnWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Conductores');
    XLSX.writeFile(wb, 'conductores.xlsx');
  }, [conductoresFiltrados, formatearFecha, obtenerAlertaVencimiento]);

  // Estilos
  const styles = {
    container: {
      padding: isMobile ? '0.5rem' : '2rem 5%',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      fontFamily: "'Inter', sans-serif",
      width: '100%',
      maxWidth: '1400px',
      margin: '0 auto',
      boxSizing: 'border-box',
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
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    buttonAdd: {
      backgroundColor: '#2563eb',
      color: '#fff',
    },
    buttonExport: {
      backgroundColor: '#16a34a',
      color: '#fff',
    },
    buttonAlerta: {
      backgroundColor: mostrarEnAlerta ? '#d97706' : '#6b7280',
      color: '#fff',
    },
    tableContainer: {
      backgroundColor: '#fff',
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
      padding: isMobile ? '0.8rem' : '1.2rem',
      textAlign: 'left',
      backgroundColor: '#1f2937',
      color: '#fff',
      fontSize: isMobile ? '0.9rem' : '1rem',
      fontWeight: '600',
      position: 'sticky',
      top: 0,
      whiteSpace: 'nowrap',
    },
    td: {
      padding: isMobile ? '0.8rem' : '1rem',
      borderBottom: '1px solid #e5e7eb',
      fontSize: isMobile ? '0.9rem' : '1rem',
      verticalAlign: 'top',
      whiteSpace: 'nowrap',
    },
    alertCell: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.3rem',
    },
    alertText: {
      fontSize: isMobile ? '0.8rem' : '0.9rem',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '0.3rem',
    },
    actions: {
      display: 'flex',
      gap: isMobile ? '0.5rem' : '0.8rem',
      flexWrap: 'wrap',
    },
    actionButton: {
      padding: isMobile ? '0.5rem 0.8rem' : '0.6rem 1rem',
      borderRadius: '8px',
      fontSize: isMobile ? '0.8rem' : '0.9rem',
      border: 'none',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      transition: 'all 0.2s ease',
    },
    editButton: {
      backgroundColor: '#f59e0b',
      color: '#fff',
    },
    deleteButton: {
      backgroundColor: '#dc2626',
      color: '#fff',
    },
    emptyState: {
      padding: isMobile ? '1.5rem' : '2.5rem',
      textAlign: 'center',
      color: '#6b7280',
      fontSize: isMobile ? '1rem' : '1.1rem',
      lineHeight: '1.6',
    },
    mobileCard: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      padding: '1.2rem',
      marginBottom: '1rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '0.8rem',
      borderBottom: '1px solid #e5e7eb',
      paddingBottom: '0.8rem',
    },
    cardTitle: {
      fontWeight: 'bold',
      fontSize: '1.1rem',
      color: '#1f2937',
    },
    cardContent: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem',
      marginTop: '0.8rem',
    },
    cardItem: {
      marginBottom: '0.8rem',
    },
    cardLabel: {
      fontWeight: '600',
      fontSize: '0.85rem',
      color: '#6b7280',
      marginBottom: '0.3rem',
    },
    cardValue: {
      fontSize: '0.95rem',
      color: '#1f2937',
    },
  };

  return (
    <div style={styles.container}>
      <Navbar isMobile={isMobile} />

      <div style={styles.header}>
        <h1 style={styles.title}>Gestión de Conductores</h1>

        <div style={styles.controls}>
          <input
            type="text"
            placeholder="Buscar por nombre o licencia..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={styles.searchInput}
          />

          <div style={styles.buttonGroup}>
            <Link href="/conductores/registrar" passHref>
              <button style={{ ...styles.button, ...styles.buttonAdd }}>
                👤 {isMobile ? 'Nuevo Conductor' : 'Registrar Conductor'}
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
              {mostrarEnAlerta ? '✅ Mostrar Todos' : '⚠️ Licencias por Vencer'}
            </button>
          </div>
        </div>
      </div>

      <div style={styles.tableContainer}>
        {isLoading ? (
          <div style={styles.emptyState}>Cargando conductores...</div>
        ) : conductoresFiltrados.length === 0 ? (
          <div style={styles.emptyState}>
            {mostrarEnAlerta
              ? 'No hay conductores con licencias por vencer'
              : busqueda
              ? 'No se encontraron conductores con esa búsqueda'
              : 'No hay conductores registrados'}
          </div>
        ) : isMobile ? (
          <div>
            {conductoresFiltrados.map((conductor) => {
              const licenciaAlerta = obtenerAlertaVencimiento(conductor.licencia_vigencia);

              return (
                <div key={conductor.id} style={styles.mobileCard}>
                  <div style={styles.cardHeader}>
                    <div style={styles.cardTitle}>{conductor.nombre || 'N/A'}</div>
                    <div style={styles.cardTitle}>{conductor.numero_licencia || 'N/A'}</div>
                  </div>

                  <div style={styles.cardContent}>
                    <div style={styles.cardItem}>
                      <div style={styles.cardLabel}>Documento</div>
                      <div style={styles.cardValue}>{conductor.documento || 'N/A'}</div>
                    </div>

                    <div style={styles.cardItem}>
                      <div style={styles.cardLabel}>Teléfono</div>
                      <div style={styles.cardValue}>{conductor.telefono || 'N/A'}</div>
                    </div>

                    <div style={styles.cardItem}>
                      <div style={styles.cardLabel}>Categoría</div>
                      <div style={styles.cardValue}>{conductor.categoria_licencia || 'N/A'}</div>
                    </div>

                    <div style={styles.cardItem}>
                      <div style={styles.cardLabel}>Licencia</div>
                      <div style={styles.cardValue}>{licenciaAlerta.fecha}</div>
                      <div
                        style={{
                          padding: '0.4rem 0.6rem',
                          borderRadius: '6px',
                          backgroundColor: licenciaAlerta.color,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          marginTop: '0.4rem',
                          fontSize: '0.85rem',
                        }}
                      >
                        {licenciaAlerta.icon} {licenciaAlerta.mensaje}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
                    <button
                      onClick={() => editarConductor(conductor.id)}
                      style={{
                        ...styles.actionButton,
                        ...styles.editButton,
                        flex: 1,
                        padding: '0.8rem',
                      }}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => eliminarConductor(conductor.id)}
                      style={{
                        ...styles.actionButton,
                        ...styles.deleteButton,
                        flex: 1,
                        padding: '0.8rem',
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
                <th style={styles.th}>Nombre</th>
                <th style={styles.th}>Documento</th>
                <th style={styles.th}>Teléfono</th>
                <th style={styles.th}>Licencia</th>
                <th style={styles.th}>Categoría</th>
                <th style={styles.th}>Vencimiento</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {conductoresFiltrados.map((conductor) => {
                const licenciaAlerta = obtenerAlertaVencimiento(conductor.licencia_vigencia);

                return (
                  <tr key={conductor.id}>
                    <td style={styles.td}>{conductor.nombre || 'N/A'}</td>
                    <td style={styles.td}>{conductor.documento || 'N/A'}</td>
                    <td style={styles.td}>{conductor.telefono || 'N/A'}</td>
                    <td style={styles.td}>{conductor.numero_licencia || 'N/A'}</td>
                    <td style={styles.td}>{conductor.categoria_licencia || 'N/A'}</td>
                    <td style={{ ...styles.td, backgroundColor: licenciaAlerta.color }}>
                      <div style={styles.alertCell}>
                        <div>{licenciaAlerta.fecha}</div>
                        <div style={styles.alertText}>
                          {licenciaAlerta.icon} {licenciaAlerta.mensaje}
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actions}>
                        <button
                          onClick={() => editarConductor(conductor.id)}
                          style={{ ...styles.actionButton, ...styles.editButton }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => eliminarConductor(conductor.id)}
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

export default Conductores;