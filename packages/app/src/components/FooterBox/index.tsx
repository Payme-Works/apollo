import React, { useCallback, useMemo, useRef, useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

import Button, { IButtonProps } from '@/components/Button';

import { Container, Content, HeaderContainer, Footer } from './styles';

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
  const headerContainerRef = useRef<HTMLDivElement>(null);

  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleToggleCollapse = useCallback(() => {
    setIsCollapsed(state => !state);
  }, []);

  const headerContainerHeight = useMemo(
    () => headerContainerRef.current?.offsetHeight,
    [headerContainerRef],
  );

  return (
    <>
      <Container
        {...containerProps}
        isCollapsed={isCollapsed}
        headerContainerHeight={headerContainerHeight}
      >
        <Content>
          <HeaderContainer ref={headerContainerRef}>
            <div>
              <h1>{title}</h1>
              <p>{description}</p>
            </div>

            {!isCollapsed ? (
              <FiChevronUp onClick={handleToggleCollapse} />
            ) : (
              <FiChevronDown onClick={handleToggleCollapse} />
            )}
          </HeaderContainer>

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
    </>
  );
};

export default FooterBox;
