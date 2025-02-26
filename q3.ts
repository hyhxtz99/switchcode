import React, { useState, useEffect, useMemo } from "react";

class Datasource {
  constructor(private url: string) {}

  async getPrices(): Promise<Record<string, number>> {
    const response = await fetch(this.url);
    return response.json();
  }
}

const PRIORITY_MAP: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

const WalletPage: React.FC<Props> = (props) => {
  const balances = useWalletBalances();
  const [prices, setPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    new Datasource("https://interview.switcheo.com/prices.json")
      .getPrices()
      .then(setPrices)
      .catch(console.error);
  }, []);

  const sortedBalances = useMemo(() =>
    balances
      .filter(({ blockchain, amount }) => PRIORITY_MAP[blockchain] > -99 && amount > 0)
      .sort((a, b) => PRIORITY_MAP[b.blockchain] - PRIORITY_MAP[a.blockchain])
  , [balances]);

  return <div>{sortedBalances.map(({ currency, amount }) => (
    <WalletRow key={currency} amount={amount} usdValue={(prices[currency] ?? 0) * amount} />
  ))}</div>;
};
