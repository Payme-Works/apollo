import React, { createContext, useState, useContext, useCallback } from 'react';

import { v4 as uuid } from 'uuid';

import ToastContainer from '../components/ToastContainer';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description: string;
}

interface ToastShow {
  (message: Omit<ToastMessage, 'id'>): string;
}

interface ToastHide {
  (id: string): void;
}

interface ToastContextData {
  addToast: ToastShow;
  removeToast: ToastHide;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export function ToastContextProvider({ children }) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const removeToast = useCallback(id => {
    setMessages(state => state.filter(message => message.id !== id));
  }, []);

  const addToast = useCallback<ToastShow>(message => {
    const id = uuid();

    setMessages(state => [...state, { ...message, id }]);

    return id;
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      <ToastContainer toasts={messages} />

      {children}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextData {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("'useToast' must be used within a 'ToastContextProvider'");
  }

  return context;
}
