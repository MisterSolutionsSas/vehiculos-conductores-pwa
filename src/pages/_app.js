import '../styles/global.css';
import Head from 'next/head';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  // Registrar el Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            console.log('Service Worker registrado:', registration);
          },
          (error) => {
            console.error('Error al registrar Service Worker:', error);
          }
        );
      });
    }
  }, []);

  return (
    <>
      <Head>
        <title>Sistema de Gestión Vehicular</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Sistema de Gestión Vehicular para optimizar la administración de flotas." />
        <meta name="theme-color" content="#2563eb" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;