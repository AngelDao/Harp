export const refreshState = (handleContractConnect, handlePricing) => {
  setTimeout(async () => {
    await handleContractConnect();
    await handlePricing();
  }, 1000 * 10);
};
