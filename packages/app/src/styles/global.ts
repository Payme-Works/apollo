import styled, { createGlobalStyle, css } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root {
    font-size: 60%;
  }

  @media (min-width: 600px) {
    :root {
      font-size: 62.5%;
    }
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: 0;
  }

  body {
    color: ${props => props.theme.colors.foreground.base};
    background: transparent;
    -webkit-font-smoothing: antialiased;
  }

  body, input, button {
    ${({ theme }) => css`
      font-family: ${theme.fonts.families.body};
      font-size: ${theme.fonts.sizes.md};
      font-weight: ${theme.fonts.weights.regular};
    `}
  }

  strong, h1, h2, h3, h4, h5, h6 {
    ${({ theme }) => css`
      font-family: ${theme.fonts.families.heading};
      font-weight: ${theme.fonts.weights.bold};
    `}
  }

  button {
    cursor: pointer;
  }

  ::-webkit-scrollbar {
    width: 8px;

    background: rgba(255, 255, 255, 0.05);
  }

  ::-webkit-scrollbar-track {
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const Window = styled.div`
  display: flex;
  flex-direction: column;

  width: 100vw;
  height: 100vh;

  overflow: hidden;

  ${({ theme }) => css`
    background: ${theme.colors.background.base};
    border: 1px solid ${theme.transparencies[10](theme.colors.primary.base)};
    border-radius: 8px;
  `}
`;
