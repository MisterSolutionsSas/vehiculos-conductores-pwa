import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../../components/Navbar';
import withAuth from '../../../utils/withAuth';

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
    soatVigencia: '',
    tecnoMecanicaVigencia: '',
    ultimoCambioAceite: '',
  });
  const [rol, setRol] = useState('usuario');
  const [isMobile, setIsMobile] = useState(false);
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
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(token);
        setRol(payload.rol || 'usuario');
      } catch (err) {
        console.error('Error al leer el token:', err);
      }
    }

    const vehiculosGuardados = JSON.parse(localStorage.getItem('vehiculos')) || [];
    const encontrado = vehiculosGuardados.find((v) => v.placa === placa);
    if (encontrado) {
      setVehiculo(encontrado);
      setFormData({
        conductor: encontrado.conductor || '',
        placa: encontrado.placa || '',
        marca: encontrado.marca || '',
        modelo: encontrado.modelo || '',
        año: encontrado.año || '',
        soatVigencia: encontrado.soatVigencia || '',
        tecnoMecanicaVigencia: encontrado.tecnoMecanicaVigencia || '',
        ultimoCambioAceite: encontrado.ultimoCambioAceite || '',
      });
    }
  }, [placa]);

  // Manejar cambios en el formulario
  const handleChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  // Manejar envío del formulario
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (esSoloLectura) return;

      const vehiculosGuardados = JSON.parse(localStorage.getItem('vehiculos')) || [];

      // Validar placa duplicada
      if (formData.placa !== placa) {
        const yaExiste = vehiculosGuardados.find((v) => v.placa === formData.placa);
        if (yaExiste) {
          alert('Ya existe un vehículo con esa placa.');
          return;
        }
      }

      // Actualizar vehículo
      const nuevosVehiculos = vehiculosGuardados.map((v) =>
        v.placa === placa ? formData : v
      );

      try {
        localStorage.setItem('vehiculos', JSON.stringify(nuevosVehiculos));
        router.push('/vehiculos');
      } catch (err) {
        console.error('Error al guardar vehículo:', err);
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

  if (!vehiculo) {
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
            <label htmlFor="soatVigencia" style={styles.label}>
              SOAT Vigencia
            </label>
            <input
              id="soatVigencia"
              type="date"
              name="soatVigencia"
              value={formData.soatVigencia}
              onChange={handleChange}
              style={styles.input}
              required
              disabled={esSoloLectura}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="tecnoMecanicaVigencia" style={styles.label}>
              Tecno-Mecánica Vigencia
            </label>
            <input
              id="tecnoMecanicaVigencia"
              type="date"
              name="tecnoMecanicaVigencia"
              value={formData.tecnoMecanicaVigencia}
              onChange={handleChange}
              style={styles.input}
              required
              disabled={esSoloLectura}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="ultimoCambioAceite" style={styles.label}>
              Último Cambio de Aceite
            </label>
            <input
              id="ultimoCambioAceite"
              type="date"
              name="ultimoCambioAceite"
              value={formData.ultimoCambioAceite}
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