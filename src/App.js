import { API } from "aws-amplify";
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [coins, updateCoins] = useState([]);

  const [inputs, setInputs] = useState({ start: 0, limit: 10 });

  useEffect(() => {
    fetchCoins();
  }, []);

  const updateInputs = (type, value) => {
    setInputs({ ...inputs, [type]: value });
  };

  const fetchCoins = async () => {
    const { limit, start } = inputs;
    const data = await API.get(
      "cryptoapi",
      `/coin?limit=${limit}&start=${start}`
    );
    updateCoins(data.coins);
  };
  return (
    <div className="App">
      <div>
        <input
          type="text"
          placeholder="start=0"
          onChange={(e) => updateInputs("start", e.target.value)}
        />

        <input
          type="text"
          placeholder="limit=10"
          onChange={(e) => updateInputs("limit", e.target.value)}
        />
        <button onClick={fetchCoins}>Fetch coins</button>
      </div>
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
