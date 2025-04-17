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
    form: {
      backgroundColor: '#ffffff',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 6px 20px rgba(0,0,0,0.05)',
      display: 'grid',
      gap: '1.5rem'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    label: {
      fontSize: '1rem',
      color: '#4b5563',
      fontWeight: '600'
    },
    input: {
      padding: '0.9rem 1rem',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '1rem',
      color: '#374151',
      backgroundColor: '#f9fafb',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      outline: 'none',
      ':focus': {
        borderColor: '#3b82f6',
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.2)'
      }
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
      },
      ':disabled': {
        opacity: 0.7,
        cursor: 'not-allowed'
      }
    },
    error: {
      color: '#dc2626',
      textAlign: 'center',
      fontSize: '0.95rem',
      marginTop: '0.5rem'
    }
  };

  return (
    <div style={styles.container}>
      <Navbar isMobile={isMobile} />
      <h1 style={styles.title}>Registrar Nuevo Conductor</h1>
      
      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Nombre completo</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Documento de identidad</label>
          <input
            type="text"
            name="documento"
            value={formData.documento}
            onChange={handleChange}
            style={styles.input}
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
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Número de licencia</label>
          <input
            type="text"
            name="numeroLicencia"
            value={formData.numeroLicencia}
            onChange={handleChange}
            style={styles.input}
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
            required
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
            required
          />
        </div>

        <button 
          type="submit" 
          style={styles.button}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registrando...' : 'Registrar Conductor'}
        </button>

        {error && <p style={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

export default withAuth(RegistrarConductor);