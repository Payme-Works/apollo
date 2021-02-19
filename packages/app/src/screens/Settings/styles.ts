import styled, { css } from 'styled-components';

export const Container = styled.section`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;

    padding: ${theme.spaces[8]};

    > button#restore {
      margin-top: ${theme.spaces[6]};

      background: none;
      border: 0;
      outline: 0;

      color: ${theme.colors.foreground['accent-1']};

      transition: all 0.2s;

      cursor: pointer;

      :hover {
        color: ${theme.colors.foreground.base};
      }
    }
  `}
`;
