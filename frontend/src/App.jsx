import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import SetupWizard from "./components/SetupWizard";

function App() {
  // 1. View State: Control which "page" is visible
  const [currentView, setCurrentView] = useState("landing");
  const [containerCount, setContainerCount] = useState(6);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 2. Sensor Data State: This holds the live API response
  const [sensorData, setSensorData] = useState({
    gas: 0,
    temperature: 0,
    humidity: 0,
    freshness_score: 0,
    status: "Loading",
    food_type: "Tomato",
    shelf_life_days: 0
  });

  // 3. Your Fetch Logic: Integrated to run only when needed
  useEffect(() => {

  if (currentView !== "dashboard") return;

  const fetchData = () => {
    fetch("http://127.0.0.1:8000/latest-data")
      .then((res) => res.json())
      .then((data) => {
        setSensorData(data);
      })
      .catch((err) => console.log("Backend offline or error:", err));
  };

  fetchData();

  const interval = setInterval(fetchData, 3000);

  return () => clearInterval(interval);

}, [currentView]);

  // Handler functions
  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentView("dashboard");
  };

  const completeSetup = (count) => {
    setContainerCount(count);
    setCurrentView("dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar stays at the top across all views */}
      <Navbar 
        onNav={setCurrentView} 
        onLogin={handleLogin} 
        isLoggedIn={isLoggedIn} 
      />

      <main>
        {/* Landing Page Section */}
        {currentView === "landing" && (
          <Landing onStart={() => setCurrentView("setup")} />
        )}

        {/* Setup Wizard Section */}
        {currentView === "setup" && (
          <SetupWizard onComplete={completeSetup} />
        )}

        {/* The Dashboard Section: We pass sensorData down here */}
        {currentView === "dashboard" && (
          <Dashboard 
            count={containerCount} 
            liveData={sensorData} 
          />
        )}
      </main>
    </div>
  );
}

export default App;