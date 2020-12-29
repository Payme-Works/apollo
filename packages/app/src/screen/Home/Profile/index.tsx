import React, { useContext, useMemo } from 'react';
import { FiSettings } from 'react-icons/fi';

import { ThemeContext } from 'styled-components';

import Avatar from '@/components/Avatar';
import { useAuthentication } from '@/context/authentication';
import formatPrice from '@/utils/formatPrice';

import { Container, Flex, Info } from './styles';

const Profile: React.FC = () => {
  const theme = useContext(ThemeContext);

  const { profile } = useAuthentication();

  const formattedBalance = useMemo(() => {
    const formatted = formatPrice(profile?.balance);
    const split = formatted.split(',');

    return {
      main: split[0],
      decimals: split[1],
    };
  }, [profile]);

  return (
    <Container>
      <Flex>
        <Avatar />

        <Info color={theme.colors.foreground.base}>
          <dt>Seu saldo</dt>
          <dd>
            {formattedBalance.main},
            <span id="decimals">{formattedBalance.decimals}</span>
          </dd>
        </Info>

        <Info color={theme.colors.palette.green.base}>
          <dt>Hoje</dt>
          <dd>
            R$ 20,<span id="decimals">10</span>
          </dd>
        </Info>
      </Flex>

      <FiSettings strokeWidth={1} />
    </Container>
  );
};

export default Profile;
