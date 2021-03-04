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

interface AuthenticationContext {
  user?: IUser;
  isLoggingIn: boolean;
  isLoggedIn: boolean;
  logIn(): Promise<void>;
  logOut(): void;
}

const AuthenticationContext = createContext<AuthenticationContext | null>(null);

const AuthenticationProvider: React.FC = ({ children }) => {
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
    <AuthenticationContext.Provider
      value={{
        user,
        isLoggedIn,
        isLoggingIn,
        logIn,
        logOut,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

function useAuthentication(): AuthenticationContext {
  const context = useContext(AuthenticationContext);

  if (!context) {
    throw new Error(
      "'useAuthentication' must be used within a 'AuthenticationProvider'",
    );
  }

  return context;
}

export { AuthenticationProvider, useAuthentication };
