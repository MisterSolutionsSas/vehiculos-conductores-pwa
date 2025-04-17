import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import withAuth from '../../../utils/withAuth';

const DetalleConductor = () => {
  const router = useRouter();
  const { id } = router.query;
  const [conductor, setConductor] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (id) {
      try {
        setIsLoading(true);
        const conductores = JSON.parse(localStorage.getItem('conductores')) || [];
        const conductorEncontrado = conductores.find(c => c.id === parseInt(id));
        setConductor(conductorEncontrado || null);
      } catch (error) {
        console.error('Error al cargar conductor:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [id]);

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    const opciones = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
  };

  const styles = {
    container: {
      padding: isMobile ? '1rem' : '2rem',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      fontFamily: "'Inter', sans-serif",
      maxWidth: '800px',
      margin: '0 auto'
    },
    title: {
      textAlign: 'center',
      marginBottom: '2rem',
      color: '#1f2937',
      fontSize: isMobile ? '1.8rem' : '2.2rem',
      fontWeight: '700'
    },
    card: {
      backgroundColor: '#ffffff',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 6px 20px rgba(0,0,0,0.05)',
      display: 'grid',
      gap: '1.5rem'
    },
    field: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    label: {
      fontSize: '1rem',
      color: '#4b5563',
      fontWeight: '600'
    },
    value: {
      fontSize: '1rem',
      color: '#374151'
    },
    button: {
      padding: '1rem',
      backgroundColor: '#2563eb',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      ':hover': {
        backgroundColor: '#1d4ed8'
      }
    },
    emptyState: {
      textAlign: 'center',
      color: '#6b7280',
      fontSize: '1.1rem',
      padding: '2rem'
    }
  };

  return (
    <div style={styles.container}>
      <Navbar isMobile={isMobile} />
      <h1 style={styles.title}>Detalles del Conductor</h1>
      
      {isLoading ? (
        <div style={styles.emptyState}>Cargando...</div>
      ) : !conductor ? (
        <div style={styles.emptyState}>Conductor no encontrado</div>
      ) : (
        <div style={styles.card}>
          <div style={styles.field}>
            <span style={styles.label}>Nombre completo</span>
            <span style={styles.value}>{conductor.nombre || 'N/A'}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Documento de identidad</span>
            <span style={styles.value}>{conductor.documento || 'N/A'}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Teléfono</span>
            <span style={styles.value}>{conductor.telefono || 'N/A'}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Número de licencia</span>
            <span style={styles.value}>{conductor.numeroLicencia || 'N/A'}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Categoría de licencia</span>
            <span style={styles.value}>{conductor.categoriaLicencia || 'N/A'}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Fecha de vencimiento</span>
            <span style={styles.value}>{formatearFecha(conductor.licenciaVigencia)}</span>
          </div>
          <button 
            onClick={() => router.push('/conductores')} 
            style={styles.button}
          >
            Volver
          </button>
        </div>
      )}
    </div>
  );
};

export default withAuth(DetalleConductor);