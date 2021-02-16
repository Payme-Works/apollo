import styled, { css } from 'styled-components';

interface IContainerProps {
  disabled: boolean;
}

export const Container = styled.div<IContainerProps>`
  width: 100%;

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
