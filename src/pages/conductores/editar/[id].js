import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import withAuth from '../../../utils/withAuth';

const EditarConductor = () => {
  const router = useRouter();
  const { id } = router.query;
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
  const [rol, setRol] = useState('usuario'); // Definir el rol por defecto

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(token); // NO es un JWT, es un objeto plano
        setRol(payload.rol || 'usuario');
      } catch (err) {
        console.error('Error al leer el token:', err);
      }
    }

    if (id) {
      try {
        const conductores = JSON.parse(localStorage.getItem('conductores')) || [];
        const conductor = conductores.find(c => c.id === parseInt(id));
        if (conductor) {
          setFormData({
            nombre: conductor.nombre || '',
            documento: conductor.documento || '',
            telefono: conductor.telefono || '',
            numeroLicencia: conductor.numeroLicencia || '',
            categoriaLicencia: conductor.categoriaLicencia || '',
            licenciaVigencia: conductor.licenciaVigencia || ''
          });
        }
      } catch (error) {
        console.error('Error al cargar conductor:', error);
        setError('No se pudo cargar el conductor');
      }
    }
  }, [id]);

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
      if (!formData.nombre || !formData.documento || !formData.numeroLicencia) {
        throw new Error('Los campos nombre, documento y número de licencia son obligatorios');
      }

      const conductores = JSON.parse(localStorage.getItem('conductores')) || [];

      const documentoExiste = conductores.some(
        c => c.documento === formData.documento && c.id !== parseInt(id)
      );
      const licenciaExiste = conductores.some(
        c => c.numeroLicencia === formData.numeroLicencia && c.id !== parseInt(id)
      );
      
      if (documentoExiste) {
        throw new Error('Ya existe un conductor con ese documento');
      }
      if (licenciaExiste) {
        throw new Error('Ya existe un conductor con ese número de licencia');
      }

      const updatedConductores = conductores.map(c =>
        c.id === parseInt(id)
          ? { ...formData, id: parseInt(id), createdAt: c.createdAt }
          : c
      );
      
      localStorage.setItem('conductores', JSON.stringify(updatedConductores));
      
      router.push('/conductores');
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Ocurrió un error al actualizar');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/conductores');
  };

  const esSoloLectura = rol !== 'admin'; // Deshabilitar campos si no es admin

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
      outline: 'none'
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
      transition: 'background-color 0.2s'
    },
    cancelButton: {
      padding: '1rem',
      backgroundColor: '#6b7280',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
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
      <h1 style={styles.title}>Editar Conductor</h1>
      
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
            disabled={esSoloLectura}
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
            disabled={esSoloLectura}
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
            disabled={esSoloLectura}
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
            disabled={esSoloLectura}
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
            disabled={esSoloLectura}
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
            disabled={esSoloLectura}
          />
        </div>

        <button 
          type="submit" 
          style={{ ...styles.button, opacity: isSubmitting ? 0.7 : 1 }}
          disabled={isSubmitting || esSoloLectura}
        >
          {isSubmitting ? 'Actualizando...' : 'Actualizar Conductor'}
        </button>

        <button 
          type="button" 
          onClick={handleCancel}
          style={styles.cancelButton}
        >
          Cancelar
        </button>

        {error && <p style={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

export default withAuth(EditarConductor);
