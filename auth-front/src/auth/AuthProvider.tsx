import { useContext, createContext, useState } from "react";

const AuthContext = createContext({
  user: null,
  setUser: (user: any) => {},
  accessToken: "",
  setAccessToken: (accessToken: any) => {},
  refreshToken: "",
  setRefreshToken: (refreshToken: any) => {},
  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated: any) => {},
  getAccessToken: () => {},
  setAccessTokenAndRefreshToken: (
    accessToken: string,
    refreshToken: string
  ) => {},
  getRefreshToken: () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  function getAccessToken() {
    if (accessToken && refreshToken) {
      localStorage.setItem(
        "token",
        JSON.stringify({ accessToken, refreshToken })
      );
    }
    return accessToken;
  }

  function setAccessTokenAndRefreshToken(
    accessToken: string,
    refreshToken: string
  ) {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);

    localStorage.setItem(
      "token",
      JSON.stringify({ accessToken, refreshToken })
    );
  }

  function getRefreshToken() {
    if (!!refreshToken) {
      return refreshToken;
    }
    const token = localStorage.getItem("token");
    if (token) {
      const { refreshToken } = JSON.parse(token);
      setRefreshToken(refreshToken);
      return refreshToken;
    }
    return null;
  }

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
        getAccessToken,
        setAccessTokenAndRefreshToken,
        getRefreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
