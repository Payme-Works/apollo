import styled, { css } from 'styled-components';

export const TooltipContainer = styled.div`
  ${({ theme }) => css`
    background-color: ${theme.colors.background['accent-2']};

    border: 1px solid ${theme.colors.background['accent-3']};
    border-radius: ${theme.sizes[1]};

    padding-top: ${theme.sizes[3]};
    padding-bottom: ${theme.sizes[3]};
    padding-right: ${theme.sizes[4]};
    padding-left: ${theme.sizes[4]};
  `}
`;

export const ButtonContainer = styled.div`
  display: inline-block;
`;

export const Arrow = styled.div`
  ${({ theme }) => css`
    width: 0;
    height: 0;

    border-left: ${theme.sizes[5]} solid transparent;
    border-right: ${theme.sizes[5]} solid transparent;
    border-top: ${theme.sizes[5]} solid ${theme.colors.background['accent-2']};
  `}
`;
