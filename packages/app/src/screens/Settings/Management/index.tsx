import React, { useCallback, useMemo, useRef, useState } from 'react';
import { FiDollarSign } from 'react-icons/fi';

import { FormHandles, Scope } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import FooterBox, { IFooterBoxProps } from '@/components/FooterBox';
import FormControl from '@/components/Form/FormControl';
import FormLabel from '@/components/Form/FormLabel';
import Input from '@/components/Form/Input';
import SelectableInput, {
  ISelectableInputValue,
} from '@/components/Form/SelectableInput';
import Switch from '@/components/Form/Switch';
import { useConfig } from '@/hooks/useConfig';
import getValidationErrors from '@/utils/getValidationErrors';

import { Flex } from './styles';

interface IManagementsFormData {
  orderPrice: ISelectableInputValue;
  martingale: {
    active: boolean;
    amount: string;
  };
  stopGain: ISelectableInputValue;
  stopLoss: ISelectableInputValue;
}

const Management: React.FC<Partial<IFooterBoxProps>> = ({ ...rest }) => {
  const formRef = useRef<FormHandles>(null);

  const { management, setConfig } = useConfig('robot');

  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [isMartingaleChecked, setIsMartingaleChecked] = useState(
    management.martingale.active,
  );

  const priceOptions = useMemo(
    () => [
      {
        value: 'real',
        label: 'R$',
      },
    ],
    [],
  );

  const handleSave = useCallback(
    async (data: IManagementsFormData) => {
      console.log(data);

      try {
        setIsButtonLoading(true);

        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          orderPrice: Yup.object()
            .shape({
              selected: Yup.object().shape({
                value: Yup.string()
                  .oneOf(priceOptions.map(item => item.value))
                  .required(),
                label: Yup.string()
                  .oneOf(priceOptions.map(item => item.label))
                  .required(),
              }),
              value: Yup.number()
                .typeError('Valor da entrada deve ser um número')
                .min(2, 'Valor da entrada deve ser no mínimo R$ 2,00')
                .max(20000, 'Valor da entrada máximo deve ser R$ 5.000,00')
                .required(),
            })
            .required('Valor da entrada obrigatório'),
          martingale: Yup.object().shape({
            active: Yup.boolean().required(),
            amount: Yup.number().when('martingale.active', {
              is: true,
              then: Yup.number()
                .positive()
                .transform((value, original) =>
                  original === '' ? undefined : value,
                )
                .min(1, 'Valor zero não permitido, desative o martingale')
                .max(3, 'É permitido no máximo 3 mãos de martingale')
                .required('Mãos de martingale obrigatório (1 a 3)')
                .label('_scope_'),
            }),
          }),
          stopGain: Yup.object()
            .shape({
              selected: Yup.object().shape({
                value: Yup.string()
                  .oneOf(priceOptions.map(item => item.value))
                  .required(),
                label: Yup.string()
                  .oneOf(priceOptions.map(item => item.label))
                  .required(),
              }),
              value: Yup.number()
                .typeError('Stop gain deve ser um número')
                .required('Stop gain obrigatório'),
            })
            .required('Valor da entrada obrigatório'),
          stopLoss: Yup.object()
            .shape({
              selected: Yup.object().shape({
                value: Yup.string()
                  .oneOf(priceOptions.map(item => item.value))
                  .required(),
                label: Yup.string()
                  .oneOf(priceOptions.map(item => item.label))
                  .required(),
              }),
              value: Yup.number()
                .typeError('Stop loss deve ser um número')
                .required('Stop loss obrigatório'),
            })
            .required('Valor da entrada obrigatório'),
        });

        const transformedData = await schema.validate(data, {
          abortEarly: false,
        });

        console.log(transformedData);
        setConfig('robot.management', transformedData);

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
        setTimeout(() => setIsButtonLoading(false), 1000);
      }
    },
    [priceOptions, setConfig],
  );

  const handleChange = useCallback(() => {
    setIsSaved(false);
  }, []);

  return (
    <FooterBox
      title="Gerenciamento"
      description="Usados para fazer as suas entradas de operações. Defina o seu limite para não cair na soberania do mercado."
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
      {...rest}
    >
      <Form ref={formRef} onSubmit={handleSave}>
        <FormControl>
          <FormLabel>Valor da entrada</FormLabel>
          <SelectableInput
            name="orderPrice"
            icon={FiDollarSign}
            selectProps={{
              options: priceOptions,
              defaultValue: management.orderPrice.selected,
            }}
            inputProps={{
              variant: 'number-format',
              placeholder: '2,00',
              fixedDecimalScale: true,
              defaultValue: management.orderPrice.value,
            }}
            onChange={handleChange}
          />
        </FormControl>

        <Scope path="martingale">
          <Flex style={{ marginTop: 16 }}>
            <FormControl
              style={{
                width: '47%',
              }}
            >
              <FormLabel>Martingale</FormLabel>
              <Switch
                name="active"
                showCheckedLabel
                defaultChecked={isMartingaleChecked}
                onChange={e => {
                  setIsMartingaleChecked(e.target.checked);

                  handleChange();
                }}
              />
            </FormControl>

            <FormControl
              disabled={!isMartingaleChecked}
              style={{
                width: '47%',
              }}
            >
              <FormLabel>Quantidade de martingale</FormLabel>
              <Input
                name="amount"
                variant="number-format"
                defaultValue={management.martingale.amount}
                decimalScale={0}
                allowNegative={false}
                isAllowed={({ floatValue }) =>
                  !floatValue || (floatValue >= 0 && floatValue <= 3)
                }
                onChange={handleChange}
              />
            </FormControl>
          </Flex>
        </Scope>

        <Flex style={{ marginTop: 16 }}>
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
                options: priceOptions,
                defaultValue: management.stopGain.selected,
              }}
              inputProps={{
                variant: 'number-format',
                placeholder: '20,00',
                fixedDecimalScale: true,
                defaultValue: management.stopGain.value,
              }}
              onChange={handleChange}
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
                options: priceOptions,
                defaultValue: management.stopLoss.selected,
              }}
              inputProps={{
                variant: 'number-format',
                placeholder: '10,00',
                fixedDecimalScale: true,
                defaultValue: management.stopLoss.value,
              }}
              onChange={handleChange}
            />
          </FormControl>
        </Flex>
      </Form>
    </FooterBox>
  );
};

export default Management;
