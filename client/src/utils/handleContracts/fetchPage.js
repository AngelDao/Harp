export const fetchPage = async (
  setTroves,
  troves,
  sortedTroves,
  troveManager,
  page
) => {
  const pageSize = 10;
  let lastTrove = troves.troves[page - 1][9].owner;
  const newPage = [];
  for (let i = 0; i < pageSize; i++) {
    const troveOwner = await sortedTroves.methods.getPrev(lastTrove).call();
    if (troveOwner) {
      const trove = await troveManager.methods.Troves(troveOwner).call();
      lastTrove = troveOwner;
      newPage.push({ owner: troveOwner, trove });
    } else {
      break;
    }
  }
  setTroves({ ...troves, troves: { ...troves.troves, [page]: newPage } });
};
