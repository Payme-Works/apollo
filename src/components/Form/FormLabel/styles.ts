import styled, { css } from 'styled-components';

export const Container = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: flex-end;

    margin-bottom: ${theme.spaces[2]};

    transition: all 0.2s;
  `}
`;

export const Label = styled.label`
  ${({ theme }) => css`
    color: ${theme.colors.foreground['accent-1']};
    font-size: ${theme.fonts.sizes.sm};
  `}
`;

export const Hint = styled.small`
  ${({ theme }) => css`
    color: ${theme.colors.foreground['accent-2']};
    font-size: ${theme.fonts.sizes.xs};

    margin-left: ${theme.spaces[2]};
  `}
`;
