import React from 'react';

import Button, { IButtonProps } from '@/components/Button';

import { Container, Content, Footer } from './styles';

export interface IFooterBoxProps {
  title: string;
  description: string;
  footer: {
    hint: string;
    button: {
      text: string;
    } & IButtonProps;
  };
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
}

const FooterBox: React.FC<IFooterBoxProps> = ({
  title,
  description,
  footer,
  containerProps,
  children,
}) => {
  return (
    <Container {...containerProps}>
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
