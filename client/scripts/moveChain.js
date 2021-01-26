const timeMachine = require("ganache-time-traveler");

const advanceBlock = async (n) => {
  for (let i = 0; i < n; i++) {
    await timeMachine.advanceBlock();
  }
};

module.exports = async function (callback) {
  // Code goes here...
  await advanceBlock(20);
  callback();
};
