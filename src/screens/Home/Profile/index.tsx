import React, { useContext, useMemo } from 'react';

import { FiSettings } from 'react-icons/fi';
import Skeleton from 'react-loading-skeleton';
import { useHistory } from 'react-router-dom';
import { ThemeContext } from 'styled-components';

import { Avatar } from '@/components/Avatar';
import { useProfile } from '@/context/ProfileContext';
import { formatPrice } from '@/utils/formatPrice';

import { Container, Flex, Info } from './styles';

export function Profile() {
  const { isProfileLoading, balanceMode, balance, profit } = useProfile();

  const theme = useContext(ThemeContext);

  const history = useHistory();

  const formattedBalance = useMemo(() => {
    const formatted = formatPrice(balance);
    const split = formatted.split(',');

    return {
      main: split[0],
      decimals: split[1],
    };
  }, [balance]);

  const formattedProfit = useMemo(() => {
    const formatted = formatPrice(profit);
    const split = formatted.split(',');

    return {
      main: split[0],
      decimals: split[1],
    };
  }, [profit]);

  const balanceLabelColor = useMemo(
    () =>
      balanceMode === 'real'
        ? theme.colors.foreground.base
        : theme.colors.palette.orange.base,
    [
      balanceMode,
      theme.colors.foreground.base,
      theme.colors.palette.orange.base,
    ],
  );

  const profitLabelColor = useMemo(
    () =>
      profit >= 0
        ? theme.colors.palette.green.base
        : theme.colors.palette.red.base,
    [profit, theme],
  );

  return (
    <Container>
      <Flex>
        <Avatar />

        <Info color={/* theme.colors.foreground.base */ balanceLabelColor}>
          <dt>Seu saldo</dt>

          <dd>
            {/* R$ ••••••• */}

            {!isProfileLoading ? (
              <>
                {`${formattedBalance.main},`}

                <span id="decimals">{formattedBalance.decimals}</span>
              </>
            ) : (
              <Skeleton height={22} width={132} />
            )}
          </dd>
        </Info>

        <Info color={profitLabelColor}>
          <dt>Lucro hoje</dt>

          <dd>
            {`${formattedProfit.main},`}

            <span id="decimals">{formattedProfit.decimals}</span>
          </dd>
        </Info>
      </Flex>

      <FiSettings
        onClick={() =>
          history.push({
            pathname: '/settings',
            search: '?showGoBackButton=true',
          })
        }
        strokeWidth={1}
      />
    </Container>
  );
}
