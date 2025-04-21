import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Cargar el usuario del localStorage al iniciar la app
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (username, password) => {
    let authenticatedUser = null;

    if (username === "admin" && password === "password") {
      authenticatedUser = {
        username: "admin",
        name: "Administrador",
        role: "Administrador",
      };
    } else if (username === "mesero" && password === "1234") {
      authenticatedUser = {
        username: "mesero",
        name: "Juan Pérez",
        role: "Mesero",
      };
    } else if (username === "cajero" && password === "1234") {
      authenticatedUser = {
        username: "cajero",
        name: "María López",
        role: "Cajero",
      };
    } else if (username === "cocina" && password === "1234") {
      authenticatedUser = {
        username: "cocina",
        name: "Carlos Chef",
        role: "Cocina",
      };
    } else {
      alert("Credenciales incorrectas");
      return false;
    }

    // Guarda el usuario en el estado y en localStorage
    setUser(authenticatedUser);
    localStorage.setItem("user", JSON.stringify(authenticatedUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);