import styled, { css } from 'styled-components';

interface ILabelProps {
  size: 'md' | 's';
}

export const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const Checkbox = styled.input`
  ${({ theme }) => css`
    height: 0;
    width: 0;
    visibility: hidden;

    :checked + label {
      background: ${theme.colors.palette.green.base};
    }

    :checked + label:after {
      left: calc(100% - ${theme.sizes[1.5]});
      transform: translateX(-100%);
    }
  `}
`;

export const Label = styled.label<ILabelProps>`
  ${({ theme, size }) => css`
    cursor: pointer;
    text-indent: -9999px;

    ${size === 's' &&
    css`
      width: ${theme.sizes[10]};
      height: ${theme.sizes[5]};
    `}

    ${size === 'md' &&
    css`
      width: ${theme.sizes[12]};
      height: ${theme.sizes[6]};
    `}

    background: ${theme.colors.background['accent-2']};
    display: block;
    border-radius: 100px;
    position: relative;

    ::after {
      content: '';
      position: absolute;
      top: ${theme.sizes[1]};
      left: ${theme.sizes[1]};

      ${size === 's' &&
      css`
        width: ${theme.sizes[3]};
        height: ${theme.sizes[3]};
      `}

      ${size === 'md' &&
      css`
        width: ${theme.sizes[4]};
        height: ${theme.sizes[4]};
      `}

      background: ${theme.colors.background.base};
      border-radius: ${theme.sizes[24]};
      transition: 0.3s;
    }

    :active:after {
      width: ${theme.sizes[5]};
    }
  `}
`;

export const SwitchStatus = styled.label`
  ${({ theme }) => css`
    margin-left: ${theme.sizes[1.5]};
  `}
`;
