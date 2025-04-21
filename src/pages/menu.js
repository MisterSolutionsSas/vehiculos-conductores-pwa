import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import menuItems from '../utils/menuItems';
import styles from '../styles/Menu.module.css';

const MenuPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleCategory = (index) => {
    setExpandedCategory(expandedCategory === index ? null : index);
  };

  return (
    <div className={styles.menuContainer}>
      <h1 className={styles.title}>Menú</h1>
      {menuItems.map((category, index) => (
        <div key={index} className={styles.categorySection}>
          <h2
            className={styles.categoryTitle}
            onClick={() => toggleCategory(index)}
          >
            {category.category}
          </h2>
          <div
            className={`${styles.itemsGrid} ${
              expandedCategory === index ? styles.visible : styles.hidden
            }`}
          >
            {category.items.map((item, idx) => (
              <div key={idx} className={styles.menuCard}>
                <div className={styles.imageContainer}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={300}  // Ajusta según necesidad
                    height={200} // Ajusta según necesidad
                    className={styles.itemImage}
                    loading="lazy"
                    quality={80} // Reduce calidad para mejor performance
                    placeholder="blur" // Opcional: para blur mientras carga
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==" // Placeholder simple
                  />
                </div>
                <h3 className={styles.itemName}>{item.name}</h3>
                <p className={styles.itemDescription}>{item.description}</p>
                <div className={styles.prices}>
                  {item.prices ? (
                    <>
                      {item.prices.mediana && isClient && (
                        <p>
                          <strong>Mediana:</strong> ${item.prices.mediana.toLocaleString()}
                        </p>
                      )}
                      {item.prices.grande && isClient && (
                        <p>
                          <strong>Grande:</strong> ${item.prices.grande.toLocaleString()}
                        </p>
                      )}
                    </>
                  ) : (
                    <p>
                      <strong>Precio:</strong> $
                      {isClient ? item.price.toLocaleString() : item.price}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuPage;