/* eslint-disable jest/valid-describe */
/* eslint-disable no-undef */
const { assert } = require("chai");

const gStringTokenArt = artifacts.require("gStringToken.sol");

require("chai").use(require("chai-as-promised")).should();

function tokens(n) {
  return web3.utils.toWei(n, "ether");
}

contract("gSTRING Token Tests", (accounts) => {
  let gStringToken, tokenVesting;

  before(async () => {
    const owner = accounts[3];
    gStringToken = await gStringTokenArt.new(owner);
    await gStringToken.addVestingAddress(owner, { from: owner });
    await gStringToken.mintTo(owner, tokens("1000"), { from: owner });
    await gStringToken.mintTo(accounts[1], tokens("1000"), { from: owner });
    await gStringToken.mintTo(accounts[2], tokens("1000"), { from: owner });
    await gStringToken.mintTo(accounts[0], tokens("1000"), { from: owner });
  });

  describe("Token Attributes Check On Deployment", async () => {
    it("Sets correct Name upon deployment", async () => {
      let name = await gStringToken.name();
      assert.equal(name, "Goverance String Token");
    });
    it("Sets correct Symbol upon deployment", async () => {
      let symbol = await gStringToken.symbol();
      assert.equal(symbol, "gSTRING");
    });
    it("Sets correct Decimal upon deployment", async () => {
      let decimals = await gStringToken.decimals();
      assert.equal(decimals, 18);
    });
  });

  describe("Token Contract actions", async () => {
    it("not allows non vesting contract to mint tokens", async () => {
      try {
        await gStringToken.mintTo(accounts[1], tokens("10"));
      } catch (err) {
        assert(
          err.message.indexOf("revert") >= 0,
          "Sender not a verified Minter"
        );
      }
    });

    it("transfer tokens success", async () => {
      await gStringToken.transfer(accounts[0], tokens("10"), {
        from: accounts[1],
      });

      const recieverBalance = (
        await gStringToken.balanceOf(accounts[0])
      ).toString();
      const senderBalance = (
        await gStringToken.balanceOf(accounts[1])
      ).toString();

      assert.equal(recieverBalance, tokens("1010"));
      assert.equal(senderBalance, tokens("990"));
    });

    it("transfer tokens fail send more than have", async () => {
      try {
        await gStringToken.transfer(accounts[1], tokens("20000000000"));
      } catch (err) {
        assert(
          err.message.indexOf("revert") >= 0,
          "error message must contain revert"
        );
      }
    });

    it("Transfer Event triggerd", async () => {
      const tx = await gStringToken.transfer(accounts[1], tokens("10"));

      assert.equal(tx.logs.length, 1, "test that one event emitted");
      assert.equal(
        tx.logs[0].event,
        "Transfer",
        "test that Transfer event was specifically emitted"
      );
      assert.equal(
        tx.logs[0].args.from,
        accounts[0],
        "test that the correct from was used"
      );
      assert.equal(
        tx.logs[0].args.to,
        accounts[1],
        "test that the correct to address was used"
      );
      assert.equal(tx.logs[0].args.value, tokens("10"), "test value of tx");
    });

    it("approves tokens for delegated token transfer", async () => {
      await gStringToken.approve(accounts[0], tokens("1000"), {
        from: accounts[1],
      });
      const allowance = (
        await gStringToken.allowance(accounts[1], accounts[0])
      ).toString();
      assert.equal(allowance, tokens("1000"));
    });

    it("Approval event triggered", async () => {
      const tx = await gStringToken.approve(accounts[1], tokens("1000"));

      assert.equal(tx.logs.length, 1, "test that one event emitted");
      assert.equal(
        tx.logs[0].event,
        "Approval",
        "test that Approval event was specifically emitted"
      );
      assert.equal(
        tx.logs[0].args.owner,
        accounts[0],
        "test that the correct owner address was used"
      );
      assert.equal(
        tx.logs[0].args.spender,
        accounts[1],
        "test that the correct spender address was used"
      );
      assert.equal(
        tx.logs[0].args.value,
        tokens("1000"),
        "test the value of value allowed"
      );
    });

    it("handle burn from", async () => {
      const burner = accounts[1];
      const burned = accounts[0];

      await gStringToken.approve(burner, tokens("100"), { from: burned });
      await gStringToken.burnFrom(burned, tokens("50"), { from: burner });

      const burnedBalance = (await gStringToken.balanceOf(burned)).toString();

      assert.equal(burnedBalance, tokens("950"));
    });

    it("handle transfer from ", async () => {
      const from = accounts[1];
      const spender = accounts[0];
      const to = accounts[2];

      await gStringToken.approve(spender, tokens("100"), { from });
      const tx = await gStringToken.transferFrom(from, to, tokens("10"), {
        from: spender,
      });

      const fromBalance = (await gStringToken.balanceOf(from)).toString();
      const toBalance = (await gStringToken.balanceOf(to)).toString();

      const newAllowance = (
        await gStringToken.allowance(from, spender)
      ).toString();

      assert.equal(newAllowance, tokens("90"));
      assert.equal(fromBalance, tokens("990"));
      assert.equal(toBalance, tokens("1010"));
      assert.equal(tx.logs.length, 2, "test that one event emitted");
      assert.equal(
        tx.logs[0].event,
        "Transfer",
        "test that Transfer event was specifically emitted"
      );
      assert.equal(
        tx.logs[0].args.from,
        from,
        "test that the correct from was used"
      );
      assert.equal(
        tx.logs[0].args.to,
        to,
        "test that the correct to address was used"
      );
      assert.equal(tx.logs[0].args.value, tokens("10"), "test value of tx");
    });
  });
});
