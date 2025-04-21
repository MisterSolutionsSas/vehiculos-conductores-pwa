// src/pages/_app.js
import "../styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import { useRouter } from "next/router";function AppWrapper({ Component, pageProps }) {
  const router = useRouter();
  const isLoginPage = router.pathname === "/login";  return (
    <AuthProvider>
      {!isLoginPage && <Header />}
      <Component {...pageProps} />
    </AuthProvider>
  );
}export default AppWrapper;
