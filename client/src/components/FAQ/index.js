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
          . It gives users the ability to borrow against collateral at the
          lowest minimum collateralization ratio in the DeFi ecostystem,
          utlizing the{" "}
          <Link href="https://www.liquity.org/" target="_blank">
            Liquity Proptocol
          </Link>
          .
        </Desc>
        <HR />
      </DescContainer>

      <Title>STRING Token</Title>
      <DescContainer>
        <HR />
        <Desc>
          STRING is an erc20 token launched by HarpDAO, a subsidiary of{" "}
          <Link href="https://www.angeldao.org/" target="_blank">
            AngelDAO
          </Link>
          . The token will initially be used as governance token for votes on
          further integrations accross the the Ethereum DeFi ecosystem and
          future cross-chain developments with the Liquity Protocol. It is
          planned to introduce further token uses such as profit sharing,
          burning, bundleing, and time locking, in Q2.
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
