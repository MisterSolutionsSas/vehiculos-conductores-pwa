// src/pages/_app.js
import "../styles/globals.css";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import { useRouter } from "next/router";
import { useEffect } from "react";

// Componente que maneja la lógica de autenticación y renderizado
function AppContent({ Component, pageProps }) {
  const { user } = useAuth(); // Ahora useAuth está dentro de AuthProvider
  const router = useRouter();
  const isLoginPage = router.pathname === "/login";

  useEffect(() => {
    // Si no hay usuario y no estamos en la página de login, redirigir a /login
    if (!user && !isLoginPage) {
      router.push("/login");
    }
  }, [user, router, isLoginPage]);

  return (
    <>
      {!isLoginPage && <Header />}
      <Component {...pageProps} />
    </>
  );
}

// Componente principal que envuelve todo con AuthProvider
function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AppContent Component={Component} pageProps={pageProps} />
    </AuthProvider>
  );
}

export default MyApp;