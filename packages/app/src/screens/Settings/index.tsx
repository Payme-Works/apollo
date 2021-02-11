import React, { useCallback, useRef } from 'react';
import { FiAirplay, FiUser } from 'react-icons/fi';

import FooterBox from '@/components/FooterBox';
import Input from '@/components/Form/Input';
import Select from '@/components/Form/Select';
import { useAuthentication } from '@/context/authentication';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import { Container } from './styles';

const Settings: React.FC = () => {
  const brokerFormRef = useRef<FormHandles>(null);

  const { logOut } = useAuthentication();

  const handleSignInBroker = useCallback(() => {
    logOut();
  }, [logOut]);

  return (
    <Container>
      <FooterBox
        title="Corretora"
        description="Autentique-se na corretora para que seja possível fazer as operações em sua conta."
        footer={{
          hint: 'Suas credenciais ficam em seu dispositivo, seguras.',
          button: {
            text: 'Entrar',
            onClick: () => brokerFormRef.current?.submitForm(),
          },
        }}
      >
        <Form ref={brokerFormRef} onSubmit={handleSignInBroker}>
          <Select
            name="broker"
            icon={FiAirplay}
            options={[
              {
                value: 'iqoption',
                label: 'IQ Option',
              },
            ]}
            defaultValue={{
              value: 'iqoption',
              label: 'IQ Option',
            }}
            disabled
          />

          <Input
            name="email"
            label="E-mail"
            icon={FiUser}
            placeholder="joao@exemplo.com"
            containerProps={{
              style: {
                marginTop: 16,
              },
            }}
          />
        </Form>
      </FooterBox>
    </Container>
  );
};

export default Settings;
