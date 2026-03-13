import { useEffect, useState } from "react";

function App() {

  const [data, setData] = useState({
    gas: 0,
    temperature: 0,
    humidity: 0,
    freshness_score: 0,
    status: "Loading"
  });

  useEffect(() => {

    const fetchData = () => {
      fetch("http://127.0.0.1:8000/latest-data")
        .then(res => res.json())
        .then(data => {
          setData(data);
        })
        .catch(err => console.log(err));
    };

    fetchData();

    const interval = setInterval(fetchData, 3000);

    return () => clearInterval(interval);

  }, []);

  return (

    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f5f5f5"
    }}>

      <div style={{
        width: "300px",
        padding: "20px",
        borderRadius: "10px",
        backgroundColor: "white",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
      }}>

        <h2>Container 1 - Tomatoes</h2>

        <p><b>Gas Level:</b> {data.gas}</p>

        <p><b>Temperature:</b> {data.temperature} °C</p>

        <p><b>Humidity:</b> {data.humidity} %</p>

        <p><b>Freshness Score:</b> {data.freshness_score}</p>

        <p><b>Status:</b> {data.status}</p>

      </div>

    </div>

  );
}

export default App;