import React, { useMemo, useRef } from 'react';
import { FiClock, FiDollarSign } from 'react-icons/fi';

import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
// import * as Yup from 'yup';

import FooterBox, { IFooterBoxProps } from '@/components/FooterBox';
import FormControl from '@/components/Form/FormControl';
import FormLabel from '@/components/Form/FormLabel';
import Select from '@/components/Form/Select';
import SelectableInput from '@/components/Form/SelectableInput';

import { Flex } from './styles';

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
      <Form
        ref={formRef}
        onSubmit={() => {
          console.log('hdfshj');
        }}
      >
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
              // defaultValue={mainAdjustments.operationType}
            />
          </FormControl>

          {/* <FormControl
            disabled={!isMartingaleChecked}
            style={{
              width: '47%',
            }}
          >
            <FormLabel>Mãos de martingale</FormLabel>
            <Input
              name="martingaleAmount"
              defaultValue={mainAdjustments.martingaleAmount}
            />
          </FormControl> */}
        </Flex>
      </Form>
    </FooterBox>
  );
};

export default Management;
