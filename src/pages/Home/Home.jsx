import { useContext, useEffect, useState } from "react";
import { coinContext } from "../../context/CoinContext";

const Home = () => {
  const { allCoin, currency } = useContext(coinContext);
  const [displayCoin, setDisplayCoin] = useState([]);
  const [inputField, setInputField] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event) => {
    setInputField(event.target.value);
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    // Simulate a delay to show the loading animation
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const filteredCoins = allCoin.filter((coin) =>
      coin.name.toLowerCase().includes(inputField.toLowerCase())
    );
    setDisplayCoin(filteredCoins);
    setIsLoading(false);
  };

  useEffect(() => {
    setDisplayCoin(allCoin);
  }, [allCoin]);

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <div className="max-w-3xl mx-auto mb-16 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Largest <br className="sm:hidden" />
          Crypto Marketplace
        </h1>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          Welcome to the worlds largest cryptocurrency marketplace! Join
          millions of traders shaping the future of finance today! 🔥✨
        </p>
        <form
          className="flex flex-col sm:flex-row items-center gap-4 max-w-xl mx-auto"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            placeholder="Search Crypto.."
            className="w-full flex-grow px-4 py-3 rounded-lg text-black outline-none"
            onChange={handleInputChange}
            value={inputField}
            required
          />
          <button
            className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 ease-in-out"
            type="submit"
          >
            Search
          </button>
        </form>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-violet-600"></div>
        </div>
      ) : displayCoin.length > 0 ? (
        <div className="max-w-6xl mx-auto bg-gradient-to-b from-[rgba(84,3,255,0.15)] to-[rgba(105,2,153,0.15)] rounded-2xl overflow-hidden">
          <div className="hidden sm:grid grid-cols-5 py-4 px-6 border-b-2 border-slate-500 font-semibold text-gray-200">
            <p>#</p>
            <p>Coins</p>
            <p>Price</p>
            <p className="text-center">24H Change</p>
            <p className="text-right">Market Cap</p>
          </div>
          <div className="divide-y divide-gray-700">
            {displayCoin.slice(0, 10).map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-2 sm:grid-cols-5 gap-4 py-4 px-6 items-center hover:bg-white/5 transition duration-300"
              >
                <p className="text-sm">{item.market_cap_rank}</p>
                <div className="flex items-center gap-3 col-span-2 sm:col-span-1">
                  <img src={item.image} alt={item.name} className="w-8 h-8" />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-gray-400 uppercase">
                      {item.symbol}
                    </p>
                  </div>
                </div>
                <p className="text-right sm:text-left">
                  {currency.symbol}
                  {item.current_price.toLocaleString()}
                </p>
                <p
                  className={`text-right sm:text-center ${
                    item.price_change_percentage_24h > 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {item.price_change_percentage_24h.toFixed(2)}%
                </p>
                <p className="hidden sm:block text-right">
                  {currency.symbol}
                  {item.market_cap.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-2xl font-semibold mb-4">No coins found</p>
          <p className="text-gray-400">
            Try adjusting your search or explore our top cryptocurrencies.
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
