import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { supabase } from '../../supabaseClient';

const RegistrarConductor = () => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    nombre: '',
    documento: '',
    telefono: '',
    numero_licencia: '',
    categoria_licencia: '',
    licencia_vigencia: '',
    notas: '', // Nuevo campo agregado
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Validación básica
      if (!formData.nombre || !formData.documento || !formData.numero_licencia) {
        throw new Error('Los campos nombre, documento y número de licencia son obligatorios');
      }

      // Validar formato de fecha (si se proporciona)
      if (formData.licencia_vigencia) {
        const fecha = new Date(formData.licencia_vigencia);
        if (isNaN(fecha.getTime())) {
          throw new Error('La fecha de vencimiento de la licencia no es válida');
        }
      }

      // Verificar duplicados en Supabase
      const { data: existingDocumento, error: documentoError } = await supabase
        .from('conductores')
        .select('documento')
        .eq('documento', formData.documento)
        .single();

      if (documentoError && documentoError.code !== 'PGRST116') {
        throw new Error('Error al verificar el documento: ' + documentoError.message);
      }
      if (existingDocumento) {
        throw new Error('El documento ya está registrado');
      }

      const { data: existingLicencia, error: licenciaError } = await supabase
        .from('conductores')
        .select('numero_licencia')
        .eq('numero_licencia', formData.numero_licencia)
        .single();

      if (licenciaError && licenciaError.code !== 'PGRST116') {
        throw new Error('Error al verificar el número de licencia: ' + licenciaError.message);
      }
      if (existingLicencia) {
        throw new Error('El número de licencia ya está registrado');
      }

      // Preparar datos para insertar
      const nuevoConductor = {
        nombre: formData.nombre.trim(),
        documento: formData.documento.trim(),
        telefono: formData.telefono ? formData.telefono.trim() : null,
        numero_licencia: formData.numero_licencia.trim(),
        categoria_licencia: formData.categoria_licencia ? formData.categoria_licencia.trim() : null,
        licencia_vigencia: formData.licencia_vigencia ? new Date(formData.licencia_vigencia).toISOString() : null,
        notas: formData.notas ? formData.notas.trim() : null, // Nuevo campo agregado
      };

      // Insertar en Supabase
      const { error: insertError } = await supabase
        .from('conductores')
        .insert([nuevoConductor]);

      if (insertError) {
        throw new Error('Error al registrar el conductor: ' + insertError.message);
      }

      // Redirigir después de guardar
      alert('Conductor registrado exitosamente');
      router.push('/conductores');
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Ocurrió un error al registrar');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    const confirmar = window.confirm(
      '¿Estás seguro de que deseas cancelar? Los datos ingresados se perderán.'
    );
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
      margin: '0 auto',
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
      gap: '1.25rem',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    label: {
      fontSize: '0.95rem',
      color: '#4a5568',
      fontWeight: '500',
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
    },
    textarea: {  // Nuevo estilo para el textarea
      padding: '0.75rem',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      fontSize: '0.95rem',
      color: '#2d3748',
      backgroundColor: '#f8fafc',
      outline: 'none',
      width: '100%',
      minHeight: '100px',
      resize: 'vertical',
    },
    buttonsContainer: {
      display: 'flex',
      gap: '0.75rem',
      marginTop: '0.5rem',
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
      transition: 'opacity 0.2s',
    },
    submitButton: {
      backgroundColor: '#4299e1',
      color: 'white',
      opacity: isSubmitting ? 0.7 : 1,
      cursor: isSubmitting ? 'not-allowed' : 'pointer',
    },
    cancelButton: {
      backgroundColor: '#e2e8f0',
      color: '#4a5568',
    },
    error: {
      color: '#e53e3e',
      textAlign: 'center',
      fontSize: '0.9rem',
      padding: '0.5rem',
      backgroundColor: '#fff5f5',
      borderRadius: '0.375rem',
      marginTop: '0.5rem',
    },
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
            name="numero_licencia"
            value={formData.numero_licencia}
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
            name="categoria_licencia"
            value={formData.categoria_licencia}
            onChange={handleChange}
            style={styles.input}
            placeholder="Ej: B1, C1, etc."
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Fecha de vencimiento</label>
          <input
            type="date"
            name="licencia_vigencia"
            value={formData.licencia_vigencia}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Notas del conductor</label>
          <textarea
            name="notas"
            value={formData.notas}
            onChange={handleChange}
            style={styles.textarea}
            placeholder="Ej: Información adicional sobre el conductor"
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

export default RegistrarConductor;