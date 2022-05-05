import React, { useCallback, useMemo, useRef, useState } from 'react';

import { FormHandles, Scope } from '@unform/core';
import { Form } from '@unform/web';
import { FiDollarSign } from 'react-icons/fi';
import * as Yup from 'yup';

import { FooterBox, IFooterBoxProps } from '@/components/FooterBox';
import { FormControl } from '@/components/Form/FormControl';
import { FormLabel } from '@/components/Form/FormLabel';
import { Input } from '@/components/Form/Input';
import {
  SelectableInput,
  ISelectableInputValue,
} from '@/components/Form/SelectableInput';
import { Switch } from '@/components/Form/Switch';
import { useConfig } from '@/hooks/useConfig';
import { formatPrice } from '@/utils/formatPrice';
import { getValidationErrors } from '@/utils/getValidationErrors';

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

export function Management({ ...rest }: Partial<IFooterBoxProps>) {
  const formRef = useRef<FormHandles>(null);

  const [
    {
      current: { management, filters },
    },
    { setConfig },
  ] = useConfig('robot');

  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [orderPrice, setOrderPrice] = useState<ISelectableInputValue>({
    selected: management.orderPrice.selected,
    value: management.orderPrice.value,
  });
  const [isMartingaleChecked, setIsMartingaleChecked] = useState(
    management.martingale.active,
  );
  const [martingaleAmount, setMartingaleAmount] = useState(
    management.martingale.amount,
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

  const minimumBalanceAccordingToMartingale = useMemo(() => {
    const minimumPayoutPercentage = filters.payout.minimum / 100;

    let value = Number(orderPrice.value);

    for (let i = 0; i < martingaleAmount; i += 1) {
      value += value / minimumPayoutPercentage + value;
    }

    return formatPrice(value);
  }, [filters.payout.minimum, martingaleAmount, orderPrice.value]);

  const handleSave = useCallback(
    async (data: IManagementsFormData) => {
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
          recoverLostOrder: Yup.boolean().required(),
          martingale: Yup.object().shape({
            active: Yup.boolean().required(),
            amount: Yup.number().when('martingale.active', {
              is: true,
              then: Yup.number()
                .positive()
                .transform((value, original) =>
                  original === '' ? undefined : value,
                )
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
        setTimeout(() => setIsButtonLoading(false), 500);
      }
    },
    [priceOptions, setConfig],
  );

  const handleChange = useCallback(() => {
    setIsSaved(false);
  }, []);

  return (
    <FooterBox
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
      title="Gerenciamento"
      {...rest}
    >
      <Form ref={formRef} onSubmit={handleSave}>
        <Flex>
          <FormControl
            style={{
              width: '47%',
            }}
          >
            <FormLabel>Valor da entrada</FormLabel>

            <SelectableInput
              icon={FiDollarSign}
              inputProps={{
                variant: 'currency',
                defaultValue: orderPrice.value,
              }}
              name="orderPrice"
              onChange={value => {
                setOrderPrice(value);

                handleChange();
              }}
              selectProps={{
                options: priceOptions,
                defaultValue: orderPrice.selected,
              }}
            />
          </FormControl>

          <FormControl
            style={{
              width: '47%',
            }}
          >
            <FormLabel>Recuperar ultimo loss</FormLabel>

            <Switch
              defaultChecked={management.recoverLostOrder}
              name="recoverLostOrder"
              onChange={handleChange}
              showCheckedLabel
            />
          </FormControl>
        </Flex>

        <Flex style={{ marginTop: 16 }}>
          <Scope path="martingale">
            <FormControl
              style={{
                width: '47%',
              }}
            >
              <FormLabel>Martingale</FormLabel>

              <Switch
                defaultChecked={isMartingaleChecked}
                name="active"
                onChange={e => {
                  setIsMartingaleChecked(e.target.checked);

                  handleChange();
                }}
                showCheckedLabel
              />
            </FormControl>

            <FormControl
              disabled={!isMartingaleChecked}
              hint={`Seu saldo precisa ser de no minimo ${minimumBalanceAccordingToMartingale}`}
              style={{
                width: '47%',
              }}
            >
              <FormLabel>Quantidade de martingale</FormLabel>

              <Input
                allowNegative={false}
                decimalScale={0}
                defaultValue={martingaleAmount}
                name="amount"
                onChange={value => {
                  setMartingaleAmount(value);

                  handleChange();
                }}
                variant="number-format"
              />
            </FormControl>
          </Scope>
        </Flex>

        <Flex style={{ marginTop: 16 }}>
          <FormControl
            style={{
              width: '47%',
            }}
          >
            <FormLabel>Stop gain</FormLabel>

            <SelectableInput
              icon={FiDollarSign}
              inputProps={{
                variant: 'currency',
                defaultValue: management.stopGain.value,
              }}
              name="stopGain"
              onChange={handleChange}
              selectProps={{
                options: priceOptions,
                defaultValue: management.stopGain.selected,
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
              icon={FiDollarSign}
              inputProps={{
                variant: 'currency',
                defaultValue: management.stopLoss.value,
              }}
              name="stopLoss"
              onChange={handleChange}
              selectProps={{
                options: priceOptions,
                defaultValue: management.stopLoss.selected,
              }}
            />
          </FormControl>
        </Flex>
      </Form>
    </FooterBox>
  );
}
