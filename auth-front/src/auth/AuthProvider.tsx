import { useContext, createContext, useState } from "react";

const AuthContext = createContext({
  user: null,
  setUser: (user: any) => {},
  accessToken: null,
  setAccessToken: (accessToken: any) => {},
  refreshToken: null,
  setRefreshToken: (refreshToken: any) => {},
  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated: any) => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        accessToken,
        setAccessToken,
        refreshToken,
        setRefreshToken,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
