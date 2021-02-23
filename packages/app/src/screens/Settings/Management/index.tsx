import React, { useCallback, useMemo, useRef } from 'react';
import { FiClock, FiDollarSign } from 'react-icons/fi';

import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import FooterBox, { IFooterBoxProps } from '@/components/FooterBox';
import FormControl from '@/components/Form/FormControl';
import FormLabel from '@/components/Form/FormLabel';
import Input from '@/components/Form/Input';
import Select, { ISelectValue } from '@/components/Form/Select';
import SelectableInput, {
  ISelectableInputValue,
} from '@/components/Form/SelectableInput';
import getValidationErrors from '@/utils/getValidationErrors';

import { Flex } from './styles';

interface IManagementsFormData {
  stopGain: ISelectableInputValue;
  stopLoss: string;
  expirations: ISelectValue[];
  maximumPayments: string;
  minimumPayments: string;
}

const Management: React.FC<Partial<IFooterBoxProps>> = ({ ...rest }) => {
  const formRef = useRef<FormHandles>(null);

  const stopGainPriceOptions = useMemo(
    () => [
      {
        value: 'real',
        label: 'R$',
      },
    ],
    [],
  );

  const stopLossPriceOptions = useMemo(
    () => [
      {
        value: 'real',
        label: 'R$',
      },
    ],
    [],
  );

  const expirationOptions = useMemo(
    () => [
      {
        value: 'm5',
        label: 'M5',
      },
      {
        value: 'm15',
        label: 'M15',
      },
      {
        value: 'm30',
        label: 'M30',
      },
      {
        value: 'h1',
        label: 'H1',
      },
    ],
    [],
  );

  const handleSave = useCallback(
    async (data: IManagementsFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          stopGain: Yup.object()
            .shape({
              selected: Yup.object().shape({
                value: Yup.string()
                  .oneOf(stopGainPriceOptions.map(item => item.value))
                  .required(),
                label: Yup.string()
                  .oneOf(stopGainPriceOptions.map(item => item.label))
                  .required(),
              }),
              value: Yup.number()
                .typeError('Valor de stop gain deve ser um número')
                .required(),
            })
            .required('Valor da entrada obrigatório'),
          stopLoss: Yup.object()
            .shape({
              selected: Yup.object().shape({
                value: Yup.string()
                  .oneOf(stopLossPriceOptions.map(item => item.value))
                  .required(),
                label: Yup.string()
                  .oneOf(stopLossPriceOptions.map(item => item.label))
                  .required(),
              }),
              value: Yup.number()
                .typeError('Valor de stop loss deve ser um número')
                .required(),
            })
            .required('Valor da entrada obrigatório'),
          expirations: Yup.array()
            .of(
              Yup.object().shape({
                value: Yup.string()
                  .oneOf(expirationOptions.map(item => item.value))
                  .required(),
                label: Yup.string()
                  .oneOf(expirationOptions.map(item => item.label))
                  .required(),
              }),
            )
            .min(1, 'Expirações obrigatórias'),
          minimumPayout: Yup.string().required('Payout mínimo obrigatório.'),
          maximumPayout: Yup.string().required('Maximum payout obrigatório.'),
        });

        const transformedData = await schema.validate(data, {
          abortEarly: false,
        });

        console.log(transformedData);
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          console.log(errors);

          formRef.current?.setErrors(errors);

          return;
        }

        console.error(err);
      }
    },
    [expirationOptions, stopGainPriceOptions, stopLossPriceOptions],
  );

  return (
    <FooterBox
      title="Gerenciamento"
      description="Defina o seu limite para não cair na soberania do mercado."
      footer={{
        hint: 'Tome bastante cuidado com esses ajustes.',
        button: {
          text: 'Salvar',
          onClick: () => formRef.current?.submitForm(),
        },
      }}
      {...rest}
    >
      <Form ref={formRef} onSubmit={handleSave}>
        <Flex>
          <FormControl
            style={{
              width: '47%',
            }}
          >
            <FormLabel>Stop gain</FormLabel>
            <SelectableInput
              name="stopGain"
              icon={FiDollarSign}
              selectProps={{
                options: stopGainPriceOptions,
                defaultValue: {
                  value: 'real',
                  label: 'R$',
                },
              }}
              inputProps={{
                placeholder: '20,00',
                defaultValue: 20,
              }}
            />
          </FormControl>

          <FormControl
            style={{
              width: '47%',
            }}
          >
            <FormLabel>Stop loss</FormLabel>
            <SelectableInput
              name="stopLoss"
              icon={FiDollarSign}
              selectProps={{
                options: stopLossPriceOptions,
                defaultValue: {
                  value: 'real',
                  label: 'R$',
                },
              }}
              inputProps={{
                placeholder: '10,00',
                defaultValue: 10,
              }}
            />
          </FormControl>
        </Flex>

        <Flex style={{ marginTop: 16 }}>
          <FormControl
            style={{
              width: '100%',
            }}
          >
            <FormLabel>Expirações</FormLabel>
            <Select
              name="expirations"
              icon={FiClock}
              options={expirationOptions}
              isMulti
            />
          </FormControl>
        </Flex>

        <Flex style={{ marginTop: 16 }}>
          <FormControl
            style={{
              width: '47%',
            }}
          >
            <FormLabel>Payout mínimo</FormLabel>
            <Input name="minimumPayout" defaultValue="70%" />
          </FormControl>

          <FormControl
            style={{
              width: '47%',
            }}
          >
            <FormLabel>Payout máximo</FormLabel>
            <Input name="maximumPayout" defaultValue="95%" />
          </FormControl>
        </Flex>
      </Form>
    </FooterBox>
  );
};

export default Management;
