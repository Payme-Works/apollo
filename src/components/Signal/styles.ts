import styled, { css } from 'styled-components';

import { Status } from '@/interfaces/signals/SignalWithStatus';

interface IContainerProps {
  status: Status;
}

export const Container = styled.div<IContainerProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 31.35%;
  flex-wrap: wrap;

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

    background-color: var(--border-color);

    margin-bottom: ${theme.spaces[2]};
    margin-left: ${theme.spaces[1]};
    margin-right: ${theme.spaces[1]};
    color: var(--color);

    border: 1px solid var(--border-color);
    border-radius: ${theme.borderRadius.md};

    transition: all 0.2s;

    .bar {
      width: 100%;
      display: flex;
      padding: 1px 5px;
      background-color: transparent;

      span {
        height: ${theme.sizes[5]};
        font-size: 12px;
        margin-left: auto;
        margin-right: 5px;
      }
    }

    .labels {
      display: flex;
      flex-wrap: wrap;
      width: 50%;
      justify-content: start;
    }

    .right {
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      margin-left: auto;

      > svg:only-child {
        margin-bottom: 27px;
      }
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
      padding: ${theme.spaces[2]} ${theme.spaces[2]};
      background: #000000;
      border-radius: ${theme.borderRadius.md};

      > img#gale {
        transition: all 0.2s;

        opacity: var(--gale-image-opacity);
      }
    }

    div > button {
      background: none;
      border: 0;
      height: 36px;
      width: 36px;
      margin: auto;
      border-radius: 50%;
      margin-top: 5px;
      background: #212121;

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
`;

export const GaleImage = styled.img`
  ${({ theme }) => css`
    height: ${theme.sizes[5]};
    width: ${theme.sizes[4]};
    margin: auto;
    margin-left: 1px;
    margin-right: 1px;
  `}
`;
