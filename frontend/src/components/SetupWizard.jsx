import React, { useEffect, useMemo, useState } from 'react';
import { apiFetch, authHeaders, endpoints } from '../utils/api';

const buildContainers = (count) =>
  Array.from({ length: count }).map((_, idx) => ({
    container_index: idx + 1,
    container_name: `Container ${idx + 1}`,
    food_type: idx === 0 ? 'tomato' : 'unassigned',
    has_gas_sensor: true,
    has_temp_humidity_sensor: true,
    has_camera: false,
  }));

const SetupWizard = ({ token, onComplete, initialCount = 6, initialContainers = [] }) => {
  const [step, setStep] = useState(1);
  const [count, setCount] = useState(initialCount);
  const [containers, setContainers] = useState(initialContainers.length ? initialContainers : buildContainers(initialCount));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setContainers((prev) => {
      if (prev.length === count) return prev;
      return buildContainers(Number(count));
    });
  }, [count]);

  const canSubmit = useMemo(
    () => containers.every((c) => c.container_name.trim() && c.food_type.trim()),
    [containers]
  );

  const updateContainer = (index, key, value) => {
    setContainers((prev) =>
      prev.map((container) =>
        container.container_index === index ? { ...container, [key]: value } : container
      )
    );
  };

  const saveConfiguration = async () => {
    if (!token) {
      setError('Please login first.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const payload = {
        container_count: Number(count),
        containers: containers.map((container) => ({
          ...container,
          container_index: Number(container.container_index),
        })),
      };

      const response = await apiFetch(endpoints.setupConfig, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify(payload),
      });

      onComplete({ count: response.container_count, containers: response.containers || payload.containers });
    } catch (apiError) {
      setError(apiError.message || 'Failed to save setup');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
      {step === 1 ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">Setup Supermarket</h2>
          <label className="block text-sm font-bold mb-2 uppercase">Number of Containers</label>
          <input 
            type="number" 
            value={count}
            min={1}
            max={200}
            onChange={(e) => setCount(Number(e.target.value) || 1)}
            className="w-full border p-4 rounded-xl mb-6 outline-none focus:border-green-500" 
          />
          <button 
            onClick={() => setStep(2)} 
            className="w-full bg-green-600 text-white py-4 rounded-xl font-bold"
          >
            Next
          </button>
        </div>
      ) : step === 2 ? (
        <div>
          <h2 className="text-2xl font-bold mb-2">Container Configuration</h2>
          <p className="text-gray-500 mb-6">Define food type and sensor availability for each container.</p>

          <div className="space-y-4 max-h-[55vh] overflow-auto pr-2">
            {containers.map((container) => (
              <div key={container.container_index} className="border rounded-xl p-4 bg-gray-50">
                <p className="text-xs font-bold tracking-widest text-gray-500 mb-3">CONTAINER {container.container_index}</p>
                <div className="grid md:grid-cols-2 gap-3 mb-3">
                  <input
                    value={container.container_name}
                    onChange={(e) => updateContainer(container.container_index, 'container_name', e.target.value)}
                    className="border p-3 rounded-lg"
                    placeholder="Container name"
                  />
                  <input
                    value={container.food_type}
                    onChange={(e) => updateContainer(container.container_index, 'food_type', e.target.value)}
                    className="border p-3 rounded-lg"
                    placeholder="Food type"
                  />
                </div>

                <div className="flex flex-wrap gap-3 text-sm">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={container.has_gas_sensor}
                      onChange={(e) => updateContainer(container.container_index, 'has_gas_sensor', e.target.checked)}
                    />
                    Gas Sensor
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={container.has_temp_humidity_sensor}
                      onChange={(e) => updateContainer(container.container_index, 'has_temp_humidity_sensor', e.target.checked)}
                    />
                    Temperature/Humidity Sensor
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={container.has_camera}
                      onChange={(e) => updateContainer(container.container_index, 'has_camera', e.target.checked)}
                    />
                    Camera (optional)
                  </label>
                </div>
              </div>
            ))}
          </div>

          {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

          <div className="grid md:grid-cols-2 gap-3 mt-6">
            <button
              onClick={() => setStep(1)}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-bold"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!canSubmit}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-bold disabled:opacity-60"
            >
              Review
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-2">Review and Save</h2>
          <p className="text-gray-500 mb-4">You are configuring {count} containers.</p>

          <div className="text-sm text-gray-700 space-y-2 mb-6 max-h-64 overflow-auto pr-2">
            {containers.map((container) => (
              <div key={container.container_index} className="bg-gray-50 p-3 rounded-lg border">
                <strong>{container.container_name}</strong> | {container.food_type} | Sensors:
                {' '}
                {container.has_gas_sensor ? 'Gas ' : ''}
                {container.has_temp_humidity_sensor ? 'Temp/Hum ' : ''}
                {container.has_camera ? 'Camera' : ''}
              </div>
            ))}
          </div>

          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

          <button 
            onClick={saveConfiguration}
            disabled={saving}
            className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Finish Setup'}
          </button>
        </div>
      )}
    </div>
  );
};

export default SetupWizard; // <--- MAKE SURE THIS IS HERE