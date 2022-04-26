import React, { useContext, useState, useMemo } from 'react';

import { FiSettings, FiEye, FiEyeOff } from 'react-icons/fi';
import Skeleton from 'react-loading-skeleton';
import { useHistory } from 'react-router-dom';
import { ThemeContext } from 'styled-components';

import { Avatar } from '@/components/Avatar';
import { useProfile } from '@/context/ProfileContext';
import { formatPrice } from '@/utils/formatPrice';

import { Container, Flex, Info, DataTitle, HiddenToggleButton } from './styles';

type FormattedProfileValues = {
  main: string;
  decimals: string;
};

export function Profile() {
  const { isProfileLoading, balanceMode, balance, profit } = useProfile();

  const theme = useContext(ThemeContext);

  const [hiddenBalance, setHiddenBalance] = useState(false);
  const [hiddenProfit, setHiddenProfit] = useState(false);

  const history = useHistory();

  const formattedBalance = useMemo((): FormattedProfileValues => {
    if (hiddenBalance) {
      return {
        main: 'R$ •••••••',
        decimals: null,
      };
    }

    const formatted = formatPrice(balance);
    const split = formatted.split(',');

    return {
      main: `${split[0]},`,
      decimals: split[1],
    };
  }, [balance, hiddenBalance]);

  const formattedProfit = useMemo((): FormattedProfileValues => {
    if (hiddenProfit) {
      return {
        main: 'R$ •••••••',
        decimals: null,
      };
    }

    const formatted = formatPrice(profit);
    const split = formatted.split(',');

    return {
      main: `${split[0]},`,
      decimals: split[1],
    };
  }, [profit, hiddenProfit]);

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

  const handleToggleHiddenBalance = () => {
    setHiddenBalance(!hiddenBalance);
  };

  const handleToggleHiddenProfit = () => {
    setHiddenProfit(!hiddenProfit);
  };

  return (
    <Container>
      <Flex>
        <Avatar />

        <Info color={balanceLabelColor}>
          <DataTitle>
            Seu saldo
            {hiddenBalance ? (
              <HiddenToggleButton>
                <FiEyeOff onClick={handleToggleHiddenBalance} strokeWidth={1} />
              </HiddenToggleButton>
            ) : (
              <HiddenToggleButton>
                <FiEye onClick={handleToggleHiddenBalance} strokeWidth={1} />
              </HiddenToggleButton>
            )}
          </DataTitle>

          <dd>
            {!isProfileLoading ? (
              <>
                {`${formattedBalance.main}`}

                <span id="decimals">{formattedBalance.decimals}</span>
              </>
            ) : (
              <Skeleton height={22} width={132} />
            )}
          </dd>
        </Info>

        <Info color={profitLabelColor}>
          <DataTitle>
            Lucro hoje
            {hiddenProfit ? (
              <HiddenToggleButton>
                <FiEyeOff onClick={handleToggleHiddenProfit} strokeWidth={1} />
              </HiddenToggleButton>
            ) : (
              <HiddenToggleButton>
                <FiEye onClick={handleToggleHiddenProfit} strokeWidth={1} />
              </HiddenToggleButton>
            )}
          </DataTitle>

          <dd>
            {`${formattedProfit.main}`}

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
