import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../supabaseClient';

export default function RegistrarVehiculo() {
  const [vehiculo, setVehiculo] = useState({
    conductor: '',
    placa: '',
    marca: '',
    modelo: '',
    año: '',
    soatvigencia: '', // Cambiado a minúsculas para coincidir con Supabase
    tecnomecanicavigencia: '', // Cambiado a minúsculas
    ultimocambioaceite: '' // Cambiado a minúsculas
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehiculo((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validar campos obligatorios
    if (
      !vehiculo.conductor ||
      !vehiculo.placa ||
      !vehiculo.marca ||
      !vehiculo.modelo ||
      !vehiculo.año ||
      !vehiculo.soatvigencia ||
      !vehiculo.tecnomecanicavigencia
    ) {
      alert('Por favor, complete todos los campos obligatorios.');
      setIsSubmitting(false);
      return;
    }

    // Validar formato del año
    const añoNum = parseInt(vehiculo.año, 10);
    if (isNaN(añoNum) || añoNum < 1900 || añoNum > new Date().getFullYear() + 1) {
      alert('Por favor, ingrese un año válido.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Verificar si la placa ya existe en Supabase
      const { data: placaExistente, error: checkError } = await supabase
        .from('vehiculos')
        .select('placa')
        .eq('placa', vehiculo.placa)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 significa que no se encontró ningún registro, lo cual está bien
        throw checkError;
      }

      if (placaExistente) {
        alert('Ya existe un vehículo registrado con esta placa.');
        setIsSubmitting(false);
        return;
      }

      // Preparar datos para Supabase
      const datosVehiculo = {
        conductor: vehiculo.conductor,
        placa: vehiculo.placa,
        marca: vehiculo.marca,
        modelo: vehiculo.modelo,
        año: añoNum,
        soatvigencia: new Date(vehiculo.soatvigencia).toISOString(),
        tecnomecanicavigencia: new Date(vehiculo.tecnomecanicavigencia).toISOString(),
        ultimocambioaceite: vehiculo.ultimocambioaceite
          ? new Date(vehiculo.ultimocambioaceite).toISOString()
          : null, // Enviar null si no se especifica
      };

      // Insertar en Supabase
      const { error: insertError } = await supabase
        .from('vehiculos')
        .insert([datosVehiculo]);

      if (insertError) {
        throw insertError;
      }

      // Redirigir a la lista de vehículos
      router.push('/vehiculos');
    } catch (error) {
      console.error('Error al registrar vehículo:', error);
      alert('No se pudo registrar el vehículo. Por favor, intenta de nuevo.');
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    const confirmar = window.confirm('¿Estás seguro de que deseas cancelar? Los datos ingresados se perderán.');
    if (confirmar) {
      router.push('/vehiculos');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={styles.header}>
          <h2 style={styles.title}>🚗 Registrar Vehículo</h2>
          <p style={styles.subtitle}>Complete los datos del vehículo</p>
        </div>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="conductor">Conductor *</label>
            <input
              id="conductor"
              name="conductor"
              placeholder="Nombre del conductor"
              value={vehiculo.conductor}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="placa">Placa *</label>
            <input
              id="placa"
              name="placa"
              placeholder="Ej: ABC123"
              value={vehiculo.placa}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formRow}>
            <div style={{...styles.formGroup, flex: 1}}>
              <label style={styles.label} htmlFor="marca">Marca *</label>
              <input
                id="marca"
                name="marca"
                placeholder="Ej: Toyota"
                value={vehiculo.marca}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            
            <div style={{...styles.formGroup, flex: 1}}>
              <label style={styles.label} htmlFor="modelo">Modelo *</label>
              <input
                id="modelo"
                name="modelo"
                placeholder="Ej: Corolla"
                value={vehiculo.modelo}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={{...styles.formGroup, flex: 1}}>
              <label style={styles.label} htmlFor="año">Año *</label>
              <input
                id="año"
                type="number"
                name="año"
                placeholder="Ej: 2020"
                min="1900"
                max={new Date().getFullYear() + 1}
                value={vehiculo.año}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="soatvigencia">Vigencia SOAT *</label>
            <input
              id="soatvigencia"
              type="date"
              name="soatvigencia"
              value={vehiculo.soatvigencia}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="tecnomecanicavigencia">Vigencia Técnico-mecánica *</label>
            <input
              id="tecnomecanicavigencia"
              type="date"
              name="tecnomecanicavigencia"
              value={vehiculo.tecnomecanicavigencia}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="ultimocambioaceite">Último cambio de aceite</label>
            <input
              id="ultimocambioaceite"
              type="date"
              name="ultimocambioaceite"
              value={vehiculo.ultimocambioaceite}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.buttonContainer}>
            <button 
              type="button"
              onClick={handleCancel}
              style={styles.cancelButton}
            >
              ❌ Cancelar
            </button>
            <button 
              type="submit" 
              style={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? '⏳ Registrando...' : '✅ Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '1rem',
    backgroundColor: '#f5f7fa',
    minHeight: '100vh',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  formContainer: {
    backgroundColor: '#ffffff',
    padding: '1.25rem',
    borderRadius: '0.75rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    maxWidth: '600px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  subtitle: {
    fontSize: '0.95rem',
    color: '#4a5568',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  formRow: {
    display: 'flex',
    gap: '0.75rem',
    width: '100%',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '0.5rem',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#4a5568',
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
      boxShadow: '0 0 0 2px rgba(66, 153, 225, 0.2)',
    },
  },
  buttonContainer: {
    display: 'flex',
    gap: '0.75rem',
    marginTop: '1rem',
  },
  submitButton: {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: '#4299e1',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '0.95rem',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    ':hover': {
      opacity: 0.9,
    },
    ':disabled': {
      opacity: 0.7,
      cursor: 'not-allowed',
    },
  },
  cancelButton: {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: '#e2e8f0',
    color: '#4a5568',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '0.95rem',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    ':hover': {
      backgroundColor: '#cbd5e0',
    },
  },
};