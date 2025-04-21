import React, { useState } from "react";
import Image from "next/image";
import styles from "@/styles/Login.module.css";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

const Login = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(""); // ← mensaje de error

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(username, password);
    if (success) {
      router.push("/"); // ← Redirige al inicio después del login exitoso
    } else {
      setErrorMsg("Usuario o contraseña incorrecta. Si cree que es un error, comuníquese con el soporte.");
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>Bienvenido al Sistema de Gestión del Carrito Rojo</h1>
        <Image
          src="/logo.png"
          alt="Logo"
          width={200}
          height={200}
          className={styles.logo}
        />
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Iniciar sesión
          </button>
          {errorMsg && <p className={styles.error}>{errorMsg}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
