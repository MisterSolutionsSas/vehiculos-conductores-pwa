import Navbar from '../components/Navbar';
import withAuth from '../utils/withAuth';
import Link from 'next/link';
import Image from 'next/image';

function Home() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 600;

  return (
    <div style={styles.container}>
      <Navbar />
      <header style={{ ...styles.header, ...(isMobile ? styles.headerMobile : {}) }}>
        <div style={{ ...styles.headerContent, ...(isMobile ? styles.headerContentMobile : {}) }}>
          <div style={{ ...styles.logoContainer, ...(isMobile ? styles.logoContainerMobile : {}) }}>
            <Image
              src="/logo-placeholder.png"
              alt="Logo Sistema de Gestión Vehicular"
              width={isMobile ? 200 : 200} height={isMobile ? 200 : 200}
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
            <div
              style={{
                ...styles.ctaContainer,
                justifyContent: isMobile ? 'center' : 'flex-start',
              }}
            >
              <Link href="/vehiculos">
                <button
                  style={{ ...styles.ctaButton, ...(isMobile ? styles.ctaButtonMobile : {}) }}
                  aria-label="Explorar vehículos"
                >
                  Explorar Vehículos
                </button>
              </Link>
              <a
                href="mailto:mistersolutions.s.a.s@gmail.com"
                style={{ ...styles.secondaryButton, ...(isMobile ? styles.secondaryButtonMobile : {}) }}
                aria-label="Contactar soporte"
              >
                Contáctanos
              </a>
            </div>
          </div>
        </div>
      </header>

      <section style={{ ...styles.featuresSection, ...(isMobile ? styles.featuresSectionMobile : {}) }}>
        <h2 style={{ ...styles.sectionTitle, ...(isMobile ? styles.sectionTitleMobile : {}) }}>
          Soluciones a tu Medida
        </h2>
        <div style={{ ...styles.featuresGrid, ...(isMobile ? styles.featuresGridMobile : {}) }}>
          <div style={{ ...styles.featureCard, ...(isMobile ? styles.featureCardMobile : {}) }}>
            <span style={styles.featureEmoji}>🚗</span>
            <h3 style={{ ...styles.featureTitle, ...(isMobile ? styles.featureTitleMobile : {}) }}>
              Registro de Vehículos
            </h3>
            <p style={{ ...styles.featureText, ...(isMobile ? styles.featureTextMobile : {}) }}>
              Organiza placa, marca y modelo en segundos.
            </p>
          </div>
          <div style={{ ...styles.featureCard, ...(isMobile ? styles.featureCardMobile : {}) }}>
            <span style={styles.featureEmoji}>🔔</span>
            <h3 style={{ ...styles.featureTitle, ...(isMobile ? styles.featureTitleMobile : {}) }}>
              Alertas de Vencimiento
            </h3>
            <p style={{ ...styles.featureText, ...(isMobile ? styles.featureTextMobile : {}) }}>
              Mantente al día con SOAT y Tecno-Mecánica.
            </p>
          </div>
          <div style={{ ...styles.featureCard, ...(isMobile ? styles.featureCardMobile : {}) }}>
            <span style={styles.featureEmoji}>🔧</span>
            <h3 style={{ ...styles.featureTitle, ...(isMobile ? styles.featureTitleMobile : {}) }}>
              Historial de Mantenimientos
            </h3>
            <p style={{ ...styles.featureText, ...(isMobile ? styles.featureTextMobile : {}) }}>
              Controla costos y facturas al detalle.
            </p>
          </div>
          <div style={{ ...styles.featureCard, ...(isMobile ? styles.featureCardMobile : {}) }}>
            <span style={styles.featureEmoji}>📊</span>
            <h3 style={{ ...styles.featureTitle, ...(isMobile ? styles.featureTitleMobile : {}) }}>
              Exportación a Excel
            </h3>
            <p style={{ ...styles.featureText, ...(isMobile ? styles.featureTextMobile : {}) }}>
              Reportes rápidos y precisos al instante.
            </p>
          </div>
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
          Conoce Más
        </a>
      </section>

      <footer style={{ ...styles.footer, ...(isMobile ? styles.footerMobile : {}) }}>
        <div style={styles.footerContent}>
          <p style={{ ...styles.footerText, ...(isMobile ? styles.footerTextMobile : {}) }}>
            Sistema de Gestión Vehicular © {new Date().getFullYear()} | Mister Solutions S.A.S
          </p>
          <div style={styles.footerLinks}>
            <a
              href="mailto:mistersolutions.s.a.s@gmail.com"
              style={styles.footerLink}
              aria-label="Contactar soporte"
            >
              Contacto
            </a>
            <a
              href="https://linkfly.to/MisterSolutionsSas"
              style={styles.footerLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visitar Mister Solutions"
            >
              Sobre Nosotros
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#fafafa',
    fontFamily: "'Inter', sans-serif",
    padding: '1.5rem 1rem',
    overflowX: 'hidden',
  },
  // Header
  header: {
    background: 'linear-gradient(135deg, #ffffff 0%, #edf2f7 100%)',
    borderRadius: '14px',
    margin: '1rem 0 2.5rem',
    padding: '3.5rem 2rem',
    boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
    opacity: 0,
    transform: 'translateY(30px)',
    animation: 'fadeIn 0.8s ease-out forwards',
  },
  headerMobile: {
    padding: '1.75rem 0.75rem',
    margin: '0.5rem 0 1.5rem',
  },
  headerContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    gap: '2.5rem',
  },
  headerContentMobile: {
    flexDirection: 'column',
    gap: '1rem',
    alignItems: 'center',
    justifyContent: 'center',
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
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    transition: 'transform 0.3s',
  },
  headerText: {
    flex: 1,
  },
  headerTextMobile: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '100%',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '900',
    color: '#1a202c',
    marginBottom: '0.75rem',
    lineHeight: '1.2',
  },
  titleMobile: {
    fontSize: '1.8rem',
    margin: '0.5rem 0',
  },
  subtitle: {
    fontSize: '1.15rem',
    fontWeight: '400',
    color: '#4a5568',
    marginBottom: '2rem',
    maxWidth: '600px',
  },
  subtitleMobile: {
    fontSize: '1rem',
    marginBottom: '1.25rem',
    maxWidth: '90%',
  },
  ctaContainer: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  ctaButton: {
    padding: '0.9rem 2.5rem',
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.3s',
    boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
  },
  ctaButtonMobile: {
    padding: '0.7rem 2rem',
    fontSize: '0.95rem',
  },
  secondaryButton: {
    padding: '0.9rem 2.5rem',
    backgroundColor: 'transparent',
    color: '#2563eb',
    border: '2px solid #2563eb',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'background-color 0.3s, color 0.3s, box-shadow 0.3s',
  },
  secondaryButtonMobile: {
    padding: '0.7rem 2rem',
    fontSize: '0.95rem',
  },
  // Features Section
  featuresSection: {
    maxWidth: '1280px',
    margin: '0 auto 3rem',
    padding: '0 1.5rem',
    opacity: 0,
    transform: 'translateY(30px)',
    animation: 'fadeIn 0.8s ease-out 0.3s forwards',
  },
  featuresSectionMobile: {
    margin: '0 auto 2rem',
    padding: '0 0.75rem',
  },
  sectionTitle: {
    fontSize: '2.25rem',
    fontWeight: '800',
    color: '#1a202c',
    textAlign: 'center',
    marginBottom: '2.5rem',
  },
  sectionTitleMobile: {
    fontSize: '1.75rem',
    marginBottom: '1.5rem',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.5rem',
  },
  featuresGridMobile: {
    gap: '1rem',
  },
  featureCard: {
    backgroundColor: '#ffffff',
    padding: '1.75rem',
    borderRadius: '12px',
    boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
    textAlign: 'center',
    transition: 'transform 0.3s, box-shadow 0.3s',
  },
  featureCardMobile: {
    padding: '1.25rem',
  },
  featureEmoji: {
    fontSize: '2.5rem',
    width: '60px',
    height: '60px',
    lineHeight: '60px',
    backgroundColor: '#eff6ff',
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  featureTitle: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '0.5rem',
  },
  featureTitleMobile: {
    fontSize: '1.15rem',
  },
  featureText: {
    fontSize: '0.95rem',
    color: '#4a5568',
    lineHeight: '1.5',
  },
  featureTextMobile: {
    fontSize: '0.9rem',
  },
  // About Section
  aboutSection: {
    maxWidth: '900px',
    margin: '0 auto 3rem',
    padding: '2.5rem',
    backgroundColor: '#ffffff',
    borderRadius: '14px',
    boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
    textAlign: 'center',
    opacity: 0,
    transform: 'translateY(30px)',
    animation: 'fadeIn 0.8s ease-out 0.5s forwards',
  },
  aboutSectionMobile: {
    maxWidth: '100%',
    margin: '0 0.75rem 2rem',
    padding: '1.5rem',
  },
  aboutText: {
    fontSize: '1.05rem',
    color: '#4a5568',
    lineHeight: '1.6',
    marginBottom: '1.5rem',
  },
  aboutTextMobile: {
    fontSize: '0.95rem',
    marginBottom: '1rem',
  },
  aboutButton: {
    padding: '0.9rem 2.5rem',
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    color: '#ffffff',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '700',
    textDecoration: 'none',
    transition: 'transform 0.2s, box-shadow 0.3s',
    boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
  },
  aboutButtonMobile: {
    padding: '0.7rem 2rem',
    fontSize: '0.95rem',
  },
  // Footer
  footer: {
    backgroundColor: '#1a202c',
    padding: '2rem 1rem',
    color: '#e2e8f0',
  },
  footerMobile: {
    padding: '1.5rem 0.75rem',
  },
  footerContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  footerText: {
    fontSize: '0.95rem',
    color: '#e2e8f0',
    textAlign: 'center',
  },
  footerTextMobile: {
    fontSize: '0.9rem',
  },
  footerLinks: {
    display: 'flex',
    gap: '1.5rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  footerLink: {
    fontSize: '0.95rem',
    color: '#93c5fd',
    textDecoration: 'none',
    transition: 'color 0.3s',
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