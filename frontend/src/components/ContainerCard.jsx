import React from 'react';

const ContainerCard = ({ id, data }) => {
  // Status colors for the little dot and text
  const statusMap = {
    "Fresh": "bg-green-500 text-green-600",
    "Consume Soon": "bg-yellow-500 text-yellow-600",
    "Spoiled": "bg-red-500 text-red-600",
    "Loading": "bg-gray-300 text-gray-400"
  };

  return (
    <div className={`rounded-3xl border transition-all duration-500 bg-white ${!data ? 'border-dashed border-gray-200 opacity-50' : 'shadow-xl shadow-gray-200/50 border-white'}`}>
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center bg-gray-50/50 rounded-t-3xl">
        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Container #{id}</span>
        {data && <div className={`h-2.5 w-2.5 rounded-full ${statusMap[data.status]?.split(' ')[0]} animate-pulse`}></div>}
      </div>
      
      <div className="p-6">
        {data ? (
          <>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{data.food_type || "Tomato"}</h3>
                <span className={`text-[10px] font-bold uppercase ${statusMap[data.status]?.split(' ')[1]}`}>{data.status}</span>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase leading-none">Freshness</p>
                <p className="text-2xl font-black text-green-600">{data.freshness_score}%</p>
              </div>
            </div>

            {/* Sensor Grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <SensorBox label="Gas" val={data.gas} unit="ppm" />
              <SensorBox label="Temp" val={data.temperature} unit="°C" />
              <SensorBox label="Hum" val={data.humidity} unit="%" />
            </div>

            {/* Prediction Footer */}
            <div className="flex justify-between items-center bg-gray-900 text-white p-4 rounded-2xl shadow-lg shadow-gray-300">
              <span className="text-xs opacity-70">Shelf Life Est.</span>
              <span className="font-bold">{data.shelf_life_days || 0} Days</span>
            </div>
          </>
        ) : (
          <div className="py-12 text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
               <span className="text-gray-300 text-xl font-bold">!</span>
            </div>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">No Node Detected</p>
            <p className="text-[10px] text-gray-300 mt-1">SENSORS: NULL</p>
          </div>
        )}
      </div>
    </div>
  );
};

const SensorBox = ({ label, val, unit }) => (
  <div className="bg-gray-50 p-2 rounded-xl text-center border border-gray-100">
    <p className="text-[8px] font-black text-gray-400 uppercase mb-1">{label}</p>
    <p className="font-mono font-bold text-gray-700 text-sm">{val}<span className="text-[8px] ml-0.5">{unit}</span></p>
  </div>
);

export default ContainerCard;