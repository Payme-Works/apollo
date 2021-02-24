import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FiChevronUp } from 'react-icons/fi';

import Button, { IButtonProps } from '@/components/Button';

import { Container, Content, HeaderContainer, Footer } from './styles';

export interface IFooterBoxProps extends React.HTMLAttributes<HTMLDivElement> {
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
  ...rest
}) => {
  const headerContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const [isCollapsed, setIsCollapsed] = useState(true);

  const [headerContainerHeight, setHeaderContainerHeight] = useState(48);
  const [contentHeight, setContentHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);

  useEffect(() => {
    setHeaderContainerHeight(headerContainerRef.current?.offsetHeight);
    setContentHeight(contentRef.current?.offsetHeight);
    setFooterHeight(footerRef.current?.offsetHeight);
  }, [headerContainerRef, contentRef, footerRef]);

  const handleToggleCollapse = useCallback(() => {
    setIsCollapsed(state => !state);
  }, []);

  return (
    <Container
      {...rest}
      isCollapsed={isCollapsed}
      headerContainerHeight={headerContainerHeight}
      contentHeight={contentHeight}
      footerHeight={footerHeight}
    >
      <Content ref={contentRef}>
        <HeaderContainer ref={headerContainerRef}>
          <div>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>

          <FiChevronUp onClick={handleToggleCollapse} />
        </HeaderContainer>

        {children}
      </Content>

      {footer && (
        <Footer ref={footerRef}>
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
