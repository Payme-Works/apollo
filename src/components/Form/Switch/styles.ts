import styled, { css } from 'styled-components';

export const Container = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: center;

    cursor: pointer;

    #form-label + & {
      margin-top: ${theme.spaces[4]};
    }
  `}
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
    position: relative;

    display: block;

    background: ${theme.colors.background['accent-2']};
    border-radius: 14px;

    cursor: pointer;
    text-indent: -9999px;

    transition-property: all;
    transition-delay: 0.12s;
    transition-duration: 0.2s;
    transition-timing-function: cubic-bezier(0, 0, 0.2, 1);

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

    ::after {
      content: '';

      position: absolute;
      top: ${theme.spaces.px};
      left: ${theme.spaces.px};

      background: ${theme.colors.background.base};
      border-radius: ${theme.sizes[24]};

      transition: all 0.4s;

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
    }
  `}
`;

interface ILabelProps {
  size: 'md' | 'sm';
}

export const Label = styled.label`
  ${({ theme }) => css`
    margin-left: ${theme.spaces[3]};

    cursor: pointer;
  `}
`;
