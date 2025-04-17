import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../../components/Navbar';

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
    tecnoMecanicaVigencia: ''
  });

  const [rol, setRol] = useState('usuario'); // Por defecto, no admin
  const esSoloLectura = rol !== 'admin';

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

    const vehiculosGuardados = JSON.parse(localStorage.getItem('vehiculos')) || [];
    const encontrado = vehiculosGuardados.find((v) => v.placa === placa);
    if (encontrado) {
      setVehiculo(encontrado);
      setFormData(encontrado);
    }
  }, [placa]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const vehiculosGuardados = JSON.parse(localStorage.getItem('vehiculos')) || [];

    if (formData.placa !== placa) {
      const yaExiste = vehiculosGuardados.find(v => v.placa === formData.placa);
      if (yaExiste) {
        alert('Ya existe un vehículo con esa placa.');
        return;
      }
    }

    const nuevosVehiculos = vehiculosGuardados.map((v) =>
      v.placa === placa ? formData : v
    );

    localStorage.setItem('vehiculos', JSON.stringify(nuevosVehiculos));
    router.push('/vehiculos');
  };

  const handleCancel = () => {
    router.push('/vehiculos');
  };

  if (!vehiculo) return <p style={styles.loading}>Cargando datos del vehículo...</p>;

  return (
    <div style={styles.container}>
      <Navbar />
      <h1 style={styles.title}>Editar Vehículo</h1>
      <h3 style={styles.subtitle}>Placa Original: <span style={styles.placa}>{vehiculo.placa}</span></h3>

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Conductor:</label>
        <input
          type="text"
          name="conductor"
          value={formData.conductor}
          onChange={handleChange}
          style={styles.input}
          required
          disabled={esSoloLectura}
        />

        <label style={styles.label}>Placa:</label>
        <input
          type="text"
          name="placa"
          value={formData.placa}
          onChange={handleChange}
          style={styles.input}
          required
          disabled={esSoloLectura}
        />

        <label style={styles.label}>Marca:</label>
        <input
          type="text"
          name="marca"
          value={formData.marca}
          onChange={handleChange}
          style={styles.input}
          required
          disabled={esSoloLectura}
        />

        <label style={styles.label}>Modelo:</label>
        <input
          type="text"
          name="modelo"
          value={formData.modelo}
          onChange={handleChange}
          style={styles.input}
          required
          disabled={esSoloLectura}
        />

        <label style={styles.label}>Año:</label>
        <input
          type="number"
          name="año"
          value={formData.año}
          onChange={handleChange}
          style={styles.input}
          required
          disabled={esSoloLectura}
        />

        <label style={styles.label}>SOAT Vigencia:</label>
        <input
          type="date"
          name="soatVigencia"
          value={formData.soatVigencia}
          onChange={handleChange}
          style={styles.input}
          required
          disabled={esSoloLectura}
        />

        <label style={styles.label}>Tecno-Mecánica Vigencia:</label>
        <input
          type="date"
          name="tecnoMecanicaVigencia"
          value={formData.tecnoMecanicaVigencia}
          onChange={handleChange}
          style={styles.input}
          required
          disabled={esSoloLectura}
        />

        <div style={styles.buttonGroup}>
          {rol === 'admin' && (
            <button type="submit" style={{ ...styles.button, backgroundColor: '#28a745' }}>Guardar Cambios</button>
          )}
          <button type="button" onClick={handleCancel} style={{ ...styles.button, backgroundColor: '#dc3545' }}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    backgroundColor: '#f4f4f4',
    minHeight: '100vh',
  },
  title: {
    textAlign: 'center',
    fontSize: '2rem',
    marginBottom: '0.5rem',
    color: '#333',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: '1.2rem',
    marginBottom: '2rem',
    color: '#555',
  },
  placa: {
    fontWeight: 'bold',
    color: '#222',
  },
  form: {
    maxWidth: '500px',
    margin: '0 auto',
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '0.8rem',
    marginBottom: '1.5rem',
    border: '1px solid #ccc',
    borderRadius: '0.5rem',
    fontSize: '1rem',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: '0.8rem',
    color: '#fff',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  loading: {
    textAlign: 'center',
    padding: '2rem',
    fontSize: '1.2rem',
  },
};

export default EditarVehiculo;