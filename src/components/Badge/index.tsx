import React, { ReactNode, useContext, useState } from 'react';

import { FiX } from 'react-icons/fi';
import { useTransition } from 'react-spring';
import { ThemeContext } from 'styled-components';

import { Container } from './styles';

interface BadgeProps {
  closeable?: boolean;
  onClose(): void;
  children: ReactNode;
}

export function Badge({ children, closeable = false, onClose }: BadgeProps) {
  const theme = useContext(ThemeContext);

  const [isOpen, setIsOpen] = useState(true);

  const transitions = useTransition(isOpen ? [children] : [], null, {
    from: {
      maxHeight: '0%',
      padding: `${theme.spaces[0]} ${theme.spaces[5]}`,
    },
    enter: {
      maxHeight: '100%',
      padding: `${theme.spaces[5]} ${theme.spaces[5]}`,
    },
    leave: {
      maxHeight: '0%',
      padding: `${theme.spaces[0]} ${theme.spaces[5]}`,
    },
    onDestroyed: () => onClose(),
  });

  return (
    <>
      {transitions.map(({ key, props, item }) => (
        <Container key={key} style={props}>
          {item}

          {closeable && (
            <div
              onClick={() => setIsOpen(false)}
              onKeyPress={() => setIsOpen(false)}
              role="button"
              tabIndex={-1}
            >
              <FiX />
            </div>
          )}
        </Container>
      ))}
    </>
  );
}
