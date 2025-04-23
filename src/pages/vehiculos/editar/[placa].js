import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../../components/Navbar';
import withAuth from '../../../utils/withAuth';
import { supabase } from '../../../supabaseClient';

const EditarVehiculo = () => {
  const router = useRouter();
  const { placa } = router.query;
  const [vehiculo, setVehiculo] = useState(null);
  const [formData, setFormData] = useState({
    conductor: '',
    placa: '',
    marca: '',
    modelo: '',
    año: '',
    soatvigencia: '',
    tecnomecanicavigencia: '',
    ultimocambioaceite: '',
  });
  const [rol, setRol] = useState('usuario');
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const esSoloLectura = rol !== 'admin';

  // Detectar si es móvil
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cargar datos del vehículo y rol
  useEffect(() => {
    // Obtener rol desde el token
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(token);
        setRol(payload.rol || 'usuario');
      } catch (err) {
        console.error('Error al leer el token:', err);
      }
    }

    // Cargar vehículo desde Supabase
    const fetchVehiculo = async () => {
      if (!placa) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('vehiculos')
          .select('*')
          .eq('placa', placa)
          .single();

        if (error) throw error;

        if (data) {
          setVehiculo(data);
          setFormData({
            conductor: data.conductor || '',
            placa: data.placa || '',
            marca: data.marca || '',
            modelo: data.modelo || '',
            año: data.año || '',
            soatvigencia: data.soatvigencia ? data.soatvigencia.split('T')[0] : '',
            tecnomecanicavigencia: data.tecnomecanicavigencia ? data.tecnomecanicavigencia.split('T')[0] : '',
            ultimocambioaceite: data.ultimocambioaceite ? data.ultimocambioaceite.split('T')[0] : '',
          });
        }
      } catch (error) {
        console.error('Error al cargar vehículo:', error);
        alert('No se pudo cargar el vehículo.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehiculo();
  }, [placa]);

  // Manejar cambios en el formulario
  const handleChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  // Manejar envío del formulario
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (esSoloLectura) return;

      // Validar campos obligatorios
      if (
        !formData.conductor ||
        !formData.placa ||
        !formData.marca ||
        !formData.modelo ||
        !formData.año ||
        !formData.soatvigencia ||
        !formData.tecnomecanicavigencia
      ) {
        alert('Por favor, complete todos los campos obligatorios.');
        return;
      }

      // Validar formato del año
      const añoNum = parseInt(formData.año, 10);
      if (isNaN(añoNum) || añoNum < 1900 || añoNum > new Date().getFullYear() + 1) {
        alert('Por favor, ingrese un año válido.');
        return;
      }

      try {
        // Verificar si la nueva placa ya existe (si cambió)
        if (formData.placa !== placa) {
          const { data: placaExistente, error: checkError } = await supabase
            .from('vehiculos')
            .select('placa')
            .eq('placa', formData.placa)
            .single();

          if (checkError && checkError.code !== 'PGRST116') {
            throw checkError;
          }

          if (placaExistente) {
            alert('Ya existe un vehículo con esa placa.');
            return;
          }
        }

        // Preparar datos para actualizar
        const datosActualizados = {
          conductor: formData.conductor,
          placa: formData.placa,
          marca: formData.marca,
          modelo: formData.modelo,
          año: añoNum,
          soatvigencia: new Date(formData.soatvigencia).toISOString(),
          tecnomecanicavigencia: new Date(formData.tecnomecanicavigencia).toISOString(),
          ultimocambioaceite: formData.ultimocambioaceite
            ? new Date(formData.ultimocambioaceite).toISOString()
            : null,
        };

        // Actualizar vehículo en Supabase
        const { error: updateError } = await supabase
          .from('vehiculos')
          .update(datosActualizados)
          .eq('placa', placa);

        if (updateError) {
          throw updateError;
        }

        router.push('/vehiculos');
      } catch (error) {
        console.error('Error al actualizar vehículo:', error);
        alert('No se pudo guardar el vehículo.');
      }
    },
    [formData, placa, esSoloLectura, router]
  );

  // Cancelar y regresar
  const handleCancel = useCallback(() => {
    router.push('/vehiculos');
  }, [router]);

  // Estilos responsivos
  const styles = {
    container: {
      padding: isMobile ? '2rem 1rem' : '2rem 5%',
      backgroundColor: '#f7fafc',
      minHeight: '100vh',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      width: '100%',
      maxWidth: '1600px',
      margin: '0 auto',
      boxSizing: 'border-box',
    },
    title: {
      textAlign: 'center',
      marginBottom: '2rem',
      color: '#2d3748',
      fontSize: isMobile ? '1.75rem' : '2.25rem',
      fontWeight: '700',
    },
    subtitle: {
      textAlign: 'center',
      fontSize: isMobile ? '1rem' : '1.25rem',
      marginBottom: '1.5rem',
      color: '#4a5568',
    },
    placa: {
      fontWeight: '600',
      color: '#2b6cb0',
    },
    formContainer: {
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      padding: '2.5rem',
      borderRadius: '8px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
    },
    formGroup: {
      marginBottom: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    label: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#2d3748',
      textTransform: 'uppercase',
    },
    input: {
      width: '100%',
      padding: '0.875rem',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '1rem',
      backgroundColor: '#f7fafc',
      boxSizing: 'border-box',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      outline: 'none',
      ':focus': {
        borderColor: '#3182ce',
        boxShadow: '0 0 0 3px rgba(49, 130, 206, 0.2)',
      },
      ':disabled': {
        backgroundColor: '#edf2f7',
        cursor: 'not-allowed',
        opacity: 0.7,
      },
    },
    buttonGroup: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'flex-end',
      marginTop: '1.5rem',
    },
    button: {
      padding: '0.875rem 1.5rem',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease, transform 0.1s ease',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      ':hover': {
        transform: 'translateY(-1px)',
      },
      ':active': {
        transform: 'translateY(0)',
      },
      ':disabled': {
        cursor: 'not-allowed',
        opacity: 0.6,
      },
    },
    buttonPrimary: {
      backgroundColor: '#2b6cb0',
      color: '#ffffff',
      ':hover': {
        backgroundColor: '#2c5282',
      },
    },
    buttonSecondary: {
      backgroundColor: '#edf2f7',
      color: '#2d3748',
      ':hover': {
        backgroundColor: '#e2e8f0',
      },
    },
    loading: {
      textAlign: 'center',
      padding: '2rem',
      fontSize: isMobile ? '1rem' : '1.25rem',
      color: '#4a5568',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
    },
    spinner: {
      border: '4px solid #e2e8f0',
      borderTop: '4px solid #2b6cb0',
      borderRadius: '50%',
      width: '2rem',
      height: '2rem',
      animation: 'spin 1s linear infinite',
    },
    '@keyframes spin': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },
  };

  if (isLoading || !vehiculo) {
    return (
      <div style={styles.container}>
        <Navbar isMobile={isMobile} />
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <span>Cargando datos del vehículo...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Navbar isMobile={isMobile} />
      <h1 style={styles.title}>Editar Vehículo</h1>
      <h3 style={styles.subtitle}>
        Placa Original: <span style={styles.placa}>{vehiculo.placa}</span>
      </h3>

      <div style={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="conductor" style={styles.label}>
              Conductor
            </label>
            <input
              id="conductor"
              type="text"
              name="conductor"
              value={formData.conductor}
              onChange={handleChange}
              style={styles.input}
              placeholder="Ingrese el nombre del conductor"
              required
              disabled={esSoloLectura}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="placa" style={styles.label}>
              Placa
            </label>
            <input
              id="placa"
              type="text"
              name="placa"
              value={formData.placa}
              onChange={handleChange}
              style={styles.input}
              placeholder="Ej: ABC123"
              required
              disabled={esSoloLectura}
              maxLength={6}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="marca" style={styles.label}>
              Marca
            </label>
            <input
              id="marca"
              type="text"
              name="marca"
              value={formData.marca}
              onChange={handleChange}
              style={styles.input}
              placeholder="Ej: Toyota"
              required
              disabled={esSoloLectura}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="modelo" style={styles.label}>
              Modelo
            </label>
            <input
              id="modelo"
              type="text"
              name="modelo"
              value={formData.modelo}
              onChange={handleChange}
              style={styles.input}
              placeholder="Ej: Corolla"
              required
              disabled={esSoloLectura}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="año" style={styles.label}>
              Año
            </label>
            <input
              id="año"
              type="number"
              name="año"
              value={formData.año}
              onChange={handleChange}
              style={styles.input}
              placeholder="Ej: 2020"
              required
              disabled={esSoloLectura}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="soatvigencia" style={styles.label}>
              SOAT Vigencia
            </label>
            <input
              id="soatvigencia"
              type="date"
              name="soatvigencia"
              value={formData.soatvigencia}
              onChange={handleChange}
              style={styles.input}
              required
              disabled={esSoloLectura}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="tecnomecanicavigencia" style={styles.label}>
              Tecno-Mecánica Vigencia
            </label>
            <input
              id="tecnomecanicavigencia"
              type="date"
              name="tecnomecanicavigencia"
              value={formData.tecnomecanicavigencia}
              onChange={handleChange}
              style={styles.input}
              required
              disabled={esSoloLectura}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="ultimocambioaceite" style={styles.label}>
              Último Cambio de Aceite
            </label>
            <input
              id="ultimocambioaceite"
              type="date"
              name="ultimocambioaceite"
              value={formData.ultimocambioaceite}
              onChange={handleChange}
              style={styles.input}
              placeholder="Seleccione la fecha"
              disabled={esSoloLectura}
            />
          </div>

          <div style={styles.buttonGroup}>
            {rol === 'admin' && (
              <button
                type="submit"
                style={{ ...styles.button, ...styles.buttonPrimary }}
                disabled={esSoloLectura}
              >
                Guardar Cambios
              </button>
            )}
            <button
              type="button"
              onClick={handleCancel}
              style={{ ...styles.button, ...styles.buttonSecondary }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withAuth(EditarVehiculo);