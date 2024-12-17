import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Coin from "./pages/Coin/Coin";
import Navbar from "./components/Navbar/Navbar";

const App = () => {
  return (
    <div className="min-h-screen text-white bg-gradient-to-b from-[#0b004e] via-[#1d152f] to-[#002834]">
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coin/:id" element={<Coin/>} />
      </Routes>
    </div>
  );
};

export default App;
