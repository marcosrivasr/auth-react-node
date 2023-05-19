import { useContext, createContext, useState, useEffect } from "react";
import type { AuthResponse, User } from "../types/types";
import requestNewAccessToken from "./requestNewAccessToken";

const AuthContext = createContext({
  isAuthenticated: false,
  getAccessToken: () => {},
  setAccessTokenAndRefreshToken: (
    _accessToken: string,
    _refreshToken: string
  ) => {},
  getRefreshToken: () => {},
  saveUser: (_userData: AuthResponse) => {},
  getUser: () => ({} as User | undefined),
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | undefined>();
  const [accessToken, setAccessToken] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isloading, setIsLoading] = useState(true);

  function getAccessToken() {
    return accessToken;
  }

  function saveUser(userData: AuthResponse) {
    setAccessTokenAndRefreshToken(
      userData.body.accessToken,
      userData.body.refreshToken
    );
    setUser(userData.body.user);
    setIsAuthenticated(true);
  }

  function setAccessTokenAndRefreshToken(
    accessToken: string,
    refreshToken: string
  ) {
    console.log("setAccessTokenAndRefreshToken", accessToken, refreshToken);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);

    localStorage.setItem("token", JSON.stringify({ refreshToken }));
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

  async function getNewAccessToken(refreshToken: string) {
    const token = await requestNewAccessToken(refreshToken);
    if (token) {
      return token;
    }
  }

  function getUser(): User | undefined {
    return user;
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("useEffect: token", token);
      const refreshToken = JSON.parse(token).refreshToken;
      //pedir nuevo access token
      getNewAccessToken(refreshToken)
        .then(async (newToken) => {
          const userInfo = await retrieveUserInfo(newToken!);
          setUser(userInfo);
          setAccessToken(newToken!);
          setIsAuthenticated(true);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        getAccessToken,
        setAccessTokenAndRefreshToken,
        getRefreshToken,
        saveUser,
        getUser,
      }}
    >
      {isloading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
}

async function retrieveUserInfo(accessToken: string) {
  try {
    const response = await fetch("http://localhost:3000/api/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const json = await response.json();
      console.log(json);
      return json.body;
    }
  } catch (error) {}
}

export const useAuth = () => useContext(AuthContext);
