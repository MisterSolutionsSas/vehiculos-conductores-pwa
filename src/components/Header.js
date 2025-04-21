import React, { useState } from "react";
import styles from "../styles/Header.module.css";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import Link from "next/link";

const Header = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <h1>Carrito Rojo</h1>
        </div>

        <button
          className={styles.menuToggle}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={styles.hamburger}></span>
        </button>

        <ul className={`${styles.menu} ${isMenuOpen ? styles.menuOpen : ""}`}>
          <li>
            <Link href="/" passHref legacyBehavior>
              <a onClick={toggleMenu}>Inicio</a>
            </Link>
          </li>
          <li>
            <Link href="/menu" passHref legacyBehavior>
              <a onClick={toggleMenu}>Menú</a>
            </Link>
          </li>
          <li>
            <Link href="/order" passHref legacyBehavior>
              <a onClick={toggleMenu}>Realizar pedido</a>
            </Link>
          </li>
          <li>
            <Link href="/orders" passHref legacyBehavior>
              <a onClick={toggleMenu}>Consultar pedidos</a>
            </Link>
          </li>
          <li>
            <Link href="/reports" passHref legacyBehavior>
              <a onClick={toggleMenu}>Informes</a>
            </Link>
          </li>
          <li>
            <Link href="/inventory" passHref legacyBehavior>
              <a onClick={toggleMenu}>Inventario</a>
            </Link>
          </li>
        </ul>

        <div className={styles.userInfo}>
          {user && (
            <>
              <span className={styles.welcomeMessage}>
                Bienvenido, {user.name || "Admin"}
              </span>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;