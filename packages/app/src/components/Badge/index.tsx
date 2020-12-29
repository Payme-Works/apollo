import React, { useContext, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { useTransition } from 'react-spring';

import { ThemeContext } from 'styled-components';

import { Container } from './styles';

interface IBadgeProps {
  closeable?: boolean;
  onClose(): void;
}

const Badge: React.FC<IBadgeProps> = ({
  children,
  closeable = false,
  onClose,
}) => {
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
              role="button"
              tabIndex={0}
              onKeyPress={() => setIsOpen(false)}
              onClick={() => setIsOpen(false)}
            >
              <FiX />
            </div>
          )}
        </Container>
      ))}
    </>
  );
};

export default Badge;
