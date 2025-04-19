import { useState } from 'react';
import { useRouter } from 'next/router';

export default function RegistrarVehiculo() {
  const [vehiculo, setVehiculo] = useState({
    conductor: '',
    placa: '',
    marca: '',
    modelo: '',
    año: '',
    soatVigencia: '',
    tecnoMecanicaVigencia: '',
    ultimoCambioAceite: ''
  });

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehiculo((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !vehiculo.conductor ||
      !vehiculo.placa ||
      !vehiculo.marca ||
      !vehiculo.modelo ||
      !vehiculo.año ||
      !vehiculo.soatVigencia ||
      !vehiculo.tecnoMecanicaVigencia
    ) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    const vehiculos = JSON.parse(localStorage.getItem('vehiculos')) || [];

    const placaExistente = vehiculos.find(v => v.placa === vehiculo.placa);
    if (placaExistente) {
      alert('Ya existe un vehículo registrado con esta placa.');
      return;
    }

    vehiculos.push(vehiculo);
    localStorage.setItem('vehiculos', JSON.stringify(vehiculos));

    router.push('/vehiculos');
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Registrar Vehículo</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="conductor">Nombre del Conductor</label>
            <input
              id="conductor"
              name="conductor"
              placeholder="Ingrese el nombre del conductor"
              value={vehiculo.conductor}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="placa">Placa</label>
            <input
              id="placa"
              name="placa"
              placeholder="Ingrese la placa"
              value={vehiculo.placa}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="marca">Marca</label>
            <input
              id="marca"
              name="marca"
              placeholder="Ingrese la marca"
              value={vehiculo.marca}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="modelo">Modelo</label>
            <input
              id="modelo"
              name="modelo"
              placeholder="Ingrese el modelo"
              value={vehiculo.modelo}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="año">Año</label>
            <input
              id="año"
              type="number"
              name="año"
              placeholder="Ingrese el año"
              value={vehiculo.año}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="soatVigencia">Vigencia del SOAT</label>
            <input
              id="soatVigencia"
              type="date"
              name="soatVigencia"
              value={vehiculo.soatVigencia}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="tecnoMecanicaVigencia">Vigencia de la Técnico-mecánica</label>
            <input
              id="tecnoMecanicaVigencia"
              type="date"
              name="tecnoMecanicaVigencia"
              value={vehiculo.tecnoMecanicaVigencia}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="ultimoCambioAceite">Fecha del Último Cambio de Aceite</label>
            <input
              id="ultimoCambioAceite"
              type="date"
              name="ultimoCambioAceite"
              value={vehiculo.ultimoCambioAceite}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.buttonContainer}>
            <button type="submit" style={styles.submitButton}>Registrar</button>
            <button
              type="button"
              onClick={() => router.push('/vehiculos')}
              style={styles.cancelButton}
            >
              Volver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem 1rem',
    backgroundColor: '#f7fafc',
    minHeight: '100vh',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  formContainer: {
    backgroundColor: '#ffffff',
    padding: '2.5rem',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#2d3748',
    textAlign: 'left',
  },
  input: {
    padding: '0.875rem 1rem',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f7fafc',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    ':focus': {
      borderColor: '#3182ce',
      boxShadow: '0 0 0 3px rgba(49, 130, 206, 0.2)',
    },
  },
  buttonContainer: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
    marginTop: '1.5rem',
  },
  submitButton: {
    backgroundColor: '#2b6cb0',
    color: '#ffffff',
    padding: '0.875rem 1.5rem',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, transform 0.1s ease',
    ':hover': {
      backgroundColor: '#2c5282',
      transform: 'translateY(-1px)',
    },
    ':active': {
      transform: 'translateY(0)',
    },
  },
  cancelButton: {
    backgroundColor: '#edf2f7',
    color: '#4a5568',
    padding: '0.875rem 1.5rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, transform 0.1s ease',
    ':hover': {
      backgroundColor: '#e2e8f0',
      transform: 'translateY(-1px)',
    },
    ':active': {
      transform: 'translateY(0)',
    },
  },
};