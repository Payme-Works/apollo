import styled, { css } from 'styled-components';

interface ILabelProps {
  size: 'md' | 'sm';
}

export const Container = styled.div`
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
      left: calc(100% - ${theme.sizes.px});
      transform: translateX(-100%);
    }
  `}
`;

export const Circle = styled.label<ILabelProps>`
  ${({ theme, size }) => css`
    cursor: pointer;
    text-indent: -9999px;

    ${size === 'sm' &&
    css`
      width: ${theme.sizes[9]};
      height: ${theme.sizes[5]};
    `}

    ${size === 'md' &&
    css`
      width: ${theme.sizes[10]};
      height: ${theme.sizes[6]};
    `}

    background: ${theme.colors.background['accent-2']};
    display: block;
    border-radius: 14px;
    position: relative;

    ::after {
      content: '';
      position: absolute;
      top: ${theme.sizes.px};
      left: ${theme.sizes.px};

      ${size === 'sm' &&
      css`
        width: ${theme.sizes[4.5]};
        height: ${theme.sizes[4.5]};
      `}

      ${size === 'md' &&
      css`
        width: ${theme.sizes[5.5]};
        height: ${theme.sizes[5.5]};
      `}

      background: ${theme.colors.background.base};
      border-radius: ${theme.sizes[24]};
      transition: 0.3s;
    }

    :active:after {
      ${size === 'sm' &&
      css`
        width: ${theme.sizes[5]};
      `}

      ${size === 'md' &&
      css`
        width: ${theme.sizes[6]};
      `}
    }
  `}
`;

export const Label = styled.label`
  ${({ theme }) => css`
    margin-left: ${theme.sizes[2]};
  `}
`;
