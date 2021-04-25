# Harp: Liquity Frontend

![Uptime Robot ratio (7 days)](https://img.shields.io/uptimerobot/ratio/7/m787957843-96f5171a7954201bc849230e?label=App) ![Uptime Robot ratio (7 days)](https://img.shields.io/uptimerobot/ratio/7/m787957842-0ba226c393ec458a11bacbb1?label=Landing) [![Discord](https://img.shields.io/discord/828467497212182548?label=join%20chat&logo=discord&logoColor=white)](https://discord.gg/BdTRMZje)

Harp is a decentralized financial instrument. It incentivizes staking of the native tokens for the [Liquity Protocol](https://github.com/liquity/dev#readme). Specifically the LUSD token inside the Stability Pool. It creates this incentive by rewarding stakers of the Gov Token with sites kickbacks.

We are very strong supporters of the Liquity Protocol and believe deeply that decentralized financial products are critical to insure the future is more fair, free, and open! For these reasons we have developed Harp, and plan to maintain it, to be open source and to offer added incentives for Liquity Protocol interactions

## Mechanics

Harp is powered by the Liquity Frontend Program, meaning it receives an LQTY reward relative to the amount of Stability Pool stakers, staked through Harp. We decided to build a unique incentive mechanism to allow Harp Stability Pool stakers to share in the rewards that the front-end generates by creating the Profit Sharing Pool.

The following contracts **(UNAUDITED)** were built to enable this functionality:

- StringStaking.sol
- Farm.sol
- StabilityFactory.sol
- StabilityProxy.sol
- StringToken.sol
- gStringToken.sol
- TokenVesting.sol

## Contracts

At this stage all contracts are **UNAUDITED** and have very minimal testing. To look at the contracts and current tests see `./contract-testing`. On a highlevel all contract logic is derived from the SushiSwap [MasterChef.sol](https://github.com/sushiswap/sushiswap/blob/master/contracts/MasterChef.sol)
