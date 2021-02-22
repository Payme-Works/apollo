import styled, { css } from 'styled-components';

interface ContainerProps {
  isDisabled: boolean;
  isMenuOpen: boolean;
  isFocused: boolean;
  isFilled: boolean;
  hasIcon: boolean;
}

export const Container = styled.span<ContainerProps>`
  ${({ theme, isDisabled, isFocused, isFilled, isMenuOpen, hasIcon }) => css`
    position: relative;

    display: flex;
    align-items: center;

    height: ${theme.sizes[9]};

    background: ${theme.colors.palette.transparent};
    border: 1px solid ${theme.colors.background['accent-2']};
    border-radius: ${theme.borderRadius.md};

    transition: border 0.2s;

    ${isDisabled &&
    css`
      cursor: not-allowed;
      opacity: 0.6;
    `}

    ${isFocused &&
    css`
      border-color: ${theme.colors.primary['accent-1']};
    `}

    > div#react-select {
      flex: 1;
      width: 100%;
      height: 100%;

      background: ${theme.colors.palette.transparent};

      &:disabled {
        cursor: not-allowed;
      }

      > div[class*='control'] {
        min-height: auto;
        height: 100%;

        align-items: unset;

        background-color: ${theme.colors.palette.transparent};
        box-shadow: none;
        border-width: 0;

        cursor: pointer;

        :hover {
          border-color: 0;
        }

        > div[class*='ValueContainer'] {
          height: 100%;

          ${hasIcon &&
          css`
            padding-left: ${theme.spaces[10]};
          `}

          > div[class*='singleValue'] {
            color: ${theme.colors.foreground['accent-1']};

            ${isFilled &&
            css`
              color: ${theme.colors.foreground.base};
            `}
          }

          > div[class*='multiValue'] {
            margin: 0;

            justify-content: space-between;

            background-color: ${theme.colors.palette.transparent};
            border: 1px solid ${theme.colors.foreground['accent-2']};

            border-radius: ${theme.borderRadius.sm};

            transition: border-color 0.2s;

            :hover {
              border-color: ${theme.colors.foreground['accent-1']};
            }

            + div[class*='multiValue'] {
              margin-left: ${theme.spaces[1.5]};
            }

            > div {
              color: ${theme.colors.foreground.base};

              + div {
                border-radius: 0;
                background-color: ${theme.colors.palette.transparent};

                :hover {
                  background-color: ${theme.colors.palette.transparent};
                  color: ${theme.colors.foreground['accent-1']};
                }
              }
            }
          }
        }

        > div[class*='IndicatorsContainer'] {
          height: '100%';

          & > span[class*='indicatorSeparator'] {
            transition: all 0.15s;

            background-color: ${isMenuOpen
              ? theme.colors.primary['accent-1']
              : theme.colors.background['accent-2']};
          }

          & > div[class*='indicatorContainer'] {
            color: ${isMenuOpen
              ? theme.colors.primary['accent-1']
              : theme.colors.background['accent-2']};

            :hover {
              color: ${isMenuOpen
                ? theme.colors.primary['accent-1']
                : theme.colors.background['accent-2']};
            }
          }
        }
      }

      > div[class*='menu'] {
        background-color: ${theme.colors.background.base};
        border: 1px solid ${theme.colors.background['accent-2']};

        > div[class*='MenuList'] > div[class*='option'] {
          background-color: ${theme.colors.background['accent-1']};

          :hover {
            background-color: ${theme.colors.background['accent-2']};
          }
        }
      }
    }

    > svg {
      width: ${theme.sizes[5]};
      height: ${theme.sizes[5]};

      cursor: pointer;

      ${isDisabled &&
      css`
        cursor: not-allowed;
      `}
    }

    > svg#icon {
      position: absolute;
      left: ${theme.spaces[3]};

      z-index: ${theme.zIndices.overSelect};

      color: ${theme.colors.foreground['accent-2']};

      margin-right: ${theme.spaces[2]};

      ${(isFocused || isFilled) &&
      css`
        color: ${theme.colors.foreground['accent-1']};
      `}
    }

    > svg#icon-alert {
      position: absolute;
      right: ${theme.spaces[3]};

      color: ${theme.colors.palette.red.base};

      margin-left: ${theme.spaces[2]};
    }
  `}
`;
