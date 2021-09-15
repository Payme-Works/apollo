import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useMemo,
} from 'react';

import { v4 as uuid } from 'uuid';

interface IUser {
  id: string;
}

interface AuthContextData {
  user?: IUser;
  isLoggingIn: boolean;
  isLoggedIn: boolean;
  logIn(): Promise<void>;
  logOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState<IUser>();
  const [isLoggingIn, setLoggingIn] = useState<any>();

  const isLoggedIn = useMemo(() => !!user, [user]);

  const logIn = useCallback(async () => {
    setLoggingIn(true);

    const newUser: IUser = {
      id: uuid(),
    };

    setTimeout(() => {
      setUser(newUser);
      setLoggingIn(false);
    });
  }, []);

  const logOut = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isLoggingIn,
        logIn,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("'useAuth' must be used within a 'AuthContextProvider'");
  }

  return context;
}
