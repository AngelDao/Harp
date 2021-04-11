import { toWei } from "../truncateString";

export const createHintforBorrow = async (
  web3,
  hintHelpers,
  sortedTroves,
  userTrove,
  debt,
  collat
) => {
  let CR;
  const debtChange = toWei(web3, debt.toString());
  const collatChange = toWei(web3, collat.toString());

  const BN = web3.utils.BN;
  if (parseFloat(userTrove.debt) > 0) {
    const newColl = new BN(toWei(web3, collat.toString()));
    const newDebt = new BN(toWei(web3, debt.toString()));
    const currentColl = newColl.add(new BN(userTrove.coll));
    const currentDebt = newDebt.add(new BN(userTrove.debt));
    const ten = new BN("10");
    const to18th = new BN("20");
    const buffer = ten.pow(to18th);
    CR = currentColl.mul(buffer).div(currentDebt);
  } else {
    const newColl = new BN(toWei(web3, collat.toString()));
    const newDebt = new BN(toWei(web3, debt.toString()));
    const ten = new BN("10");
    const to18th = new BN("20");
    const buffer = ten.pow(to18th);
    CR = newColl.mul(buffer).div(newDebt);
  }

  const numTrials = 2500;

  const randomInteger = (() =>
    Math.floor(Math.random() * Number.MAX_SAFE_INTEGER))();

  const hint = await hintHelpers.methods
    .getApproxHint(CR, numTrials, randomInteger)
    .call();
  const res = await sortedTroves.methods
    .findInsertPosition(CR, hint.hintAddress, hint.hintAddress)
    .call();

  const higher = res[0];
  const lower = res[1];

  return [higher, lower, debtChange, collatChange];
};

export const createHintforRepay = async (
  web3,
  hintHelpers,
  sortedTroves,
  userTrove,
  debt,
  collat
) => {
  let CR;
  const debtChange = toWei(web3, debt.toString());
  const collatChange = toWei(web3, collat.toString());

  const BN = web3.utils.BN;
  const newColl = new BN(toWei(web3, collat.toString()));
  const newDebt = new BN(toWei(web3, debt.toString()));
  const oldColl = new BN(userTrove.coll);
  const oldDebt = new BN(userTrove.debt);
  const currentColl = oldColl.sub(newColl);
  const currentDebt = oldDebt.sub(newDebt);
  const ten = new BN("10");
  const to20th = new BN("20");
  const buffer = ten.pow(to20th);
  CR = currentColl.mul(buffer).div(currentDebt);

  const numTrials = 2500;

  const randomInteger = (() =>
    Math.floor(Math.random() * Number.MAX_SAFE_INTEGER))();

  const hint = await hintHelpers.methods
    .getApproxHint(CR, numTrials, randomInteger)
    .call();
  const res = await sortedTroves.methods
    .findInsertPosition(CR, hint.hintAddress, hint.hintAddress)
    .call();

  const higher = res[0];
  const lower = res[1];

  return [higher, lower, debtChange, collatChange];
};
