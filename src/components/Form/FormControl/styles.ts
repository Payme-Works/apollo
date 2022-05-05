import styled, { css } from 'styled-components';

interface IContainerProps {
  disabled: boolean;
}

export const Container = styled.div<IContainerProps>`
  width: 100%;

  ${({ theme }) => css`
    > p {
      color: ${theme.colors.foreground['accent-2']};
      font-size: ${theme.fonts.sizes.xs};
      margin-top: ${theme.spaces['1.5']};
    }
  `}

  ${({ disabled }) =>
    disabled &&
    css`
      cursor: not-allowed;

      * {
        cursor: not-allowed;
      }

      > #form-label label {
        opacity: 0.6;
      }
    `}
`;
