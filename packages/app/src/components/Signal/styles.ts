import styled, { css } from 'styled-components';

import { Status } from '@/context/signals';

interface IContainerProps {
  status: Status;
}

export const Container = styled.div<IContainerProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${({ theme, status }) => css`
    --color: ${theme.colors.foreground['accent-1']};
    --border-color: ${theme.colors.background['accent-2']};
    --border-color-hover: ${theme.colors.background['accent-3']};

    ${(status === 'canceled' || status === 'passed') &&
    css`
      --color: ${theme.transparencies[3](theme.colors.foreground['accent-1'])};
      --border-color: ${theme.colors.background['accent-1']};
      --border-color-hover: ${theme.colors.background['accent-2']};
    `}

    ${status === 'in_progress' &&
    css`
      --border-color: ${theme.colors.palette.yellow['accent-2']};
      --border-color-hover: ${theme.colors.palette.yellow['accent-1']};
    `}

    ${status === 'win' &&
    css`
      --border-color: ${theme.colors.palette.green['accent-2']};
      --border-color-hover: ${theme.colors.palette.green['accent-1']};
    `}

    ${status === 'loss' &&
    css`
      --border-color: ${theme.colors.palette.red['accent-2']};
      --border-color-hover: ${theme.colors.palette.red['accent-1']};
    `}

    color: var(--color);

    border: 1px solid var(--border-color);
    border-radius: ${theme.borderRadius.lg};

    padding: ${theme.spaces[2]} ${theme.spaces[4]};

    transition: all 0.2s;

    &:hover {
      border-color: var(--border-color-hover);
    }

    & + ${Container} {
      margin-top: ${theme.spaces[4]};
    }

    > #action {
      cursor: pointer;

      color: ${theme.transparencies[5](theme.colors.foreground['accent-1'])};
      font-size: ${theme.fonts.sizes.sm};

      transition: color 0.2s;

      &:hover {
        color: ${theme.colors.foreground['accent-1']};
      }
    }
  `}
`;

export const Flex = styled.div`
  display: flex;
  align-items: center;

  width: 100%;
`;

interface ILabelProps {
  width: string;
}

export const Label = styled.span<ILabelProps>`
  width: ${props => props.width};

  & + span {
    margin-left: ${props => props.theme.spaces[1]};
  }
`;
