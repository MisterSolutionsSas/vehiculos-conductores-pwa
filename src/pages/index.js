'use client';
import React from 'react';
import styles from '@/styles/Inicio.module.css';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

// Datos estructurados para mejor mantenimiento
const PAGE_CONTENT = {
  header: {
    title: "Bienvenido al Sistema de Gestión de Restaurante",
    subtitle: "La solución integral para gestionar tu restaurante con eficiencia y simplicidad"
  },
  features: [
    {
      emoji: '🪑',
      title: 'Gestión de Mesas',
      description: 'Controla la disponibilidad y asignación de mesas en tiempo real para un servicio ágil.'
    },
    {
      emoji: '🍽️',
      title: 'Menú Digital',
      description: 'Permite a los clientes explorar y pedir desde un menú interactivo en sus dispositivos.'
    },
    {
      emoji: '📝',
      title: 'Toma de Pedidos',
      description: 'Facilita la toma de pedidos por meseros con seguimiento en tiempo real.'
    },
    {
      emoji: '💳',
      title: 'Facturación',
      description: 'Genera facturas claras y personalizadas con soporte para múltiples métodos de pago.'
    },
    {
      emoji: '📦',
      title: 'Gestión de Inventario',
      description: 'Mantén el control de insumos con alertas para evitar faltantes.'
    },
    {
      emoji: '📊',
      title: 'Informes',
      description: 'Accede a reportes de ventas y desempeño para optimizar tu negocio.'
    }
  ],
  sections: {
    introduction: {
      title: "¿Qué ofrece el Sistema de Gestión de Restaurante?",
      content: "Nuestra plataforma te permite optimizar la operación de tu restaurante desde un solo lugar. Administra mesas, toma pedidos, gestiona el inventario, genera facturas automáticas, y obtén informes detallados para tomar decisiones informadas, todo con una interfaz intuitiva y moderna."
    },
    about: {
      title: "Sobre Nosotros",
      content: "El Sistema de Gestión de Restaurante fue diseñado por Mister Solutions S.A.S., una empresa dedicada a crear soluciones tecnológicas innovadoras para optimizar la operación de negocios. Nos apasiona ayudar a los restaurantes a alcanzar su máximo potencial con herramientas modernas y fáciles de usar."
    },
    contact: {
      title: "Contáctanos",
      content: "¿Tienes preguntas o necesitas soporte? Comunícate con nosotros a través de nuestro enlace de contacto.",
      link: {
        url: "https://linkfly.to/MisterSolutionsSas",
        text: "Contactar a Mister Solutions S.A.S."
      }
    }
  }
};

// Componente de Tarjeta de Característica
const FeatureCard = ({ emoji, title, description }) => (
  <div className={styles.featureCard}>
    <span role="img" aria-label={title} className={styles.emoji}>
      {emoji}
    </span>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

// Componente de Encabezado de Sección
const SectionHeader = ({ title, children, className }) => (
  <div className={className}>
    <h2>{title}</h2>
    {children && <p className={styles.sectionSubtitle}>{children}</p>}
  </div>
);

// Componente de Botón Reutilizable
const CustomButton = ({ href, onClick, children, className = '', ariaLabel, target, rel }) => {
  const buttonClasses = `${styles.button} ${className}`;
  
  if (href) {
    return (
      <Link
        href={href}
        className={buttonClasses}
        aria-label={ariaLabel}
        prefetch={false}
        target={target}
        rel={rel}
      >
        {children}
      </Link>
    );
  }
  
  return (
    <button onClick={onClick} className={buttonClasses} aria-label={ariaLabel}>
      {children}
    </button>
  );
};

// Componente de Caja de Contenido
const ContentBox = ({ children }) => (
  <div className={styles.contentBox}>
    {children}
  </div>
);

// Componente Principal
export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className={styles.container}>
      {/* Encabezado Principal */}
      <SectionHeader 
        title={PAGE_CONTENT.header.title} 
        className={styles.mainHeader}
      >
        {PAGE_CONTENT.header.subtitle}
      </SectionHeader>

      {/* Sección de Introducción */}
      <section className={styles.section} aria-labelledby="introduction-heading">
        <SectionHeader title={PAGE_CONTENT.sections.introduction.title} />
        <ContentBox>
          <p>{PAGE_CONTENT.sections.introduction.content}</p>
        </ContentBox>
      </section>

      {/* Sección de Características */}
      <section className={styles.section} aria-labelledby="features-heading">
        <SectionHeader title="Características Principales" />
        <div className={styles.featuresGrid}>
          {PAGE_CONTENT.features.map((feature, index) => (
            <FeatureCard 
              key={`feature-${index}`}
              emoji={feature.emoji}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>

      {/* Sección Sobre Nosotros */}
      <section className={styles.section} aria-labelledby="about-heading">
        <SectionHeader title={PAGE_CONTENT.sections.about.title} />
        <ContentBox>
          <p>{PAGE_CONTENT.sections.about.content}</p>
        </ContentBox>
      </section>

      {/* Sección de Contacto */}
      <section className={styles.section} aria-labelledby="contact-heading">
        <SectionHeader title={PAGE_CONTENT.sections.contact.title} />
        <div className={styles.contactBox}>
          <p>{PAGE_CONTENT.sections.contact.content}</p>
          <CustomButton
            href={PAGE_CONTENT.sections.contact.link.url}
            className={styles.primaryButton}
            ariaLabel={PAGE_CONTENT.sections.contact.link.text}
            target="_blank"
            rel="noopener noreferrer"
          >
            {PAGE_CONTENT.sections.contact.link.text}
          </CustomButton>
        </div>
      </section>
    </div>
  );
}