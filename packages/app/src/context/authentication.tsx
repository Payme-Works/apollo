import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useMemo,
} from 'react';

interface AuthenticationContext {
  user?: any;
  isLoggingIn: boolean;
  isLoggedIn: boolean;
  logIn(): Promise<void>;
}

const AuthenticationContext = createContext<AuthenticationContext | null>(null);

const AuthenticationProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<any>();
  const [isLoggingIn, setLoggingIn] = useState<any>();

  const isLoggedIn = useMemo(() => !!user, [user]);

  const logIn = useCallback(async () => {
    setLoggingIn(true);

    setTimeout(() => {
      setUser({});
      setLoggingIn(false);
    });
  }, []);

  return (
    <AuthenticationContext.Provider
      value={{
        user,
        isLoggedIn,
        isLoggingIn,
        logIn,
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
