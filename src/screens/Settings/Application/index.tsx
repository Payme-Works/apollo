import React, { useCallback, useMemo, useRef, useState } from 'react';

import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { FiClock, FiMoon } from 'react-icons/fi';
import * as Yup from 'yup';

import { FooterBox, IFooterBoxProps } from '@/components/FooterBox';
import { FormControl } from '@/components/Form/FormControl';
import { FormLabel } from '@/components/Form/FormLabel';
import { Select, ISelectValue } from '@/components/Form/Select';
import { Switch } from '@/components/Form/Switch';
import { useConfig } from '@/hooks/useConfig';
import { getValidationErrors } from '@/utils/getValidationErrors';

import timezones from './timezones.json';

import { Flex } from './styles';

interface IApplicationFormData {
  timezone: ISelectValue;
  theme: ISelectValue;
  notification: boolean;
  updates: boolean;
}

export function Application({ ...rest }: Partial<IFooterBoxProps>) {
  const formRef = useRef<FormHandles>(null);

  const [
    {
      current: { application },
    },
    { setConfig },
  ] = useConfig('robot');

  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const times = timezones.sort((a, b) => {
    return a.value.localeCompare(b.value);
  });

  const timezoneOptions = useMemo((): ISelectValue[] => times, [times]);

  const themeOptions = useMemo(
    (): ISelectValue[] => [
      {
        value: 'dark',
        label: 'Escuro',
      },
      {
        value: 'light',
        label: 'Claro',
      },
    ],
    [],
  );

  const handleSave = useCallback(
    async (data: IApplicationFormData) => {
      try {
        setIsButtonLoading(true);

        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          timezone: Yup.object()
            .shape({
              value: Yup.string()
                .oneOf(timezoneOptions.map(item => item.value))
                .required(),
              label: Yup.string()
                .oneOf(timezoneOptions.map(item => item.label))
                .required(),
            })
            .required('Fuso horário obrigatório'),
          theme: Yup.object()
            .shape({
              value: Yup.string()
                .oneOf(themeOptions.map(item => item.value))
                .required(),
              label: Yup.string()
                .oneOf(themeOptions.map(item => item.label))
                .required(),
            })
            .required('Tema obrigatório'),
          notifications: Yup.boolean().required(),
          updates: Yup.boolean().required(),
        });

        const transformedData = await schema.validate(data, {
          abortEarly: false,
        });

        setConfig('robot.application', transformedData);

        setIsSaved(true);
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          console.log(errors);

          formRef.current?.setErrors(errors);

          return;
        }

        console.error(err);
      } finally {
        setTimeout(() => setIsButtonLoading(false), 500);
      }
    },
    [setConfig, themeOptions, timezoneOptions],
  );

  const handleChange = useCallback(() => {
    setIsSaved(false);
  }, []);

  return (
    <FooterBox
      description="Esses são os meus ajustes. Quem está falando é o... Apollo :D"
      footer={{
        hint: 'Recomendável que deixe esses ajustes padrão.',
        button: {
          text: isSaved ? 'Salvo!' : 'Salvar',
          variant: isSaved ? 'outline' : 'solid',
          loading: isButtonLoading,
          disabled: isSaved,
          disableHover: isSaved,
          onClick: () => formRef.current?.submitForm(),
        },
      }}
      title="Ajustes do aplicativo"
      {...rest}
    >
      <Form ref={formRef} onSubmit={handleSave}>
        <Flex>
          <FormControl
            style={{
              width: '47%',
            }}
          >
            <FormLabel>Fuso horário</FormLabel>

            <Select
              defaultValue={application.timezone}
              icon={FiClock}
              name="timezone"
              onChange={handleChange}
              options={timezoneOptions}
            />
          </FormControl>

          <Flex style={{ width: '47%' }}>
            <FormControl
              style={{
                width: '47%',
              }}
            >
              <FormLabel>Notificações</FormLabel>

              <Switch
                defaultChecked={application.notifications}
                name="notifications"
                onChange={handleChange}
                showCheckedLabel
              />
            </FormControl>

            <FormControl
              style={{
                width: '47%',
              }}
            >
              <FormLabel>Atualizações</FormLabel>

              <Switch
                defaultChecked={application.updates}
                name="updates"
                onChange={handleChange}
                showCheckedLabel
              />
            </FormControl>
          </Flex>
        </Flex>

        <FormControl style={{ marginTop: 16, width: '47%' }}>
          <FormLabel>Tema</FormLabel>

          <Select
            defaultValue={application.theme}
            icon={FiMoon}
            name="theme"
            onChange={handleChange}
            options={themeOptions}
          />
        </FormControl>
      </Form>
    </FooterBox>
  );
}
