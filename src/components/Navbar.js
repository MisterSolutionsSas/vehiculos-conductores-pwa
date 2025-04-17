// src/components/Navbar.js

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Navbar = () => {
  const [autenticado, setAutenticado] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setAutenticado(!!token);
  }, [router.pathname]); // Esto asegura que se actualice al cambiar de ruta

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <nav style={styles.nav}>
      {autenticado && (
        <>
          <Link href="/" legacyBehavior><a style={styles.link}>Inicio</a></Link>
          <Link href="/vehiculos" legacyBehavior><a style={styles.link}>Vehículos</a></Link>
          <Link href="/conductores" legacyBehavior><a style={styles.link}>Conductores</a></Link>
        </>
      )}
      {!autenticado && router.pathname !== '/login' && (
        <Link href="/login" legacyBehavior><a style={styles.link}>Iniciar Sesión</a></Link>
      )}
      {autenticado && (
        <button onClick={cerrarSesion} style={styles.linkBtn}>Cerrar Sesión</button>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    padding: '1rem',
    backgroundColor: '#333',
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    flexWrap: 'wrap', // Permite que los elementos se ajusten mejor en pantallas pequeñas
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1rem',
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  // Media query para dispositivos pequeños
  '@media (max-width: 768px)': {
    nav: {
      gap: '1rem', // Reducir el espacio entre los enlaces en pantallas más pequeñas
      padding: '0.8rem', // Reducir el padding
    },
    link: {
      fontSize: '0.9rem', // Reducir el tamaño de fuente para los enlaces
    },
    linkBtn: {
      fontSize: '0.9rem', // Reducir el tamaño de fuente para el botón de cerrar sesión
    },
  },
};

export default Navbar;
