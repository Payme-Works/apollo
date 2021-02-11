import React from 'react';

import Button, { IButtonProps } from '@/components/Button';

import { Container, Content, Footer } from './styles';

interface IFooterBoxProps {
  title: string;
  description: string;
  footer: {
    hint: string;
    button: {
      text: string;
    } & IButtonProps;
  };
}

const FooterBox: React.FC<IFooterBoxProps> = ({
  title,
  description,
  footer,
  children,
}) => {
  return (
    <Container>
      <Content>
        <h1>{title}</h1>
        <p>{description}</p>

        {children}
      </Content>

      {footer && (
        <Footer>
          <p>{footer.hint}</p>

          <Button size="sm" {...footer.button}>
            {footer.button.text}
          </Button>
        </Footer>
      )}
    </Container>
  );
};

export default FooterBox;
