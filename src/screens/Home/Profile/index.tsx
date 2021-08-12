import React, { useContext, useEffect, useMemo, useState } from 'react';

import { Profile as IqOptionProfile } from '@hemes/iqoption';
import { FiSettings } from 'react-icons/fi';
import Skeleton from 'react-loading-skeleton';
import { useHistory } from 'react-router-dom';
import { ThemeContext } from 'styled-components';

import { Avatar } from '@/components/Avatar';
import { useHemes } from '@/context/HemesContext';
import { formatPrice } from '@/utils/formatPrice';

import { Container, Flex, Info } from './styles';

export function Profile() {
  const [profile, setProfile] = useState<IqOptionProfile>();

  const { hemes, isHemesLoggedIn, profit } = useHemes();

  const theme = useContext(ThemeContext);

  const history = useHistory();

  useEffect(() => {
    async function loadProfile() {
      if (!isHemesLoggedIn) {
        return;
      }

      const newProfile = await hemes.getProfile();

      console.log('Profile:', newProfile);

      setProfile(newProfile);
    }

    loadProfile();
  }, [hemes, isHemesLoggedIn]);

  const formattedBalance = useMemo(() => {
    const formatted = formatPrice(profile?.balance);
    const split = formatted.split(',');

    return {
      main: split[0],
      decimals: split[1],
    };
  }, [profile?.balance]);

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
      profile?.balance_type === 1
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

        <Info color={/* theme.colors.foreground.base */ balanceLabelColor}>
          <dt>Seu saldo</dt>

          <dd>
            {/* R$ ••••••• */}

            {/* {profile ? (
              <>
                {`${formattedBalance.main},`}

                <span id="decimals">{formattedBalance.decimals}</span>
              </>
            ) : (
              <>
                <Skeleton height={32} width={48} />
              </>
            )} */}

            {`${formattedBalance.main},`}

            <span id="decimals">{formattedBalance.decimals}</span>

            {/* <Skeleton height={32} width={48} /> */}
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
