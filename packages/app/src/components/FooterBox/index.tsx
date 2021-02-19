import React, { useCallback, useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

import Button, { IButtonProps } from '@/components/Button';

import { Container, Content, Footer, HeaderContainer } from './styles';

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
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleUpdateCollapsable = useCallback(() => {
    setIsCollapsed(!isCollapsed);
  }, [isCollapsed]);

  return (
    <>
      <Container {...containerProps}>
        <Content>
          <HeaderContainer collapsed={isCollapsed}>
            <div>
              <h1>{title}</h1>
              <p>{description}</p>
            </div>

            {!isCollapsed ? (
              <FiChevronUp onClick={handleUpdateCollapsable} />
            ) : (
              <FiChevronDown onClick={handleUpdateCollapsable} />
            )}
          </HeaderContainer>

          {!isCollapsed && children}
        </Content>

        {footer && !isCollapsed && (
          <Footer>
            <p>{footer.hint}</p>

            <Button size="sm" {...footer.button}>
              {footer.button.text}
            </Button>
          </Footer>
        )}
      </Container>
    </>
  );
};

export default FooterBox;
