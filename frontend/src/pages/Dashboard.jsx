import { useEffect, useMemo, useState } from "react";
import ContainerCard from "../components/ContainerCard";
import { apiFetch, endpoints } from "../utils/api";

const API_BASE = "http://127.0.0.1:8000";
const SENSOR_TIMEOUT_MS = 30000;

const Dashboard = ({
  count,
  containerData = {},
  containers = [],
  alerts = [],
  analytics = null,
  analyticsOverview = null,
  analyticsMonthly = null,
}) => {
  const [images, setImages] = useState({});

  const containerSlots = useMemo(() => {
    if (containers.length > 0) {
      return containers.map((container, idx) => ({
        id: container.container_index || idx + 1,
        config: container,
      }));
    }
    return Array.from({ length: count }).map((_, idx) => ({
      id: idx + 1,
      config: null,
    }));
  }, [containers, count]);

  useEffect(() => {
    const fetchImages = async () => {
      const entries = await Promise.all(
        containerSlots.map(async (slot) => {
          try {
            const imageInfo = await apiFetch(endpoints.containerImage(slot.id));
            const normalizedUrl = imageInfo.image_url?.startsWith("/")
              ? `${API_BASE}${imageInfo.image_url}`
              : imageInfo.image_url;
            return [slot.id, { ...imageInfo, image_url: normalizedUrl }];
          } catch {
            return [
              slot.id,
              {
                container_id: slot.id,
                source: "placeholder",
                image_url:
                  "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=60",
              },
            ];
          }
        })
      );
      setImages(Object.fromEntries(entries));
    };
    fetchImages();
  }, [containerSlots]);

  // Overview tile values – prefer real-time overview, fall back to summary
  const totalContainers = analyticsOverview?.total_containers ?? analytics?.total_containers_monitored ?? count;
  const atRisk = analyticsOverview?.containers_at_risk ?? analytics?.spoilage_risk_containers ?? 0;
  const estLoss = analyticsOverview?.estimated_loss ?? 0;
  const estSaved = analyticsOverview?.estimated_saved ?? analytics?.estimated_money_saved_inr ?? 0;

  const parseTimestampMs = (rawTs) => {
    if (!rawTs) return null;
    const normalizedTs = String(rawTs)
      .replace(" ", "T")
      .replace(/\.(\d{3})\d+/, ".$1");
    const hasTimezone = /[zZ]|[+-]\d{2}:\d{2}$/.test(normalizedTs);
    const ts = new Date(hasTimezone ? normalizedTs : `${normalizedTs}Z`).getTime();
    return Number.isNaN(ts) ? null : ts;
  };

  const getContainerSnapshot = (containerId) => {
    const entry = containerData[containerId];
    if (!entry) {
      return { data: null, lastSeenMs: null, hasEverReported: false, isLive: false };
    }

    const lastSeenMs = parseTimestampMs(entry.timestamp);
    if (!lastSeenMs) {
      return { data: entry, lastSeenMs: null, hasEverReported: true, isLive: false };
    }

    const isLive = Date.now() - lastSeenMs <= SENSOR_TIMEOUT_MS;
    return {
      data: entry,
      lastSeenMs,
      hasEverReported: true,
      isLive,
    };
  };

  return (
    <div className="p-6 md:p-10 space-y-8">

      {/* ── KPI Summary Tiles ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryTile label="Total Containers" value={totalContainers} accent="emerald" />
        <SummaryTile label="Containers at Risk" value={atRisk} accent="red" />
        <SummaryTile label="Est. Loss (₹)" value={`₹${estLoss.toLocaleString()}`} accent="orange" />
        <SummaryTile label="Est. Saved (₹)" value={`₹${estSaved.toLocaleString()}`} accent="green" />
      </div>

      {/* ── Container Cards ── */}
      <section>
        <h2 className="text-base font-black uppercase tracking-widest text-gray-400 mb-4">
          Live Container Monitor
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {containerSlots.map((slot) => {
            const snapshot = getContainerSnapshot(slot.id);
            return (
              <ContainerCard
                key={slot.id}
                id={slot.id}
                data={snapshot.data}
                isLive={snapshot.isLive}
                lastSeenMs={snapshot.lastSeenMs}
                hasEverReported={snapshot.hasEverReported}
                containerConfig={slot.config}
                imageInfo={images[slot.id]}
              />
            );
          })}
        </div>
      </section>

      {/* ── Analytics Panel ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Spoilage Events Bar Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-1">
            Monthly Spoilage Events
          </h3>
          <p className="text-xs text-gray-400 mb-4">Last 30 days — each bar = 1 day</p>
          <MiniBarChart
            data={analyticsMonthly?.spoilage_events ?? []}
            color="bg-red-400"
            emptyColor="bg-gray-100"
          />
        </div>

        {/* Revenue Saved Area Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-1">
            Revenue Saved (₹)
          </h3>
          <p className="text-xs text-gray-400 mb-4">Last 30 days — early discount savings</p>
          <MiniBarChart
            data={analyticsMonthly?.saved_revenue ?? []}
            color="bg-emerald-400"
            emptyColor="bg-gray-100"
          />
        </div>
      </section>

      {/* ── Recent Alerts ── */}
      <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h3 className="text-lg font-bold mb-4">Recent Alerts</h3>
        {alerts.length === 0 ? (
          <p className="text-sm text-gray-500">No alerts yet.</p>
        ) : (
          <div className="space-y-2">
            {alerts.slice(0, 5).map((alert) => (
              <div key={alert.id} className="rounded-lg border border-amber-100 bg-amber-50 p-3">
                <p className="text-sm font-semibold text-amber-800">{alert.alert_type.replace("_", " ")}</p>
                <p className="text-xs text-amber-700">{alert.message}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

/* ── Sub-components ── */

const accentMap = {
  emerald: "text-emerald-600",
  green: "text-green-600",
  red: "text-red-500",
  orange: "text-orange-500",
};

const SummaryTile = ({ label, value, accent = "emerald" }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
    <p className="text-xs uppercase tracking-widest text-gray-400">{label}</p>
    <p className={`text-xl font-black mt-1 ${accentMap[accent] ?? "text-gray-900"}`}>{value}</p>
  </div>
);

/**
 * A compact bar chart rendered entirely with Tailwind divs.
 * Shows the last 30 data points (or fewer). Heights are normalised to the
 * tallest bar. Falls back to flat placeholder bars when data is empty.
 */
const MiniBarChart = ({ data = [], color = "bg-emerald-400", emptyColor = "bg-gray-100" }) => {
  const visible = data.slice(-30);
  const max = Math.max(...visible, 1);

  if (visible.length === 0) {
    return (
      <div className="flex items-end gap-0.5 h-20">
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className={`flex-1 h-2 rounded-sm ${emptyColor}`} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-end gap-0.5 h-20">
      {visible.map((val, i) => (
        <div
          key={i}
          className={`flex-1 rounded-sm transition-all duration-300 ${val > 0 ? color : emptyColor}`}
          style={{ height: `${Math.max(4, (val / max) * 100)}%` }}
          title={`Day ${i + 1}: ${val}`}
        />
      ))}
    </div>
  );
};

export default Dashboard;