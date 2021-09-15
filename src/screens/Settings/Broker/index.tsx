import React, { useCallback, useRef } from 'react';

import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { FiAirplay, FiLock, FiUser } from 'react-icons/fi';

import { FooterBox, IFooterBoxProps } from '@/components/FooterBox';
import { FormControl } from '@/components/Form/FormControl';
import { FormLabel } from '@/components/Form/FormLabel';
import { Input } from '@/components/Form/Input';
import { Select, ISelectValue } from '@/components/Form/Select';
import { useAuth } from '@/context/AuthContext';

interface IBrokerFormData {
  broker: ISelectValue;
  email: string;
}

export function Broker({ ...rest }: Partial<IFooterBoxProps>) {
  const formRef = useRef<FormHandles>(null);

  const { logOut } = useAuth();

  const handleSignInBroker = useCallback(
    (data: IBrokerFormData) => {
      console.log(data);

      logOut();
    },
    [logOut],
  );

  return (
    <FooterBox
      description="Autentique-se na corretora para que seja possível fazer as operações em sua conta."
      footer={{
        hint: 'Suas credenciais ficam em seu dispositivo, seguras.',
        button: {
          text: 'Entrar',
          onClick: () => formRef.current?.submitForm(),
        },
      }}
      title="Corretora"
      {...rest}
    >
      <Form ref={formRef} onSubmit={handleSignInBroker}>
        <Select
          defaultValue={{
            value: 'iqoption',
            label: 'IQ Option',
          }}
          disabled
          icon={FiAirplay}
          name="broker"
          options={[
            {
              value: 'iqoption',
              label: 'IQ Option',
            },
          ]}
        />

        <FormControl
          style={{
            marginTop: 16,
          }}
        >
          <FormLabel>E-mail</FormLabel>

          <Input
            icon={FiUser}
            name="email"
            placeholder="joao@exemplo.com"
            type="email"
          />
        </FormControl>

        <FormControl
          style={{
            marginTop: 16,
          }}
        >
          <FormLabel>Senha</FormLabel>

          <Input
            icon={FiLock}
            name="password"
            placeholder="••••••"
            type="password"
          />
        </FormControl>
      </Form>
    </FooterBox>
  );
}
