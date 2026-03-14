import React from 'react';

/**
 * ContainerCard
 * Each card represents ONE sensor node (container).
 *   Node sensors: DHT11 (temperature + humidity) + MQ135 (gas)
 */
const normalizeStatus = (status, isLive) => {
  if (!isLive) return 'Offline';

  const normalized = String(status || '').toLowerCase();
  if (normalized === 'fresh') return 'Fresh';
  if (normalized === 'moderate') return 'Consume Soon';
  if (normalized === 'at_risk') return 'Spoiling';
  if (normalized === 'critical') return 'Spoiled';
  return 'Loading';
};

const ContainerCard = ({ id, data, isLive = false, lastSeenMs = null, hasEverReported = false, containerConfig, imageInfo }) => {
  const hasData = Boolean(data);
  const foodLabel = containerConfig?.food_type || data?.food_type || 'unassigned';
  const statusValue = hasData ? normalizeStatus(data.status, isLive) : 'Offline';

  const statusClasses = {
    Fresh:         { dot: 'bg-green-500',  text: 'text-green-600',  header: 'bg-green-50 border-green-100'  },
    'Consume Soon':{ dot: 'bg-yellow-400', text: 'text-yellow-600', header: 'bg-yellow-50 border-yellow-100'},
    Spoiling:      { dot: 'bg-orange-500', text: 'text-orange-600', header: 'bg-orange-50 border-orange-100'},
    Spoiled:       { dot: 'bg-red-500',    text: 'text-red-600',    header: 'bg-red-50 border-red-100'     },
    Loading:       { dot: 'bg-gray-300',   text: 'text-gray-400',   header: 'bg-gray-50 border-gray-100'   },
    Offline:       { dot: 'bg-gray-400',   text: 'text-gray-500',   header: 'bg-gray-50 border-gray-200'   },
  };

  const sc = statusClasses[statusValue] || statusClasses.Offline;

  const imageUrl = imageInfo?.image_url;
  const imageSource = imageInfo?.source || 'placeholder';

  const freshnessBarColor =
    !hasData ? 'bg-gray-200' :
    data.freshness_score >= 70 ? 'bg-green-500' :
    data.freshness_score >= 40 ? 'bg-yellow-400' :
    data.freshness_score >= 20 ? 'bg-orange-500' :
    'bg-red-500';

  const lastSeenLabel = formatLastSeen(lastSeenMs);

  return (
    <div
      className={`rounded-3xl border transition-all duration-500 bg-white ${
        !hasData
          ? 'border-dashed border-gray-200 opacity-80'
          : 'shadow-xl shadow-gray-200/50 border-white'
      }`}
    >
      {/* ── Header ── */}
      <div className={`p-4 border-b flex justify-between items-center rounded-t-3xl ${sc.header}`}>
        <div>
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Container #{id}</span>
          <p className="text-xs font-semibold text-gray-700 uppercase mt-0.5">{foodLabel}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className={`h-2.5 w-2.5 rounded-full ${sc.dot}`} />
          <p className={`text-[10px] font-bold uppercase ${sc.text}`}>{statusValue}</p>
        </div>
      </div>

      <div className="p-5">
        {/* ── Image Feed ── */}
        <div className="rounded-2xl overflow-hidden border border-gray-100 bg-gray-100 mb-4 h-32 relative">
          {imageUrl ? (
            <img src={imageUrl} alt={`Container ${id}`} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-xs text-gray-400">
              No image feed
            </div>
          )}
          <span className="absolute top-2 right-2 text-[10px] uppercase bg-black/70 text-white px-2 py-1 rounded-full">
            {imageSource}
          </span>
        </div>

        {hasData ? (
          <>
            {/* ── Freshness Score Bar ── */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                  Freshness Score
                </span>
                <span className={`text-sm font-black ${sc.text}`}>
                  {data.freshness_score}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-700 ${freshnessBarColor}`}
                  style={{ width: `${data.freshness_score}%` }}
                />
              </div>
            </div>

            {/* ── Sensor Readings (DHT11 + MQ135) ── */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <SensorBox label="Temp" val={data.temperature} unit="°C" />
              <SensorBox label="Humidity" val={data.humidity} unit="%" />
              <SensorBox label="Gas" val={data.gas} unit="ppm" />
            </div>

            <p className={`text-[10px] uppercase tracking-wider font-bold mb-3 ${isLive ? 'text-emerald-600' : 'text-amber-600'}`}>
              {isLive ? 'Live feed active' : `Stale reading • last seen ${lastSeenLabel || 'unknown'}`}
            </p>

            {/* ── Shelf Life + Discount ── */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-900 text-white p-3 rounded-2xl">
                <p className="text-[9px] opacity-60 uppercase tracking-wider">Shelf Life Est.</p>
                <p className="font-bold text-sm mt-0.5">{data.shelf_life_days} days</p>
              </div>
              <div className={`p-3 rounded-2xl border ${sc.header}`}>
                <p className="text-[9px] text-gray-500 uppercase tracking-wider">Discount</p>
                <p className={`font-bold text-sm mt-0.5 ${sc.text}`}>{data.recommended_discount}</p>
              </div>
            </div>

            {/* ── Action Hint ── */}
            {data.action && (
              <p className="mt-3 text-[10px] text-gray-500 italic text-center">{data.action}</p>
            )}
          </>
        ) : (
          <div className="py-8 text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
              <span className="text-gray-300 text-xl font-bold">!</span>
            </div>
            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Offline</p>
            <p className="text-[10px] text-gray-400 mt-1">
              {hasEverReported && lastSeenLabel ? `Last seen ${lastSeenLabel} ago.` : "No sensor data yet."}
            </p>
            {containerConfig && (
              <div className="mt-4 text-xs text-gray-500 leading-5 space-y-0.5">
                <p>DHT11: {containerConfig.has_temp_humidity_sensor ? '✓ Installed' : '✗ Not installed'}</p>
                <p>MQ135: {containerConfig.has_gas_sensor ? '✓ Installed' : '✗ Not installed'}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const SensorBox = ({ label, val, unit }) => (
  <div className="bg-gray-50 p-2 rounded-xl text-center border border-gray-100">
    <p className="text-[8px] font-black text-gray-400 uppercase mb-0.5">{label}</p>
    <p className="font-mono font-bold text-gray-700 text-sm">
      {val ?? '—'}
      <span className="text-[8px] ml-0.5 font-normal">{unit}</span>
    </p>
  </div>
);

const formatLastSeen = (lastSeenMs) => {
  if (!lastSeenMs) return null;

  const seconds = Math.max(0, Math.floor((Date.now() - lastSeenMs) / 1000));
  if (seconds < 60) return `${seconds}s`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  return `${hours}h`;
};

export default ContainerCard;