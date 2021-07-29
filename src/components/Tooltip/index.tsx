import React from 'react';

import Tippy from '@tippyjs/react/headless';

import { TooltipContainer, Arrow, Content } from './styles';

interface ITooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactElement<any>;
  text: string;
}

const Tooltip: React.FC<ITooltipProps> = ({ text, children, ...rest }) => {
  return (
    <Tippy
      arrow
      offset={[0, 8]}
      render={props => (
        <TooltipContainer tabIndex={-1} {...props} {...rest}>
          {text}

          <Arrow data-popper-arrow="" />
        </TooltipContainer>
      )}
    >
      <Content {...rest}>{children}</Content>
    </Tippy>
  );
};
export default Tooltip;
