import { animated } from 'react-spring';

import styled, { css } from 'styled-components';

export const Container = styled(animated.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;

  overflow: hidden;

  ${({ theme }) => css`
    background: ${theme.colors.palette.red.base};

    border-radius: ${theme.borderRadius.md};

    > div {
      margin-left: ${theme.spaces[5]};

      > svg {
        cursor: pointer;

        width: ${theme.sizes[4]};
        height: ${theme.sizes[4]};

        color: ${theme.transparencies[2](theme.colors.foreground.base)};

        transition: color 0.2s;

        &:hover {
          color: ${theme.colors.foreground.base};
        }
      }
    }
  `}
`;
