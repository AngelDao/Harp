import CoinGecko from "coingecko-api";

export const fetchPrices = async () => {
  const client = new CoinGecko();
  let diffMinutes;
  let lusd, lqty;
  let ethPrice = localStorage.getItem("prices");
  try {
    ethPrice = JSON.parse(ethPrice);
  } catch (err) {
    console.error(err);
    ethPrice = null;
  }
  if (ethPrice && ethPrice.lastFetch && ethPrice.eth) {
    const date1 = new Date(new Date());
    const date2 = new Date(ethPrice.lastFetch);
    const diffTime = Math.abs(date1.getTime() - date2.getTime());
    diffMinutes = Math.ceil(diffTime / (1000 * 60));
  }
  if (!ethPrice || !ethPrice.eth || diffMinutes > 9) {
    try {
      ethPrice = await client.coins.fetch("ethereum", {});
      lusd = await client.coins.fetch("liquity-usd", {});
      lqty = await client.coins.fetch("liquity", {});
      ethPrice = ethPrice.data.market_data.current_price.usd;
      lusd = lusd.data.market_data.current_price.usd;
      lqty = lqty.data.market_data.current_price.usd;
      localStorage.setItem(
        "prices",
        JSON.stringify({ eth: ethPrice, lastFetch: new Date(), lqty, lusd })
      );
    } catch (err) {
      console.error(err);
      ethPrice = null;
      lusd = null;
      lqty = null;
    }
  } else {
    lusd = ethPrice.lusd;
    lqty = ethPrice.lqty;
    ethPrice = ethPrice.eth;
  }
  return [ethPrice, lusd, lqty];
};

export const fetchTest = async () => {
  const client = new CoinGecko();
  const res = await client.coins.fetch("ethereum", {});
  await client.coins.fetch("liquity-usd", {});
  await client.coins.fetch("liquity", {});
  debugger;
};
