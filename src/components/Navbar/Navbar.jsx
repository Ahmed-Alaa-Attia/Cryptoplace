import logo from "../../assets/logo.png";
import arrow from "../../assets/arrow_icon.png";
import { useContext } from "react";
import { coinContext } from "../../context/CoinContext";
const Navbar = () => {
  const { setCurrency } = useContext(coinContext);

  const handleCurrencyChange = (event) => {
    switch (event.target.name) {
      case "usd": {
        setCurrency({ name: "usd", symbol: "$" });
        break;
      }
      case "eur": {
        setCurrency({ name: "eur", symbol: "*" });
        break;
      }
      default: {
        setCurrency({ name: "usd", symbol: "$" });
        break;
      }
    }
  };
  return (
    <div className="flex justify-between items-center py-5 px-[10%] text-slate-300 border-b-2 border-slate-600">
      <img src={logo} alt="" className="w-[max(12vw,120px)]" />
      <ul className="hidden lg:flex gap-10">
        <li>Home</li>
        <li>Features</li>
        <li>Pricing</li>
        <li>Blog</li>
      </ul>
      <div className="flex items-center gap-[max(1vw,12px)]">
        <select
          onChange={handleCurrencyChange}
          className="py-1 px-2 border-2 rounded-md border-white bg-transparent text-white"
        >
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
          <option value="egp">EGP</option>
        </select>
        <button className="hidden sm:flex items-center gap-3 rounded-3xl bg-white py-2 px-6 text-base text-slate-600 font-medium cursor-pointer">
          Sign Up <img src={arrow} alt="" className="w-4" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
