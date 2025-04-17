// /pages/vehiculos/registrar.js

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
    tecnoMecanicaVigencia: ''
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
      alert('Por favor, complete todos los campos.');
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
        <h2>Registrar Vehículo</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input name="conductor" placeholder="Nombre del Conductor" value={vehiculo.conductor} onChange={handleChange} style={styles.input} required />
          <input name="placa" placeholder="Placa" value={vehiculo.placa} onChange={handleChange} style={styles.input} required />
          <input name="marca" placeholder="Marca" value={vehiculo.marca} onChange={handleChange} style={styles.input} required />
          <input name="modelo" placeholder="Modelo" value={vehiculo.modelo} onChange={handleChange} style={styles.input} required />
          <input type="number" name="año" placeholder="Año" value={vehiculo.año} onChange={handleChange} style={styles.input} required />
          <label style={styles.label}>Vigencia del SOAT</label>
          <input type="date" name="soatVigencia" value={vehiculo.soatVigencia} onChange={handleChange} style={styles.input} required />
          <label style={styles.label}>Vigencia de la Técnico-mecánica</label>
          <input type="date" name="tecnoMecanicaVigencia" value={vehiculo.tecnoMecanicaVigencia} onChange={handleChange} style={styles.input} required />
          <div style={styles.buttonContainer}>
            <button type="submit" style={styles.submitButton}>Registrar</button>
            <button type="button" onClick={() => router.push('/vehiculos')} style={styles.cancelButton}>Volver</button>
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
    padding: '2rem',
    backgroundColor: '#f4f4f4',
    minHeight: '100vh',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '500px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    marginBottom: '1rem',
    padding: '0.75rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  label: {
    marginBottom: '0.5rem',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '1rem',
  },
  submitButton: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    color: '#333',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};
