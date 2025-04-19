import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import withAuth from '../../utils/withAuth';

const RegistrarConductor = () => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    nombre: '',
    documento: '',
    telefono: '',
    numeroLicencia: '',
    categoriaLicencia: '',
    licenciaVigencia: ''
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Validación básica
      if (!formData.nombre || !formData.documento || !formData.numeroLicencia) {
        throw new Error('Los campos nombre, documento y número de licencia son obligatorios');
      }

      // Guardar en localStorage (simulando API)
      const conductores = JSON.parse(localStorage.getItem('conductores')) || [];
      const nuevoConductor = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('conductores', JSON.stringify([...conductores, nuevoConductor]));
      
      // Redirigir después de guardar
      router.push('/conductores');
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Ocurrió un error al registrar');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    const confirmar = window.confirm('¿Estás seguro de que deseas cancelar? Los datos ingresados se perderán.');
    if (confirmar) {
      router.push('/conductores');
    }
  };

  const styles = {
    container: {
      padding: isMobile ? '1rem' : '1.5rem',
      backgroundColor: '#f5f7fa',
      minHeight: '100vh',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      maxWidth: '100%',
      margin: '0 auto'
    },
    header: {
      marginBottom: '1.5rem',
      padding: '0 0.5rem',
    },
    title: {
      fontSize: isMobile ? '1.5rem' : '1.8rem',
      fontWeight: '600',
      color: '#1a202c',
      marginBottom: '0.5rem',
    },
    subtitle: {
      fontSize: '1rem',
      color: '#4a5568',
    },
    form: {
      backgroundColor: '#ffffff',
      padding: isMobile ? '1.25rem' : '1.5rem',
      borderRadius: '0.75rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    label: {
      fontSize: '0.95rem',
      color: '#4a5568',
      fontWeight: '500'
    },
    input: {
      padding: '0.75rem',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      fontSize: '0.95rem',
      color: '#2d3748',
      backgroundColor: '#f8fafc',
      outline: 'none',
      width: '100%',
      ':focus': {
        borderColor: '#4299e1',
        boxShadow: '0 0 0 2px rgba(66, 153, 225, 0.2)'
      }
    },
    buttonsContainer: {
      display: 'flex',
      gap: '0.75rem',
      marginTop: '0.5rem'
    },
    button: {
      flex: 1,
      padding: '0.75rem',
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: '0.95rem',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      transition: 'opacity 0.2s'
    },
    submitButton: {
      backgroundColor: '#4299e1',
      color: 'white',
      ':hover': {
        opacity: 0.9
      },
      ':disabled': {
        opacity: 0.7,
        cursor: 'not-allowed'
      }
    },
    cancelButton: {
      backgroundColor: '#e2e8f0',
      color: '#4a5568',
      ':hover': {
        backgroundColor: '#cbd5e0'
      }
    },
    error: {
      color: '#e53e3e',
      textAlign: 'center',
      fontSize: '0.9rem',
      padding: '0.5rem',
      backgroundColor: '#fff5f5',
      borderRadius: '0.375rem',
      marginTop: '0.5rem'
    }
  };

  return (
    <div style={styles.container}>
      <Navbar isMobile={isMobile} />
      <div style={styles.header}>
        <h1 style={styles.title}>📝 Registrar Conductor</h1>
        <p style={styles.subtitle}>Complete todos los campos obligatorios</p>
      </div>
      
      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Nombre completo *</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            style={styles.input}
            placeholder="Ej: Juan Pérez"
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Documento de identidad *</label>
          <input
            type="text"
            name="documento"
            value={formData.documento}
            onChange={handleChange}
            style={styles.input}
            placeholder="Ej: 1234567890"
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Teléfono</label>
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            style={styles.input}
            placeholder="Ej: 3001234567"
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Número de licencia *</label>
          <input
            type="text"
            name="numeroLicencia"
            value={formData.numeroLicencia}
            onChange={handleChange}
            style={styles.input}
            placeholder="Ej: ABC123456"
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Categoría de licencia</label>
          <input
            type="text"
            name="categoriaLicencia"
            value={formData.categoriaLicencia}
            onChange={handleChange}
            style={styles.input}
            placeholder="Ej: B1, C1, etc."
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Fecha de vencimiento</label>
          <input
            type="date"
            name="licenciaVigencia"
            value={formData.licenciaVigencia}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.buttonsContainer}>
          <button 
            type="button"
            onClick={handleCancel}
            style={{ ...styles.button, ...styles.cancelButton }}
          >
            ❌ Cancelar
          </button>
          <button 
            type="submit" 
            style={{ ...styles.button, ...styles.submitButton }}
            disabled={isSubmitting}
          >
            {isSubmitting ? '⏳ Guardando...' : '✅ Registrar'}
          </button>
        </div>

        {error && <div style={styles.error}>⚠️ {error}</div>}
      </form>
    </div>
  );
};

export default withAuth(RegistrarConductor);