import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import SetupWizard from "./components/SetupWizard";
import Login from "./pages/Login";
import { apiFetch, authHeaders, endpoints } from "./utils/api";

const defaultSensorData = {
  temperature: 0,
  humidity: 0,
  gas: 0,
  freshness_score: 0,
  status: "Loading",
  food_type: "Unknown",
  shelf_life_days: 0,
  recommended_discount: "N/A",
  action: "",
};

function App() {
  const [currentView, setCurrentView] = useState("landing");
  const [containerCount, setContainerCount] = useState(6);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("auth_token") || "");
  const [user, setUser] = useState(null);
  const [containers, setContainers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [analyticsOverview, setAnalyticsOverview] = useState(null);
  const [analyticsMonthly, setAnalyticsMonthly] = useState(null);

  const [containerData, setContainerData] = useState({});

  useEffect(() => {
    if (!token) return;

    const bootstrap = async () => {
      try {
        const profile = await apiFetch(endpoints.me, {
          headers: authHeaders(token),
        });
        setUser(profile);
        setIsLoggedIn(true);

        const setup = await apiFetch(endpoints.setupConfig, {
          headers: authHeaders(token),
        });

        if (setup.container_count > 0) {
          setContainerCount(setup.container_count);
          setContainers(setup.containers || []);
          setCurrentView("dashboard");
        } else {
          setCurrentView("setup");
        }
      } catch {
        localStorage.removeItem("auth_token");
        setToken("");
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    bootstrap();
  }, [token]);

  useEffect(() => {
    if (currentView !== "dashboard") return;

    const fetchData = () => {
      apiFetch(endpoints.latestData)
        .then((res) => {
          if (res.containers && Array.isArray(res.containers)) {
            const dict = {};
            for (const c of res.containers) {
              dict[c.container_id] = c;
            }
            setContainerData(dict);
          }
        })
        .catch((err) => console.log("Backend offline or error:", err.message));
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [currentView]);

  useEffect(() => {
    if (!token || currentView !== "dashboard") return;

    const fetchMeta = async () => {
      try {
        const [alertsRes, analyticsRes, overviewRes, monthlyRes] = await Promise.all([
          apiFetch(endpoints.alerts, { headers: authHeaders(token) }),
          apiFetch(endpoints.analytics, { headers: authHeaders(token) }),
          apiFetch(endpoints.analyticsOverview, { headers: authHeaders(token) }),
          apiFetch(endpoints.analyticsMonthly, { headers: authHeaders(token) }),
        ]);

        setAlerts(alertsRes);
        setAnalytics(analyticsRes);
        setAnalyticsOverview(overviewRes);
        setAnalyticsMonthly(monthlyRes);
      } catch (error) {
        console.log("Metadata fetch error:", error.message);
      }
    };

    fetchMeta();
    const timer = setInterval(fetchMeta, 6000);
    return () => clearInterval(timer);
  }, [currentView, token]);

  const handleAuthSuccess = (payload) => {
    localStorage.setItem("auth_token", payload.access_token);
    setToken(payload.access_token);
    setIsLoggedIn(true);
    setUser(payload.user);
    setCurrentView("setup");
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    setToken("");
    setUser(null);
    setIsLoggedIn(false);
    setAlerts([]);
    setAnalytics(null);
    setCurrentView("landing");
  };

  const completeSetup = ({ count, containers: setupContainers }) => {
    setContainerCount(count);
    setContainers(setupContainers);
    setCurrentView("dashboard");
  };

  const navigate = (view) => {
    if (!isLoggedIn && (view === "setup" || view === "dashboard")) {
      setCurrentView("login");
      return;
    }
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-100">
      <Navbar 
        onNav={navigate}
        onLogin={() => setCurrentView("login")}
        onLogout={handleLogout}
        isLoggedIn={isLoggedIn}
        supermarketName={user?.supermarket_name}
      />

      <main className="max-w-7xl mx-auto w-full">
        {currentView === "landing" && (
          <Landing onStart={() => setCurrentView(isLoggedIn ? "setup" : "login")} />
        )}

        {currentView === "login" && (
          <Login onAuthSuccess={handleAuthSuccess} />
        )}

        {currentView === "setup" && (
          <SetupWizard
            token={token}
            initialCount={containerCount}
            initialContainers={containers}
            onComplete={completeSetup}
          />
        )}

        {currentView === "dashboard" && (
          <Dashboard 
            count={containerCount}
            containerData={containerData}
            containers={containers}
            alerts={alerts}
            analytics={analytics}
            analyticsOverview={analyticsOverview}
            analyticsMonthly={analyticsMonthly}
          />
        )}

      </main>
    </div>
  );
}

export default App;