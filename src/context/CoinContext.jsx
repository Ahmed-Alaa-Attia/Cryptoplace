import { createContext, useEffect, useState } from "react";

export const coinContext = createContext();

const CoinContextProvider = (props) => {
  const [allCoin, setAllCoin] = useState([]);
  const [currency, setCurrency] = useState({
    name: "usd",
    symbol: "$",
  });

  const fetchAllCoins = async () => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": "CG-bneuHumL2DfLguy3fzoHv5kx",
      },
    };

    fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.name}`,
      options
    )
      .then((res) => res.json())
      .then((res) => setAllCoin(res))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchAllCoins();
    console.log(allCoin);
  }, [currency]);

  const contextValue = {
    allCoin,
    currency,
    setCurrency,
  };

  return (
    <coinContext.Provider value={contextValue}>
      {props.children}
    </coinContext.Provider>
  );
};

export default CoinContextProvider;
