import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, contraseña }),
      });

      const data = await res.json();

      if (data.success) {
        // Guardar token y rol en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('rol', data.rol); // Guardar el rol aquí

        router.push('/'); // Redirigir al inicio
      } else {
        setError('Credenciales incorrectas. Si crees que es un error, contacta con soporte.');
      }
    } catch (err) {
      setError('Error al intentar iniciar sesión');
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Logo arriba */}
        <div style={styles.logoContainer}>
          <img src="/logo.png" alt="Logo" style={styles.logo} />
        </div>

        <h2 style={styles.title}>Iniciar Sesión</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <div style={styles.passwordContainer}>
            <input
              type={mostrarContraseña ? 'text' : 'password'}
              placeholder="Contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              style={styles.input}
              required
            />
            <button
              type="button"
              onClick={() => setMostrarContraseña(!mostrarContraseña)}
              style={styles.toggleButton}
            >
              {mostrarContraseña ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>

          <button type="submit" style={styles.button}>Entrar</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f4f4',
  },
  card: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '1rem',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  logoContainer: {
    marginBottom: '1rem',
  },
  logo: {
    width: '300px',
    height: 'auto',
  },
  title: {
    marginBottom: '1rem',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '0.8rem',
    marginBottom: '1rem',
    borderRadius: '0.5rem',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  passwordContainer: {
    position: 'relative',
  },
  toggleButton: {
    position: 'absolute',
    right: '1rem',
    top: '25%',
    background: 'none',
    border: 'none',
    color: '#333',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  button: {
    width: '100%',
    padding: '0.8rem',
    border: 'none',
    backgroundColor: '#333',
    color: 'white',
    fontWeight: 'bold',
    borderRadius: '0.5rem',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginBottom: '1rem',
  }
};