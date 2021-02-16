import React, { useCallback, useRef } from 'react';
import { FiBarChart2, FiDollarSign } from 'react-icons/fi';

import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import FooterBox, { IFooterBoxProps } from '@/components/FooterBox';
import Select, { ISelectValue } from '@/components/Form/Select';
import SelectableInput, {
  ISelectableInputValue,
} from '@/components/Form/SelectableInput';

import { Flex } from './styles';

interface IMainAdjustmentsFormData {
  order_price: ISelectableInputValue;
  operation_type: ISelectValue;
}

const MainAdjustments: React.FC<Partial<IFooterBoxProps>> = ({ ...rest }) => {
  const mainAdjustmentsFormRef = useRef<FormHandles>(null);

  const handleSave = useCallback((data: IMainAdjustmentsFormData) => {
    console.log(data);
  }, []);

  return (
    <FooterBox
      title="Ajustes principais"
      description="Usados para fazer as suas entradas de operações."
      footer={{
        hint: 'Tome bastante cuidado com esses ajustes.',
        button: {
          text: 'Salvar',
          onClick: () => mainAdjustmentsFormRef.current?.submitForm(),
        },
      }}
      {...rest}
    >
      <Form ref={mainAdjustmentsFormRef} onSubmit={handleSave}>
        <Flex style={{ marginTop: 16 }}>
          <SelectableInput
            name="order_price"
            label="Valor da entrada"
            icon={FiDollarSign}
            containerProps={{
              style: {
                width: '47%',
              },
            }}
            selectProps={{
              options: [
                {
                  value: 'real',
                  label: 'R$',
                },
              ],
              defaultValue: {
                value: 'real',
                label: 'R$',
              },
            }}
            inputProps={{
              placeholder: '2,00',
            }}
          />

          <Select
            name="operation_type"
            label="Tipo de operação"
            icon={FiBarChart2}
            options={[
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
            ]}
            defaultValue={{
              value: 'all',
              label: 'Todos',
            }}
            containerProps={{
              style: {
                width: '47%',
              },
            }}
          />
        </Flex>
      </Form>
    </FooterBox>
  );
};

export default MainAdjustments;
