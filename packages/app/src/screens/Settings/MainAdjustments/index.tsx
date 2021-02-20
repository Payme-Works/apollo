import React, { useCallback, useMemo, useRef, useState } from 'react';
import { FiBarChart2, FiDollarSign } from 'react-icons/fi';

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
import Switch from '@/components/Form/Switch';
import { useConfig } from '@/hooks/useConfig';
import getValidationErrors from '@/utils/getValidationErrors';

import { Flex } from './styles';

interface IMainAdjustmentsFormData {
  orderPrice: ISelectableInputValue;
  operationType: ISelectValue;
}

const MainAdjustments: React.FC<Partial<IFooterBoxProps>> = ({ ...rest }) => {
  const formRef = useRef<FormHandles>(null);

  const { mainAdjustments, setConfig } = useConfig('robot');

  const [isMartingaleChecked, setIsMartingaleChecked] = useState(
    mainAdjustments.martingale,
  );

  const orderPriceOptions = useMemo(
    () => [
      {
        value: 'real',
        label: 'R$',
      },
    ],
    [],
  );

  const operationTypeOptions = useMemo(
    () => [
      {
        value: 'all',
        label: 'Todos',
      },
      {
        value: 'binary',
        label: 'Opções binárias',
      },
      {
        value: 'digital',
        label: 'Opções digitais',
      },
    ],
    [],
  );

  const handleSave = useCallback(
    async (data: IMainAdjustmentsFormData) => {
      console.log(data);

      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          orderPrice: Yup.object()
            .shape({
              selected: Yup.object().shape({
                value: Yup.string()
                  .oneOf(orderPriceOptions.map(item => item.value))
                  .required(),
                label: Yup.string()
                  .oneOf(orderPriceOptions.map(item => item.label))
                  .required(),
              }),
              value: Yup.number()
                .typeError('Valor da entrada deve ser um número')
                .min(2, 'Valor da entrada deve ser no mínimo R$ 2,00')
                .max(20000, 'Valor da entrada máximo deve ser R$ 5.000,00')
                .required(),
            })
            .required('Valor da entrada obrigatório'),
          operationType: Yup.object()
            .shape({
              value: Yup.string()
                .oneOf(operationTypeOptions.map(item => item.value))
                .required(),
              label: Yup.string()
                .oneOf(operationTypeOptions.map(item => item.label))
                .required(),
            })
            .required('Tipo de operação obrigatório'),
          martingale: Yup.boolean().required(),
          martingaleAmount: Yup.number().when('martingale', {
            is: true,
            then: Yup.number()
              .positive()
              .transform((value, original) =>
                original === '' ? undefined : value,
              )
              .min(1, 'Valor zero não permitido, desative o martingale')
              .max(3, 'É permitido no máximo 3 mãos de martingale')
              .required('Mãos de martingale obrigatório (1 a 3)'),
          }),
        });

        const transformedData = await schema.validate(data, {
          abortEarly: false,
        });

        console.log(transformedData);
        setConfig('robot.mainAdjustments', transformedData);
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
    [operationTypeOptions, orderPriceOptions, setConfig],
  );

  return (
    <FooterBox
      title="Ajustes principais"
      description="Usados para fazer as suas entradas de operações."
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
            <FormLabel>Valor da entrada</FormLabel>
            <SelectableInput
              name="orderPrice"
              icon={FiDollarSign}
              selectProps={{
                options: orderPriceOptions,
                defaultValue: mainAdjustments.orderPrice.selected,
              }}
              inputProps={{
                variant: 'number-format',
                placeholder: '2,00',
                defaultValue: mainAdjustments.orderPrice.value,
              }}
            />
          </FormControl>

          <FormControl
            style={{
              width: '47%',
            }}
          >
            <FormLabel>Tipo de operação</FormLabel>
            <Select
              name="operationType"
              icon={FiBarChart2}
              options={operationTypeOptions}
              defaultValue={mainAdjustments.operationType}
            />
          </FormControl>
        </Flex>

        <Flex style={{ marginTop: 16 }}>
          <FormControl
            style={{
              width: '47%',
            }}
          >
            <FormLabel>Martingale</FormLabel>
            <Switch
              name="martingale"
              showCheckedLabel
              defaultChecked={isMartingaleChecked}
              onChange={e => setIsMartingaleChecked(e.target.checked)}
            />
          </FormControl>

          <FormControl
            disabled={!isMartingaleChecked}
            style={{
              width: '47%',
            }}
          >
            <FormLabel>Mãos de martingale</FormLabel>
            <Input
              name="martingaleAmount"
              variant="number-format"
              defaultValue={mainAdjustments.martingaleAmount}
              decimalScale={0}
              allowNegative={false}
              isAllowed={({ floatValue }) =>
                !floatValue || (floatValue >= 0 && floatValue <= 3)
              }
            />
          </FormControl>
        </Flex>
      </Form>
    </FooterBox>
  );
};

export default MainAdjustments;
