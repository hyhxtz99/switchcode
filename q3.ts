import React, { useState, useEffect, useMemo } from "react";
/*
Here is the English translation of your content:

1. Datasource instance should not be created inside useEffect: Creating a new
 Datasource instance every time the component mounts is not ideal. Although
  useEffect only runs once in this case, a better approach would be to manage 
  Datasource as a singleton or encapsulate it in an external state management layer.

2. Incorrect console.err(error): The correct method is console.error(error).

3. Hardcoded switch statement: If the number of blockchain types increases, 
this function will need to be manually updated, which is not scalable.Replace 
switch with a dictionary: Using a dictionary (object) instead of a 
switch statement improves extensibility and provides faster lookup times.

5. Undefined lhsPriority: The variable lhsPriority is not defined, which may 
cause runtime errors.

6. Logical error in filtering balances: Filtering with balance.amount  0.

7. Unnecessary .filter().sort() chaining: These operations can be combined into a 
single loop for better performance.

8.formattedBalances redundancy: The formattedBalances array is just 
sortedBalances with an additional formatted field. The formatting logic should only 
be applied during rendering and does not need to be stored separately.

9. Default behavior of balance.amount.toFixed(): The .toFixed() method converts 
numbers to strings by default. Formatting logic should be more flexible and 
context-aware.
*/
class Datasource {
  constructor(private url: string) { }

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

  return <div>{
    sortedBalances.map(({ currency, amount }) => (
      <WalletRow key= { currency } amount = { amount } usdValue = {(prices[currency] ?? 0) * amount} />
  ))}</div>;
};
