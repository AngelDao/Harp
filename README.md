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

At this stage all contracts are **UNAUDITED** and have very minimal testing. To look at the contracts and current tests see `./contract-testing`. On a highlevel all contract logic is derived from the SushiSwap [MasterChef.sol](https://github.com/sushiswap/sushiswap/blob/master/contracts/MasterChef.sol) with, in most cases small adjustments.

### StringStaking.sol

This contract is derived from MasterChef and enables users to deposit STRING as the LP and rewards stakers with freshly minted STRING per block and LQTY kick backs from `StabilityProxy.sol` and `StabilityPool.sol` deposits using the StringStaking address as the front end tag. All deposit amounts mint the same amount deposited to `msg.sender` in gSTRING. All withdraw amounts burn the amount withdrawn by `msg.sender` in gSTRING

The following functions are the public facing functions:

- `deposit(uint256 _amount)` - This takes in an int as the param to deposit. Next it updates the state calling `updatePool()`. It then checks to see if the users amount is greater than 0, as a way to determine if they have any pending rewards. If so it sends pending rewards to user. Next it transfers STRING from the user, meaning the user must approve of this action before hand. Then the users amount and the pools lp token suppply amount is updated with the amount deposited. Next the users reward debt is updated to account for all pending rewards sent and set rewarddebt so user has no share of rewards prior. Finally gSTRING is minted 1:1 with amount deposited and sent to user.

- `widthdraw(uint256 _amount)` - This takes in an int as the param to withdraw. Next require that the user has the amount avaible to withdraw so to not allow overwithdrawals. Next get `msg.senders` gSTRING balance and requiring the gSTRING balance to be less than or equal to `_amount` so to not allow unlimited gSTRING minted. Next it updates the state calling `updatePool()`. Next it sends pending rewards to user. Next it burns gSTRING from the user, meaning the user must approve of this action before hand. Next it transfers STRING from the user. Then the users amount and the pools lp token suppply amount is updated with the amount withdrawn. Next the users reward debt is updated to account for all pending rewards sent and set rewarddebt so user has no share of rewards prior.

- `updatePool()` - This updates all the pool specific state values. When called it checks to see if any new LQTY has been recieved then updates the `accLQTYPerShare` for the pool. It then checks to see if there are any new blocks since last update and if so it mints new STRING based on the `stringPerBlock` and mints it to the contract. Lastly it updates the pools `accStringPerShare` based on the new freshly added STRING and updates the `lastRewardBlock` to `block.number`.

### Farm.sol

This contract is nealry identical to MasterChef and enables users to deposit UNI-LP tokens and rewards stakers with freshly minted STRING per block.

The following functions are the public facing functions:

- `deposit(uint256 _pid, uint256 _amount)` - This takes two params the pools id and the \_amount to deposit in that pool. Next it updates the state calling `updatePool(_pid)`. It then checks to see if the users amount is greater than 0, as a way to determine if they have any pending rewards. If so it sends pending rewards to user. Next it transfers UNI-LP from the user, meaning the user must approve of this action before hand. Then the users amount is updated with the amount deposited. Next the users reward debt is updated to account for all pending rewards sent and set rewarddebt so user has no share of rewards prior.

- `withdraw(uint256 _pid, uint256 _amount)` - This takes two params the pools id and the \_amount to withdraw in that pool. Next require that the user has the amount avaible to withdraw so to not allow overwithdrawals. Next it updates the state calling `updatePool(_pid)`. It then sends pending rewards to user. Next it transfers UNI-LP to the user Then the users amount is updated with the amount withdrawn. Next the users reward debt is updated to account for all pending rewards sent and set rewarddebt so user has no share of rewards prior.

- `claim(uint256 _pid)` - This takes one params the pools id. Next it updates the state calling `updatePool(_pid)`. It then sends pending rewards to user.Next the users reward debt is updated to account for all pending rewards sent and set rewarddebt so user has no share of rewards prior.

- `updatePool(uint256 _pid)` - This updates all the pool specific state values. It checks to see if there are any new blocks since last update and if so it mints new STRING based on the `stringPerBlock` and mints it to the contract. Lastly it updates the pools `accStringPerShare` based on the new freshly added STRING and updates the `lastRewardBlock` to `block.number`.

### StabilityFactory.sol

This contract is on a high level a just a farm, where pool state variables are kept in the `StabilityFactory.sol` and users state variables are kept in the `StabilityProxy.sol`.

The following functions are the public facing functions:

- `createStabilityProxy()` - This simply creates a new instance of the `StabiiliyProxy.sol` where `msg.sender` is the owner so long as `msg.sender` does not already have a proxy.

- `update(uint256 _pid)` - This updates all the pool specific state values. It checks to see if there are any new blocks since last update and if so it mints new STRING based on the `stringPerBlock` and mints it to the contract. Lastly it updates the pools `accStringPerShare` based on the new freshly added STRING and updates the `lastRewardBlock` to `block.number`.

All other functions are either private or either called only by `StabilityProxy.sol` instances.

### StabilityProxy.sol

This contract acts as an inbetween for the user and the `StabilityPool.sol`. This allows us to keep track of user specific state to fairly reward users STRING for Stability Pool interactions. Also going to back to farm analogy this is essentially the where the `UserInfo` struct state variables are kept and updated.

The following functions are the public facing functions:

- `deposit(uint256 _amount)` - This takes one param the \_amount to deposit. Next it updates the state of the pool variables by calling `StabilityFactory.update()`.It then calls `_updateBalance()` to check if there has been any state changes to the users lusd balance in the `StabilityPool.sol`. It then checks to see if the users amount is greater than 0, as a way to determine if they have any pending rewards. If so it sends pending rewards to user. Next it transfers LUSD from the user, meaning the user must approve of this action before hand. Then the users amount is updated with the amount deposited and the pools `totalLUSD` is updated by calling `StabilityFactory.addLUSD(_amount)`. Next the pools reference to the proxy state variables are updated by calling `StabilityFactory.updateProxyBalance(lusdBalance, owner)`. Finally the LUSD is transfered to the Stability Pool by calling `StabilityPool.provideToSP(_amount, frontEnd)` where `frontEnd` is the `StringStaking.sol` address.

- `withdraw(uint256 _amount)` - This takes one param the \_amount to witdraw in. Next it updates the state of the pool variables by calling `StabilityFactory.update()`.It then calls `_updateBalance()` to check if there has been any state changes to the users lusd balance in the `StabilityPool.sol`. It then sends pending rewards to user. Next it checks to see if the proxys `lusdBalance` was updated from `_updateBalance()`, if so and the `lusdBalance` is now lower than `_amount` it passes `lusdBalance` so to avoid overwithdrawals. Next it withdrawals LUSD from the Stability Pool by calling `StabilityPool.withdrawFromSP(lusdBalance||_amount)`. Next the withdrawn LUSD is transfered to proxy `owner`. Then the proxy amount is updated as `lusdBalance` with the amount withdrawn and the pools `totalLUSD` is updated by calling `StabilityFactory.subtractLUSD(_amount)`. Finally the pools reference to the proxy state variables are updated by calling `StabilityFactory.updateProxyBalance(lusdBalance, owner)`.

- `claim()` - This updates the state of the pool variables by calling `StabilityFactory.update()`. It then calls `_updateBalance()` to check if there has been any state changes to the users lusd balance in the `StabilityPool.sol`. Next the users rewards are claimed by calling `StabilityPool.withdrawFromSP(0)`. Finally all rewards are sent.

This contract is very complex with alot of external contract calls which makes it a high security risk, **USE WITH CAUTION**

### StringToken.sol

This is a standard [ERC20](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md) contract with minting capabilities granted on deployment to select owners and uncapped

### gStringToken.sol

This is a standard [ERC20](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md) contract with minting capabilities granted on deployment to select owners and ERC20Burnable inheritance.

### TokenVesting.sol

This contract handles the logic for the AngelDAO token allocation. 1 million tokens will be distributed to the AngelDAO token address over 2 years

## Frontend

The plan is to open source the entire front end code a week after launch to allow of other people to fork or see ways of interacting with the contracts.
