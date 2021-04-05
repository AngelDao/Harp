import CoinGecko from "coingecko-api";

export const fetchPrices = async () => {
  const client = new CoinGecko();
  let diffMinutes;
  let ethPrice = localStorage.getItem("prices");
  try {
    ethPrice = JSON.parse(ethPrice);
  } catch (err) {
    console.error(err);
    ethPrice = null;
  }
  if (ethPrice && ethPrice.lastFetch && ethPrice.eth) {
    const date1 = new Date();
    const date2 = ethPrice.lastFetch;
    const diffTime = Math.abs(date1 - date2);
    diffMinutes = Math.ceil(diffTime / (1000 * 60));
  }
  if (!ethPrice || !ethPrice.eth || diffMinutes > 9) {
    try {
      ethPrice = await client.coins.fetch("ethereum", {});
      ethPrice = ethPrice.data.market_data.current_price.usd;
      localStorage.setItem(
        "prices",
        JSON.stringify({ eth: ethPrice, lastFetch: new Date() })
      );
    } catch (err) {
      console.error(err);
      ethPrice = null;
    }
  } else {
    ethPrice = ethPrice.eth;
  }
  return [ethPrice];
};
