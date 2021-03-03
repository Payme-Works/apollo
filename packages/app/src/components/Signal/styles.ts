import styled, { css } from 'styled-components';

import { Status } from '@/interfaces/signal/ISignalWithStatus';

interface IContainerProps {
  status: Status;
}

export const Container = styled.div<IContainerProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${({ theme, status }) => css`
    --color: ${theme.colors.foreground['accent-1']};
    --color-hover: ${theme.colors.foreground.base};

    --border-color: ${theme.colors.background['accent-2']};
    --border-color-hover: ${theme.colors.background['accent-3']};

    --gale-image-opacity: 0.8;
    --gale-image-opacity-hover: 1;

    ${(status === 'canceled' || status === 'expired') &&
    css`
      --color: ${theme.transparencies[3](theme.colors.foreground['accent-1'])};
      --color-hover: ${theme.colors.foreground['accent-1']};

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
    border-radius: ${theme.borderRadius.md};

    padding: ${theme.spaces[2]} ${theme.spaces[4]};

    transition: all 0.2s;

    & + ${Container} {
      margin-top: ${theme.spaces[4]};
    }

    &:hover {
      color: var(--color-hover);
      border-color: var(--border-color-hover);

      > div > ${GaleImage} {
        opacity: var(--gale-image-opacity-hover);
      }

      > button {
        color: ${theme.transparencies[3](theme.colors.foreground['accent-1'])};
      }
    }

    > div {
      display: flex;
      align-items: center;

      > img#gale {
        transition: all 0.2s;

        opacity: var(--gale-image-opacity);
      }
    }

    > button {
      background: none;
      border: 0;

      color: ${theme.transparencies[5](theme.colors.foreground['accent-1'])};
      font-size: ${theme.fonts.sizes.sm};

      transition: color 0.2s;

      &:hover {
        color: ${theme.colors.foreground['accent-1']};
      }
    }
  `}
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

export const GaleImage = styled.img`
  ${({ theme }) => css`
    height: ${theme.sizes[5]};
    margin-left: ${theme.spaces[4]};
  `}
`;
