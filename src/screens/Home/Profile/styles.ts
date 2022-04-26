import styled, { css } from 'styled-components';

export const Container = styled.div`
  position: sticky;
  top: 0;

  display: flex;
  align-items: center;
  justify-content: space-between;

  z-index: 1000;

  backdrop-filter: blur(5px);

  ${({ theme }) => css`
    height: ${theme.sizes[32]};
    width: 100%;

    padding: 0 ${theme.spaces[8]};

    background: ${theme.transparencies[8](theme.colors.background.base)};
    border-bottom: 1px solid
      ${theme.transparencies[10](theme.colors.primary.base)};

    > svg {
      width: ${theme.sizes[9]};
      height: ${theme.sizes[9]};

      cursor: pointer;
      color: ${theme.colors.primary.base};
      opacity: 0.6;

      transition: opacity 0.2s;

      &:hover {
        opacity: 1;
      }
    }
  `}
`;

export const Flex = styled.div`
  display: flex;
  align-items: center;

  > div {
    margin-right: ${props => props.theme.spaces[9]};
  }
`;

interface IInfoProps {
  color: string;
}

export const Info = styled.dl<IInfoProps>`
  ${({ theme, ...props }) => css`
    cursor: default;

    > dt {
      color: ${theme.colors.foreground.base};
      font-weight: ${theme.fonts.weights.light};
      font-size: ${theme.fonts.sizes.xl};
    }

    > dd {
      color: ${props.color};
      font-size: ${theme.fonts.sizes['3xl']};

      #decimals {
        font-size: ${theme.fonts.sizes['2xl']};
      }

      .react-loading-skeleton {
        margin: 7px 0 5px;
      }
    }

    & + dl {
      margin-left: ${theme.spaces[8]};
    }
  `}
`;

export const DataTitle = styled.dt`
  display: flex;
  align-items: center;
  gap: 10px;
`;
