// const { assert } = require("chai");

// const OZStringToken = artifacts.require("StringToken");
// const TokenVesting = artifacts.require("TokenVesting");

// require("chai").use(require("chai-as-promised")).should();

// function tokens(n) {
//   return web3.utils.toWei(n, "ether");
// }

// contract("OZString Token Tests", (accounts) => {
//   let ozStringToken, tokenVesting;

//   before(async () => {
//     const AngelDAOAddress = accounts[2];
//     const HarpDAOAddress = accounts[1];
//     const owner = accounts[3];
//     ozStringToken = await OZStringToken.new(
//       "ozString",
//       "ozSTRING",
//       HarpDAOAddress,
//       owner
//     );

//     const yearsToLockUp = 365 * 2;
//     tokenVesting = await TokenVesting.new(
//       AngelDAOAddress,
//       yearsToLockUp,
//       ozStringToken.address
//     );
//     const vestingAddress = tokenVesting.address;

//     await ozStringToken.addVestingAddress(vestingAddress, { from: owner });
//   });

//   describe("Token Attributes Check On Deployment", async () => {
//     it("Sets correct Token Supply upon deployment", async () => {
//       let totalSupply = (await ozStringToken.totalSupply()).toString();
//       assert.equal(totalSupply, tokens("2000000"));
//     });
//     it("Sets correct Name upon deployment", async () => {
//       let name = await ozStringToken.name();
//       assert.equal(name, "ozString");
//     });
//     it("Sets correct Symbol upon deployment", async () => {
//       let symbol = await ozStringToken.symbol();
//       assert.equal(symbol, "ozSTRING");
//     });
//     it("Sets correct Decimal upon deployment", async () => {
//       let decimals = await ozStringToken.decimals();
//       assert.equal(decimals, 18);
//     });
//     it("Sets correct Balance for harpDAO upon deployment", async () => {
//       const balance = (await ozStringToken.balanceOf(accounts[1])).toString();
//       assert.equal(balance, tokens("2000000"), "HarpDAOBalance");
//     });
//     it("sets vesting contract to mint", async () => {
//       const canMint = await ozStringToken.isAllowedMinter(tokenVesting.address);
//       assert.equal(canMint, true);
//     });
//   });

//   describe("Token Contract actions", async () => {
//     it("not allows non vesting contract to mint tokens", async () => {
//       try {
//         await ozStringToken.mintTo(accounts[1], 10);
//       } catch (err) {
//         assert(
//           err.message.indexOf("revert") >= 0,
//           "Sender not a verified Minter"
//         );
//       }
//     });

//     it("transfer tokens success", async () => {
//       await ozStringToken.transfer(accounts[0], tokens("10"), {
//         from: accounts[1],
//       });

//       const recieverBalance = (
//         await ozStringToken.balanceOf(accounts[0])
//       ).toString();
//       const senderBalance = (
//         await ozStringToken.balanceOf(accounts[1])
//       ).toString();

//       assert.equal(recieverBalance, tokens("10"));
//       assert.equal(senderBalance, tokens("1999990"));
//     });

//     it("transfer tokens fail send more than have", async () => {
//       try {
//         await ozStringToken.transfer(accounts[1], tokens("20000000000"));
//       } catch (err) {
//         assert(
//           err.message.indexOf("revert") >= 0,
//           "error message must contain revert"
//         );
//       }
//     });

//     it("Transfer Event triggerd", async () => {
//       const tx = await ozStringToken.transfer(accounts[1], tokens("10"));

//       assert.equal(tx.logs.length, 1, "test that one event emitted");
//       assert.equal(
//         tx.logs[0].event,
//         "Transfer",
//         "test that Transfer event was specifically emitted"
//       );
//       assert.equal(
//         tx.logs[0].args.from,
//         accounts[0],
//         "test that the correct from was used"
//       );
//       assert.equal(
//         tx.logs[0].args.to,
//         accounts[1],
//         "test that the correct to address was used"
//       );
//       assert.equal(tx.logs[0].args.value, tokens("10"), "test value of tx");
//     });

//     it("approves tokens for delegated token transfer", async () => {
//       await ozStringToken.approve(accounts[0], tokens("1000"), {
//         from: accounts[1],
//       });
//       const allowance = (
//         await ozStringToken.allowance(accounts[1], accounts[0])
//       ).toString();
//       assert.equal(allowance, tokens("1000"));
//     });

//     it("Approval event triggered", async () => {
//       const tx = await ozStringToken.approve(accounts[1], tokens("1000"));

//       assert.equal(tx.logs.length, 1, "test that one event emitted");
//       assert.equal(
//         tx.logs[0].event,
//         "Approval",
//         "test that Approval event was specifically emitted"
//       );
//       assert.equal(
//         tx.logs[0].args.owner,
//         accounts[0],
//         "test that the correct owner address was used"
//       );
//       assert.equal(
//         tx.logs[0].args.spender,
//         accounts[1],
//         "test that the correct spender address was used"
//       );
//       assert.equal(
//         tx.logs[0].args.value,
//         tokens("1000"),
//         "test the value of value allowed"
//       );
//     });

//     it("handle transfer from ", async () => {
//       const from = accounts[1];
//       const spender = accounts[0];
//       const to = accounts[2];

//       await ozStringToken.approve(spender, tokens("100"), { from });
//       const tx = await ozStringToken.transferFrom(from, to, tokens("10"), {
//         from: spender,
//       });

//       const fromBalance = (await ozStringToken.balanceOf(from)).toString();
//       const toBalance = (await ozStringToken.balanceOf(to)).toString();

//       const newAllowance = (
//         await ozStringToken.allowance(from, spender)
//       ).toString();

//       assert.equal(newAllowance, tokens("90"));
//       assert.equal(fromBalance, tokens("1999990"));
//       assert.equal(toBalance, tokens("10"));
//       assert.equal(tx.logs.length, 2, "test that one event emitted");
//       assert.equal(
//         tx.logs[0].event,
//         "Transfer",
//         "test that Transfer event was specifically emitted"
//       );
//       assert.equal(
//         tx.logs[0].args.from,
//         from,
//         "test that the correct from was used"
//       );
//       assert.equal(
//         tx.logs[0].args.to,
//         to,
//         "test that the correct to address was used"
//       );
//       assert.equal(tx.logs[0].args.value, tokens("10"), "test value of tx");
//     });
//   });
// });
