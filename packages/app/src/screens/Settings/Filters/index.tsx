import React, { useCallback, useMemo, useRef, useState } from 'react';
import { FiBarChart2, FiClock } from 'react-icons/fi';

import { FormHandles, Scope } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import FooterBox, { IFooterBoxProps } from '@/components/FooterBox';
import FormControl from '@/components/Form/FormControl';
import FormLabel from '@/components/Form/FormLabel';
import Input from '@/components/Form/Input';
import Select, { ISelectValue } from '@/components/Form/Select';
import Switch from '@/components/Form/Switch';
import { useConfig } from '@/hooks/useConfig';
import getValidationErrors from '@/utils/getValidationErrors';

import { Flex } from './styles';

interface IFiltersFormData {
  expirations: ISelectValue[];
  parallelOrders: boolean;
  operationType: ISelectValue;
  maximumPayments: string;
  minimumPayments: string;
}

const Filters: React.FC<Partial<IFooterBoxProps>> = ({ ...rest }) => {
  const formRef = useRef<FormHandles>(null);

  const [
    {
      current: { filters },
    },
    { setConfig },
  ] = useConfig('robot');

  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [isRandomSkipSignalsChecked, setIsRandomSkipSignalsChecked] = useState(
    filters.randomSkipSignals.active,
  );

  const expirationOptions = useMemo(
    () => [
      {
        value: 'm1',
        label: 'M1',
      },
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
    async (data: IFiltersFormData) => {
      try {
        setIsButtonLoading(true);

        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
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
            .min(1, 'Mínimo de 1 expiração obrigatória'),
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
          payout: Yup.object()
            .shape({
              minimum: Yup.number().required('Payout mínimo obrigatório'),
              maximum: Yup.number().required('Payout máximo obrigatório'),
            })
            .required('Payout obrigatório'),
          filterTrend: Yup.boolean().required(),
          parallelOrders: Yup.boolean().required(),
          randomSkipSignals: Yup.object().shape({
            active: Yup.boolean().required(),
            chancePercentage: Yup.number().when('randomSkipSignals.active', {
              is: true,
              then: Yup.number()
                .positive()
                .max(100, 'É permitido no máximo 100% de chance')
                .transform((value, original) =>
                  original === '' ? undefined : value,
                )
                .required('Porcentagem de chance obrigatória')
                .label('_scope_'),
            }),
          }),
        });

        const transformedData = await schema.validate(data, {
          abortEarly: false,
        });

        setConfig('robot.filters', transformedData);

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
    [expirationOptions, operationTypeOptions, setConfig],
  );

  const handleChange = useCallback(() => {
    setIsSaved(false);
  }, []);

  return (
    <FooterBox
      title="Filtros"
      description="Usados para fazer as suas entradas de operações."
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
          <FormLabel>Expirações</FormLabel>
          <Select
            name="expirations"
            icon={FiClock}
            isMulti
            options={expirationOptions}
            defaultValue={filters.expirations}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl style={{ marginTop: 16 }}>
          <FormLabel>Tipo de operação</FormLabel>
          <Select
            name="operationType"
            icon={FiBarChart2}
            options={operationTypeOptions}
            defaultValue={filters.operationType}
            onChange={handleChange}
          />
        </FormControl>

        <Flex style={{ marginTop: 16 }}>
          <Scope path="payout">
            <FormControl
              style={{
                width: '47%',
              }}
            >
              <FormLabel>Payout mínimo</FormLabel>
              <Input
                name="minimum"
                variant="number-format"
                suffix="%"
                defaultValue={filters.payout.minimum}
                allowNegative={false}
                isAllowed={({ floatValue }) =>
                  !floatValue || (floatValue >= 0 && floatValue <= 100)
                }
                onChange={handleChange}
              />
            </FormControl>

            <FormControl
              style={{
                width: '47%',
              }}
            >
              <FormLabel>Payout máximo</FormLabel>
              <Input
                name="maximum"
                variant="number-format"
                suffix="%"
                defaultValue={filters.payout.maximum}
                allowNegative={false}
                isAllowed={({ floatValue }) =>
                  !floatValue || (floatValue >= 0 && floatValue <= 100)
                }
                onChange={handleChange}
              />
            </FormControl>
          </Scope>
        </Flex>

        <Flex style={{ marginTop: 16 }}>
          <FormControl style={{ width: '47%' }}>
            <FormLabel>Filtrar tendência</FormLabel>
            <Switch
              name="filterTrend"
              showCheckedLabel
              defaultChecked={filters.filterTrend}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl style={{ width: '47%' }}>
            <FormLabel>Ordens em paralelo</FormLabel>
            <Switch
              name="parallelOrders"
              showCheckedLabel
              defaultChecked={filters.parallelOrders}
              onChange={handleChange}
            />
          </FormControl>
        </Flex>

        <Flex style={{ marginTop: 16 }}>
          <Scope path="randomSkipSignals">
            <FormControl
              style={{
                width: '47%',
              }}
            >
              <FormLabel>Pular sinais aleatóriamente</FormLabel>
              <Switch
                name="active"
                showCheckedLabel
                defaultChecked={isRandomSkipSignalsChecked}
                onChange={e => {
                  setIsRandomSkipSignalsChecked(e.target.checked);

                  handleChange();
                }}
              />
            </FormControl>

            <FormControl
              disabled={!isRandomSkipSignalsChecked}
              style={{
                width: '47%',
              }}
            >
              <FormLabel>Porcentagem de chance</FormLabel>
              <Input
                name="chancePercentage"
                variant="number-format"
                suffix="%"
                defaultValue={filters.randomSkipSignals.chancePercentage}
                allowNegative={false}
                isAllowed={({ floatValue }) =>
                  !floatValue || (floatValue >= 0 && floatValue <= 100)
                }
                onChange={handleChange}
              />
            </FormControl>
          </Scope>
        </Flex>
      </Form>
    </FooterBox>
  );
};

export default Filters;
