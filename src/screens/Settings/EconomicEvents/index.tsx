import React, { useCallback, useRef, useState } from 'react';

import { FiClock } from 'react-icons/fi';

import { FormHandles, Scope } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import FooterBox, { IFooterBoxProps } from '@/components/FooterBox';
import FormControl from '@/components/Form/FormControl';
import FormLabel from '@/components/Form/FormLabel';
import Input from '@/components/Form/Input';
import Switch from '@/components/Form/Switch';
import { useConfig } from '@/hooks/useConfig';
import getValidationErrors from '@/utils/getValidationErrors';

import { Flex } from './styles';

interface IEconomicEventsFormData {
  filter: boolean;
  minutes: {
    before: number;
    after: number;
  };
}

const EconomicEvents: React.FC<Partial<IFooterBoxProps>> = ({ ...rest }) => {
  const formRef = useRef<FormHandles>(null);

  const [
    {
      current: { economicEvents },
    },
    { setConfig },
  ] = useConfig('robot');

  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [isFilterChecked, setIsFilterChecked] = useState(economicEvents.filter);

  const handleSave = useCallback(
    async (data: IEconomicEventsFormData) => {
      try {
        setIsButtonLoading(true);

        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          filter: Yup.boolean().required(),
          minutes: Yup.object().when('filter', {
            is: true,
            then: Yup.object()
              .shape({
                before: Yup.number()
                  .transform((value, original) => {
                    return original === '' ? 0 : value;
                  })
                  .required('Minutos antes obrigatório')
                  .label('_scope_'),
                after: Yup.number()
                  .transform((value, original) => {
                    return original === '' ? 0 : value;
                  })
                  .required('Minutos depois obrigatório')
                  .label('_scope_'),
              })
              .required('Minutos obrigatórios'),
            otherwise: Yup.object().shape({
              before: Yup.number()
                .default(0)
                .transform((value, original) => {
                  return original === '' ? 0 : value;
                }),
              after: Yup.number()
                .default(0)
                .transform((value, original) => {
                  return original === '' ? 0 : value;
                }),
            }),
          }),
        });

        const transformedData = await schema.validate(data, {
          abortEarly: false,
        });

        setConfig('robot.economicEvents', transformedData);

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
    [setConfig],
  );

  const handleChange = useCallback(() => {
    setIsSaved(false);
  }, []);

  return (
    <FooterBox
      description="São eventos que acontecem diáriamente e que podem afetar o mercado no momento do mesmo. Caso ocorra um evento, esse ajuste irá ignorar as operações que ocorrerem em um intervalo de tempo do mesmo."
      footer={{
        hint: 'Tome bastante cuidado com esses ajustes.',
        button: {
          text: isSaved ? 'Salvo!' : 'Salvar',
          variant: isSaved ? 'outline' : 'solid',
          loading: isButtonLoading,
          disabled: isSaved,
          disableHover: isSaved,
          onClick: () => formRef.current?.submitForm(),
        },
      }}
      title="Eventos econômicos"
      {...rest}
    >
      <Form ref={formRef} onSubmit={handleSave}>
        <Flex>
          <FormControl
            style={{
              width: '28%',
            }}
          >
            <FormLabel>Filtrar</FormLabel>

            <Switch
              defaultChecked={isFilterChecked}
              name="filter"
              onChange={e => {
                setIsFilterChecked(e.target.checked);

                handleChange();
              }}
              showCheckedLabel
            />
          </FormControl>

          <Scope path="minutes">
            <FormControl
              disabled={!isFilterChecked}
              style={{
                width: '30%',
              }}
            >
              <FormLabel>Minutos antes</FormLabel>

              <Input
                allowNegative={false}
                defaultValue={economicEvents.minutes.before}
                icon={FiClock}
                isAllowed={({ floatValue }) =>
                  !floatValue || (floatValue >= 0 && floatValue <= 60)
                }
                name="before"
                onChange={handleChange}
                variant="number-format"
              />
            </FormControl>

            <FormControl
              disabled={!isFilterChecked}
              style={{
                width: '30%',
              }}
            >
              <FormLabel>Minutos depois</FormLabel>

              <Input
                allowNegative={false}
                defaultValue={economicEvents.minutes.after}
                icon={FiClock}
                isAllowed={({ floatValue }) =>
                  !floatValue || (floatValue >= 0 && floatValue <= 60)
                }
                name="after"
                onChange={handleChange}
                variant="number-format"
              />
            </FormControl>
          </Scope>
        </Flex>
      </Form>
    </FooterBox>
  );
};

export default EconomicEvents;
