import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import withAuth from '../utils/withAuth';
import Link from 'next/link';
import Image from 'next/image';

function Home() {
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es móvil de forma dinámica
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };
    handleResize(); // Ejecutar al montar
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={styles.container}>
      <Navbar />
      <header style={{ ...styles.header, ...(isMobile ? styles.headerMobile : {}) }}>
        <div style={{ ...styles.headerContent, ...(isMobile ? styles.headerContentMobile : {}) }}>
          <div style={{ ...styles.logoContainer, ...(isMobile ? styles.logoContainerMobile : {}) }}>
            <Image
              src="/logo-placeholder.png"
              alt="Logo Sistema de Gestión Vehicular"
              width={isMobile ? 120 : 120}
              height={isMobile ? 120 : 120}
              style={styles.logo}
              priority
            />
          </div>
          <div style={{ ...styles.headerText, ...(isMobile ? styles.headerTextMobile : {}) }}>
            <h1 style={{ ...styles.title, ...(isMobile ? styles.titleMobile : {}) }}>
              Sistema de Gestión Vehicular
            </h1>
            <p style={{ ...styles.subtitle, ...(isMobile ? styles.subtitleMobile : {}) }}>
              Transforma la gestión de tu flota con herramientas intuitivas y tecnología de vanguardia.
            </p>
            <div style={{ ...styles.ctaContainer, ...(isMobile ? styles.ctaContainerMobile : {}) }}>
              <Link href="/vehiculos">
                <button
                  style={{ ...styles.ctaButton, ...(isMobile ? styles.ctaButtonMobile : {}) }}
                  aria-label="Explorar vehículos"
                >
                  <span style={styles.buttonIcon}>🚗</span> Explorar Vehículos
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section style={{ ...styles.featuresSection, ...(isMobile ? styles.featuresSectionMobile : {}) }}>
        <h2 style={{ ...styles.sectionTitle, ...(isMobile ? styles.sectionTitleMobile : {}) }}>
          Soluciones a tu Medida
        </h2>
        <div style={{ ...styles.featuresGrid, ...(isMobile ? styles.featuresGridMobile : {}) }}>
          {[
            { emoji: '🚗', title: 'Registro de Vehículos', text: 'Organiza placa, marca y modelo en segundos.' },
            { emoji: '🔔', title: 'Alertas de Vencimiento', text: 'Mantente al día con SOAT y Tecno-Mecánica.' },
            { emoji: '🔧', title: 'Historial de Mantenimientos', text: 'Controla costos y facturas al detalle.' },
            { emoji: '📊', title: 'Exportación a Excel', text: 'Reportes rápidos y precisos al instante.' },
          ].map((feature, index) => (
            <div
              key={index}
              style={{ ...styles.featureCard, ...(isMobile ? styles.featureCardMobile : {}) }}
            >
              <span style={styles.featureEmoji}>{feature.emoji}</span>
              <h3 style={{ ...styles.featureTitle, ...(isMobile ? styles.featureTitleMobile : {}) }}>
                {feature.title}
              </h3>
              <p style={{ ...styles.featureText, ...(isMobile ? styles.featureTextMobile : {}) }}>
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ ...styles.aboutSection, ...(isMobile ? styles.aboutSectionMobile : {}) }}>
        <h2 style={{ ...styles.sectionTitle, ...(isMobile ? styles.sectionTitleMobile : {}) }}>
          Sobre Nosotros
        </h2>
        <p style={{ ...styles.aboutText, ...(isMobile ? styles.aboutTextMobile : {}) }}>
          Desarrollado por <strong>Mister Solutions S.A.S</strong>, el <strong>Sistema de Gestión Vehicular</strong> combina innovación y simplicidad para optimizar la administración de flotas.
        </p>
        <a
          href="https://linkfly.to/MisterSolutionsSas"
          style={{ ...styles.aboutButton, ...(isMobile ? styles.aboutButtonMobile : {}) }}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visitar Mister Solutions"
        >
          <span style={styles.buttonIcon}>🌐</span> Conoce Más
        </a>
      </section>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f7fafc',
    fontFamily: "'Inter', sans-serif",
    padding: '1rem 0.5rem',
    overflowX: 'hidden',
  },
  // Header
  header: {
    background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
    borderRadius: '12px',
    margin: '0.5rem 0 2rem',
    padding: '2rem 1.5rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    animation: 'fadeIn 0.6s ease-out forwards',
  },
  headerMobile: {
    padding: '1rem 0.5rem',
    margin: '0.25rem 0 1rem',
  },
  headerContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  headerContentMobile: {
    flexDirection: 'column',
    gap: '0.75rem',
    alignItems: 'center',
    textAlign: 'center',
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  logoContainerMobile: {
    margin: '0 auto',
  },
  logo: {
    borderRadius: '50%',
    boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease',
  },
  headerText: {
    flex: 1,
  },
  headerTextMobile: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '95%',
  },
  title: {
    fontSize: '2.25rem',
    fontWeight: '800',
    color: '#2d3748',
    marginBottom: '0.5rem',
    lineHeight: '1.2',
  },
  titleMobile: {
    fontSize: '1.5rem',
    margin: '0.25rem 0',
  },
  subtitle: {
    fontSize: '1rem',
    fontWeight: '400',
    color: '#4a5568',
    marginBottom: '1rem',
    maxWidth: '500px',
  },
  subtitleMobile: {
    fontSize: '0.9rem',
    marginBottom: '0.75rem',
    maxWidth: '90%',
  },
  ctaContainer: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  ctaContainerMobile: {
    justifyContent: 'center',
  },
  ctaButton: {
    padding: '0.8rem 2rem',
    background: 'linear-gradient(135deg, #3182ce 0%, #2b6cb0 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.3s, background 0.3s',
    boxShadow: '0 3px 8px rgba(49,130,206,0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  ctaButtonMobile: {
    padding: '0.7rem 1.5rem',
    fontSize: '0.95rem',
  },
  buttonIcon: {
    fontSize: '1.2rem',
  },
  // Features Section
  featuresSection: {
    maxWidth: '1280px',
    margin: '0 auto 2rem',
    padding: '0 1rem',
    animation: 'fadeIn 0.6s ease-out 0.2s forwards',
  },
  featuresSectionMobile: {
    margin: '0 auto 1.5rem',
    padding: '0 0.5rem',
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#2d3748',
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  sectionTitleMobile: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1rem',
  },
  featuresGridMobile: {
    gridTemplateColumns: '1fr',
    gap: '0.75rem',
  },
  featureCard: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
    textAlign: 'center',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  featureCardMobile: {
    padding: '1rem',
  },
  featureEmoji: {
    fontSize: '2rem',
    width: '50px',
    height: '50px',
    lineHeight: '50px',
    backgroundColor: '#e6f0fa',
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '0.75rem',
  },
  featureTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '0.4rem',
  },
  featureTitleMobile: {
    fontSize: '1.1rem',
  },
  featureText: {
    fontSize: '0.9rem',
    color: '#4a5568',
    lineHeight: '1.4',
  },
  featureTextMobile: {
    fontSize: '0.85rem',
  },
  // About Section
  aboutSection: {
    maxWidth: '900px',
    margin: '0 auto 2rem',
    padding: '2rem',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
    textAlign: 'center',
    animation: 'fadeIn 0.6s ease-out 0.4s forwards',
  },
  aboutSectionMobile: {
    maxWidth: '100%',
    margin: '0 0.5rem 1.5rem',
    padding: '1rem',
  },
  aboutText: {
    fontSize: '1rem',
    color: '#4a5568',
    lineHeight: '1.5',
    marginBottom: '1rem',
  },
  aboutTextMobile: {
    fontSize: '0.9rem',
    marginBottom: '0.75rem',
  },
  aboutButton: {
    padding: '0.8rem 2rem',
    background: 'linear-gradient(135deg, #3182ce 0%, #2b6cb0 100%)',
    color: '#fff',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'transform 0.2s, box-shadow 0.3s',
    boxShadow: '0 3px 8px rgba(49,130,206,0.3)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  aboutButtonMobile: {
    padding: '0.7rem 1.5rem',
    fontSize: '0.95rem',
  },
};

// Animación para fade-in
const keyframes = `
  @keyframes fadeIn {
    to { opacity: 1; transform: translateY(0); }
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = keyframes;
  document.head.appendChild(styleSheet);
}

export default withAuth(Home);