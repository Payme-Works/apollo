import React, { useCallback } from 'react';
import { FiChevronLeft } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';

import FooterBox from '@/components/FooterBox';
import { useAuthentication } from '@/context/authentication';

import { Container } from './styles';

const Settings: React.FC = () => {
  const history = useHistory();

  const { logOut } = useAuthentication();

  const handleLogOut = useCallback(() => {
    logOut();
  }, [logOut]);

  return (
    <Container>
      <FiChevronLeft
        onClick={() => history.goBack()}
        size={32}
        style={{ marginBottom: 32 }}
      />

      <FooterBox
        title="Corretora"
        description="Autentique-se na corretora para que seja possível fazer as operações em sua conta."
        footer={{
          tip: 'Suas credenciais ficam em seu dispositivo, seguras.',
          button: {
            text: 'Entrar',
            onClick: () => handleLogOut(),
          },
        }}
      >
        <h1>Inputs</h1>
      </FooterBox>
    </Container>
  );
};

export default Settings;
