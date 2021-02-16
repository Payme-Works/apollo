import React from 'react';

import Tippy from '@tippyjs/react/headless';

import { TooltipContainer, Arrow, ButtonContainer } from './styles';

interface ITooltipProps {
  children: React.ReactElement<any>;
  hint: string;
}

const Tooltip: React.FC<ITooltipProps> = ({ hint, children }) => {
  return (
    <Tippy
      arrow
      render={attrs => (
        <TooltipContainer className="box" tabIndex={-1} {...attrs}>
          {hint}
          <Arrow data-popper-arrow="" />
        </TooltipContainer>
      )}
    >
      <ButtonContainer>{children}</ButtonContainer>
    </Tippy>
  );
};
export default Tooltip;
