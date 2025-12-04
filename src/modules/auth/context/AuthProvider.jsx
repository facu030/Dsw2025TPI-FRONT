import { createContext, useState } from "react";
import { login } from "../services/login";
import { register } from "../services/register";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("token");

    return Boolean(token);
  });

  const singout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
  };

  const singin = async (username, password) => {
    const { data, error } = await login(username, password);

    if (error) {
      return { error };
    }

    localStorage.setItem("token", data);
    setIsAuthenticated(true);

    return { error: null };
  };

  const signup = async (username, email, password) => {
    const { data, error } = await register(username, email, password);

    if (error) {
      return { error };
    }

    localStorage.setItem("token", data);
    setIsAuthenticated(true);

    return { error: null, data };
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        singin,
        singout,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext };
