import styled, { css } from 'styled-components';

interface ILabelProps {
  size: 'md' | 's';
}

export const Checkbox = styled.input`
  ${({ theme }) => css`
    height: 0;
    width: 0;
    visibility: hidden;

    :checked + label {
      background: ${theme.colors.palette.green.base};
    }

    :checked + label:after {
      left: calc(100% - 5px);
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
      width: 40px;
      height: 20px;
    `}

    ${size === 'md' &&
    css`
      width: 50px;
      height: 25px;
    `}

    background: ${theme.colors.background['accent-2']};
    display: block;
    border-radius: 100px;
    position: relative;

    ::after {
      content: '';
      position: absolute;
      top: 5px;
      left: 5px;

      ${size === 's' &&
      css`
        width: 12px;
        height: 12px;
      `}

      ${size === 'md' &&
      css`
        width: 17px;
        height: 17px;
      `}

      background: ${theme.colors.background.base};
      border-radius: 90px;
      transition: 0.3s;
    }

    :active:after {
      width: 30px;
    }
  `}
`;
