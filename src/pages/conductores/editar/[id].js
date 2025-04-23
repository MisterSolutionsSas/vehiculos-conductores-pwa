import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import { supabase } from '../../../supabaseClient'; // Ajusta la ruta según la ubicación de supabaseClient.js

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
    numero_licencia: '',
    categoria_licencia: '',
    licencia_vigencia: '',
  });

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
      const fetchConductor = async () => {
        try {
          const { data, error } = await supabase
            .from('conductores')
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;

          if (data) {
            setFormData({
              nombre: data.nombre || '',
              documento: data.documento || '',
              telefono: data.telefono || '',
              numero_licencia: data.numero_licencia || '',
              categoria_licencia: data.categoria_licencia || '',
              licencia_vigencia: data.licencia_vigencia
                ? new Date(data.licencia_vigencia).toISOString().split('T')[0]
                : '',
            });
          } else {
            setError('No se encontró el conductor');
          }
        } catch (error) {
          console.error('Error al cargar conductor:', error);
          setError('No se pudo cargar el conductor: ' + error.message);
        }
      };

      fetchConductor();
    }
  }, [id]);

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

      // Verificar duplicados en Supabase (excluyendo el conductor actual)
      const { data: existingDocumento, error: documentoError } = await supabase
        .from('conductores')
        .select('documento')
        .eq('documento', formData.documento)
        .neq('id', id)
        .single();

      if (documentoError && documentoError.code !== 'PGRST116') {
        throw new Error('Error al verificar el documento: ' + documentoError.message);
      }
      if (existingDocumento) {
        throw new Error('Ya existe un conductor con ese documento');
      }

      const { data: existingLicencia, error: licenciaError } = await supabase
        .from('conductores')
        .select('numero_licencia')
        .eq('numero_licencia', formData.numero_licencia)
        .neq('id', id)
        .single();

      if (licenciaError && licenciaError.code !== 'PGRST116') {
        throw new Error('Error al verificar el número de licencia: ' + licenciaError.message);
      }
      if (existingLicencia) {
        throw new Error('Ya existe un conductor con ese número de licencia');
      }

      // Preparar datos para actualizar
      const updatedConductor = {
        nombre: formData.nombre.trim(),
        documento: formData.documento.trim(),
        telefono: formData.telefono ? formData.telefono.trim() : null,
        numero_licencia: formData.numero_licencia.trim(),
        categoria_licencia: formData.categoria_licencia ? formData.categoria_licencia.trim() : null,
        licencia_vigencia: formData.licencia_vigencia
          ? new Date(formData.licencia_vigencia).toISOString()
          : null,
      };

      // Actualizar en Supabase
      const { error: updateError } = await supabase
        .from('conductores')
        .update(updatedConductor)
        .eq('id', id);

      if (updateError) {
        throw new Error('Error al actualizar el conductor: ' + updateError.message);
      }

      // Redirigir después de actualizar
      alert('Conductor actualizado exitosamente');
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

  const styles = {
    container: {
      padding: isMobile ? '1rem' : '2rem',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      fontFamily: "'Inter', sans-serif",
      maxWidth: '800px',
      margin: '0 auto',
    },
    title: {
      textAlign: 'center',
      marginBottom: '2rem',
      color: '#1f2937',
      fontSize: isMobile ? '1.8rem' : '2.2rem',
      fontWeight: '700',
    },
    form: {
      backgroundColor: '#ffffff',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 6px 20px rgba(0,0,0,0.05)',
      display: 'grid',
      gap: '1.5rem',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    label: {
      fontSize: '1rem',
      color: '#4b5563',
      fontWeight: '600',
    },
    input: {
      padding: '0.9rem 1rem',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '1rem',
      color: '#374151',
      backgroundColor: '#f9fafb',
      outline: 'none',
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
    },
    error: {
      color: '#dc2626',
      textAlign: 'center',
      fontSize: '0.95rem',
      marginTop: '0.5rem',
    },
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
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Número de licencia</label>
          <input
            type="text"
            name="numero_licencia"
            value={formData.numero_licencia}
            onChange={handleChange}
            style={styles.input}
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

        <button
          type="submit"
          style={{ ...styles.button, opacity: isSubmitting ? 0.7 : 1 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Actualizando...' : 'Actualizar Conductor'}
        </button>

        <button type="button" onClick={handleCancel} style={styles.cancelButton}>
          Cancelar
        </button>

        {error && <p style={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

export default EditarConductor;