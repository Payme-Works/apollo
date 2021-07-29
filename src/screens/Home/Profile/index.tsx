import React, { useContext, useMemo } from 'react';

import { FiSettings } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';

import { ThemeContext } from 'styled-components';

import Avatar from '@/components/Avatar';
import { useBrokerAuthentication } from '@/context/broker-authentication';
import formatPrice from '@/utils/formatPrice';

import { Container, Flex, Info } from './styles';

const Profile: React.FC = () => {
  const history = useHistory();

  const theme = useContext(ThemeContext);

  const { profile, profit } = useBrokerAuthentication();

  const _formattedBalance = useMemo(() => {
    const formatted = formatPrice(profile?.balance);
    const split = formatted.split(',');

    return {
      main: split[0],
      decimals: split[1],
    };
  }, [profile]);

  const formattedProfit = useMemo(() => {
    const formatted = formatPrice(profit);
    const split = formatted.split(',');

    return {
      main: split[0],
      decimals: split[1],
    };
  }, [profit]);

  const _balanceLabelColor = useMemo(
    () =>
      profile?.balance_active === 'real'
        ? theme.colors.foreground.base
        : theme.colors.palette.orange.base,
    [profile, theme],
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

        <Info color={theme.colors.foreground.base /* balanceLabelColor */}>
          <dt>Seu saldo</dt>

          <dd>
            R$ •••••••
            {/* {formattedBalance.main},
            <span id="decimals">{formattedBalance.decimals}</span> */}
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
};

export default Profile;
