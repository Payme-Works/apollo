import styled, { css } from 'styled-components';

import defaultTheme from '@/styles/themes/default';

interface InputContainerProps {
  isFocused: boolean;
  isErrored: boolean;
}

export const Container = styled.div`
  flex: 1;
  margin-top: 16px;

  &:first-child {
    margin: 0;
  }

  input {
    width: 100%;
    border: 0;
    font-size: 16px;
    color: ${props => props.theme.colors.foreground.base};
    background: transparent;
    flex: 1;

    ::placeholder {
      color: ${({ theme }) => theme.colors.foreground['accent-1']};
    }

    &:disabled {
      cursor: not-allowed;
      color: ${({ theme }) => theme.colors.foreground['accent-1']};
    }
  }
`;

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin-bottom: 8px;

  small {
    font-size: 11px;
    line-height: 13px;
    margin-left: 8px;
  }

  label {
    display: block;
    color: ${props => props.theme.colors.foreground.base};
    font-size: 14px;
    font-weight: 600;
  }
`;

export const InputContainer = styled.span<InputContainerProps>`
  display: flex;
  align-items: center;

  height: 42px;
  border-radius: 4px;
  background: ${props => props.theme.colors.palette.transparent};
  border: 1px solid ${props => props.theme.colors.background['accent-2']};

  padding: 0 16px;

  transition: border 0.2s;

  svg {
    width: 20px;
    height: 20px;
    margin-left: 8px;
    color: ${defaultTheme.colors.palette.red.base};
  }

  ${props =>
    props.isErrored &&
    css`
      border-color: ${defaultTheme.colors.palette.red.base};
    `}

  ${props =>
    props.isFocused &&
    css`
      border-color: ${props.theme.colors.foreground.base};
      outline: 0;
    `}
`;
