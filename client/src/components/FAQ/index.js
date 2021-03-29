import React from "react";
import { DescContainer, Title, HR, Desc, Link, TokenomicsList } from "./styles";

const FAQ = () => {
  return (
    <div>
      <Title>Overview</Title>
      <DescContainer>
        <HR />
        <Desc>
          Harp is a{" "}
          <i>
            <b>decentralized financial instrument</b>
          </i>
          . It incentivizes staking of the native tokens for the{" "}
          <Link href="https://www.liquity.org/" target="_blank">
            Liquity Proptocol
          </Link>
          . Specifically the LUSD token inside the Stability Pool.
        </Desc>
        <HR />
      </DescContainer>

      <Title>STRING Token</Title>
      <DescContainer>
        <HR />
        <Desc>
          STRING is an erc20 token launched by HarpDAO, an incubation of{" "}
          <Link href="https://www.angeldao.org/" target="_blank">
            AngelDAO
          </Link>
          . The token utility is to be an incentive for Liquity participation
          via the Harp frontend. By staking STRING you can earn in the frontends
          kick back based on your portion staked in the Profit Share Pool and
          the amount of LUSD staked in the Stability Pool using our frontend
          tag.
        </Desc>
        <HR />
      </DescContainer>

      <Title>gSTRING Token</Title>
      <DescContainer>
        <HR />
        <Desc>
          gSTRING is the Harp governance token. It can only be earned via
          staking STRING into the Profit Share Pool. It is minted 1:1 to the
          amount of STRING staked after deposit fees. Profit Share Pool withdraw
          amounts will require an equal amount of gSTRING in the wallet to the
          withdraw amount requested, gSTRING is burnt 1:1 with the amount of
          STRING withdrawn from the Profit Share Pool. gSTRING will be used to
          vote on HarpDAO proposals and is meant to act as proof of
          participation mechanism.
        </Desc>
        <HR />
      </DescContainer>
      <Title>Tokenomics</Title>
      <DescContainer>
        <HR />
        <Desc>
          <TokenomicsList>
            <li>
              The token supply for STRING is is <b>10,000,000</b>.
            </li>
            <li>
              <b>10%</b> of supply will go to the AngelDAO, Harp is a product
              created by the AngelDAO. These tokens will be under a 2 year
              linear vesting schedule.
            </li>
            <li>
              <b>20%</b> of supply will go to the HarpDAO, this will be placed
              in a transparent DAO treasury spent transparently on development
              work for further integrations and improvements of the platform.
            </li>
            <li>
              <b>14%</b> of supply will go to Liquity Network Participation. 80%
              of these tokens will be rewarded to stability pool participants
              and 20% of tokens will be rewarded to the rewards pool.
            </li>
            <li>
              <b>56%</b> of supply will go to Liquidity Mining. 30% going to the
              STRING/ETH and 70% going to STRING/LUSD
            </li>
          </TokenomicsList>
        </Desc>
        <HR />
      </DescContainer>
      <Title>Purpose</Title>
      <DescContainer>
        <HR />
        <Desc>
          Harp exists first as an access point into the Liquity Protocol. We
          believe in the improvements that Liquity has made on the decentrailzed
          stablecoin model.
        </Desc>
        <HR />
      </DescContainer>
    </div>
  );
};

export default FAQ;
