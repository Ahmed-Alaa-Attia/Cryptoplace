import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { coinContext } from "../../context/CoinContext";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Coin = () => {
  const { currency } = useContext(coinContext);
  const { id } = useParams();
  const [coin, setCoin] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('Current ID from params:', id);
  console.log('Current URL:', window.location.pathname);

  useEffect(() => {
    const fetchCoinData = async () => {
      if (!id) {
        setError("No coin ID provided");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const options = {
          headers: {
            accept: "application/json",
            "x-cg-demo-api-key": "CG-bneuHumL2DfLguy3fzoHv5kx",
          },
        };

        // Add retry logic
        let retries = 3;
        let coinResponse, chartResponse;

        while (retries > 0) {
          try {
            [coinResponse, chartResponse] = await Promise.all([
              fetch(`https://api.coingecko.com/api/v3/coins/${id}`, options),
              fetch(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency.name}&days=7`, options)
            ]);

            if (coinResponse.ok && chartResponse.ok) {
              break;
            }

            // If we get a 429 (Too Many Requests), wait before retrying
            if (coinResponse.status === 429 || chartResponse.status === 429) {
              await new Promise(resolve => setTimeout(resolve, 2000));
            } else {
              break;
            }
          } catch (e) {
            console.warn(`Attempt ${4 - retries} failed, retrying...`);
          }
          retries--;
        }

        // Check final response status
        if (!coinResponse?.ok) {
          throw new Error(`Failed to fetch coin data: ${coinResponse?.status || 'Network error'}`);
        }

        if (!chartResponse?.ok) {
          throw new Error(`Failed to fetch chart data: ${chartResponse?.status || 'Network error'}`);
        }

        const coinData = await coinResponse.json();
        const chartJson = await chartResponse.json();

        if (!coinData || !coinData.id) {
          throw new Error('Invalid coin data received');
        }

        setCoin(coinData);
        
        if (chartJson?.prices && Array.isArray(chartJson.prices) && chartJson.prices.length > 0) {
          setChartData({
            labels: chartJson.prices.map(price => new Date(price[0]).toLocaleDateString()),
            datasets: [{
              label: `Price (${currency.symbol})`,
              data: chartJson.prices.map(price => price[1]),
              borderColor: 'rgb(124, 58, 237)',
              backgroundColor: 'rgba(124, 58, 237, 0.5)',
            }]
          });
        } else {
          console.warn('No valid chart data received');
        }

      } catch (error) {
        console.error('Error fetching coin data:', error);
        setError(error.message || 'Failed to fetch coin data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoinData();
  }, [id, currency]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-xl text-red-400 mb-4">{error}</p>
          <Link 
            to="/" 
            className="text-violet-500 hover:text-violet-400 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!coin || !coin.image || !coin.market_data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-400">No data available</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Coin Header */}
        <div className="flex items-center gap-4 mb-8">
          <img src={coin.image.large} alt={coin.name} className="w-16 h-16" />
          <div>
            <h1 className="text-3xl font-bold">{coin.name}</h1>
            <p className="text-gray-400 uppercase">{coin.symbol}</p>
          </div>
        </div>

        {/* Price and Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gradient-to-b from-[rgba(84,3,255,0.15)] to-[rgba(105,2,153,0.15)] p-6 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4">Price Statistics</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Current Price</span>
                <span className="font-semibold">
                  {currency.symbol}{coin.market_data.current_price[currency.name].toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Market Cap</span>
                <span className="font-semibold">
                  {currency.symbol}{coin.market_data.market_cap[currency.name].toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>24h High</span>
                <span className="font-semibold">
                  {currency.symbol}{coin.market_data.high_24h[currency.name].toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>24h Low</span>
                <span className="font-semibold">
                  {currency.symbol}{coin.market_data.low_24h[currency.name].toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-gradient-to-b from-[rgba(84,3,255,0.15)] to-[rgba(105,2,153,0.15)] p-6 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4">Price Chart (7 Days)</h2>
            {chartData && (
              <Line 
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                  scales: {
                    y: {
                      ticks: {
                        callback: function(value) {
                          return currency.symbol + value.toLocaleString();
                        }
                      }
                    }
                  }
                }}
              />
            )}
          </div>
        </div>

        {/* Description */}
        <div className="bg-gradient-to-b from-[rgba(84,3,255,0.15)] to-[rgba(105,2,153,0.15)] p-6 rounded-2xl mb-8">
          <h2 className="text-2xl font-bold mb-4">About {coin.name}</h2>
          <div 
            className="text-gray-300"
            dangerouslySetInnerHTML={{ __html: coin.description.en }}
          />
        </div>
      </div>
    </div>
  );
};

export default Coin;