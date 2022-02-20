import { API } from "aws-amplify";
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [coins, updateCoins] = useState([]);

  useEffect(() => {
    fetchCoins();
  }, []);

  const fetchCoins = async () => {
    const data = await API.get("cryptoapi", "/coin");
    updateCoins(data.coin);
  };
  return (
    <div className="App">
      {coins.map((coin, id) => (
        <div key={id}>
          <h2>
            {coin.name} - {coin.symbol}
          </h2>
          <p>$ {coin.price_usd}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
