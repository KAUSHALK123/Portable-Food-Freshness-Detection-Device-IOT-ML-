import React from 'react';

const Landing = ({ onStart }) => {
  const stages = [
    {
      step: 'Stage 1',
      title: 'Food Item',
      detail: 'Fresh produce enters monitored container',
      icon: <FoodIcon />,
      tone: 'from-emerald-50 to-lime-50 border-emerald-100',
    },
    {
      step: 'Stage 2',
      title: 'Camera + Sensors',
      detail: 'Image capture and environmental sensing',
      icon: <SensorsIcon />,
      tone: 'from-sky-50 to-cyan-50 border-sky-100',
    },
    {
      step: 'Stage 3',
      title: 'ESP32 Microcontroller',
      detail: 'Collects and transmits node data',
      icon: <ChipIcon />,
      tone: 'from-indigo-50 to-violet-50 border-indigo-100',
    },
    {
      step: 'Stage 4',
      title: 'Data Processing Engine',
      detail: 'Cleaning, normalization, and feature prep',
      icon: <ProcessingIcon />,
      tone: 'from-amber-50 to-orange-50 border-amber-100',
    },
    {
      step: 'Stage 5',
      title: 'AI Models',
      detail: 'Vision and sensor intelligence run in parallel',
      icon: <FusionIcon />,
      tone: 'from-violet-50 to-indigo-50 border-violet-100',
      models: [
        {
          label: 'Vision',
          color: 'bg-indigo-600',
          name: 'YOLOv8 Model',
          desc: 'Image freshness detection from camera feed',
        },
        {
          label: 'Sensor',
          color: 'bg-emerald-600',
          name: 'Random Forest Model',
          desc: 'Sensor data analysis for spoilage patterns',
        },
      ],
    },
    {
      step: 'Stage 6',
      title: 'Decision Fusion Engine',
      detail: 'Combines model outputs into one verdict',
      icon: <FusionIcon />,
      tone: 'from-fuchsia-50 to-rose-50 border-fuchsia-100',
    },
    {
      step: 'Stage 7',
      title: 'Output Classification',
      detail: 'Fresh / Ripe / Spoiled status',
      icon: <OutputIcon />,
      tone: 'from-teal-50 to-emerald-50 border-teal-100',
    },
    {
      step: 'Stage 8',
      title: 'Dashboard Display',
      detail: 'Live container insights for quick action',
      icon: <DashboardIcon />,
      tone: 'from-slate-50 to-gray-100 border-slate-200',
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-24 px-8 text-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=2000&q=80"
          alt="Supermarket background"
          className="absolute inset-0 h-full w-full object-cover blur-[4px] scale-110 opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-emerald-50/50" />
        
        <div className="relative z-10">
          <h1 className="text-6xl font-extrabold mb-4 text-gray-900">Smart Freshness Detection</h1>
          <p className="text-2xl text-emerald-700 font-semibold mb-4">For Modern Supermarkets</p>
          <p className="text-lg text-gray-700 mb-12 max-w-2xl mx-auto">Keep your produce shelves optimized with real-time freshness monitoring. Reduce waste. Boost profits. Delight customers.</p>
          <button
            onClick={onStart}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-12 py-4 rounded-xl font-bold text-lg shadow-lg transform transition hover:scale-105"
          >
            Start Monitoring Now
          </button>
        </div>
      </section>

      {/* Benefits for Supermarkets */}
      <section className="py-16 px-8 bg-gradient-to-r from-emerald-50 to-lime-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-emerald-100 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Real-Time Visibility</h3>
            <p className="text-gray-600">Monitor every container instantly on your dashboard</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md border border-lime-100 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Reduce Waste</h3>
            <p className="text-gray-600">Cut spoilage losses by up to 40% with smart alerts</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md border border-emerald-100 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Customer Trust</h3>
            <p className="text-gray-600">Display freshness confidence on digital price tags</p>
          </div>
        </div>
      </section>

      {/* System Architecture */}
      <section className="px-6 md:px-10 py-16 bg-gradient-to-b from-white to-emerald-50/30">
        <div className="max-w-4xl mx-auto rounded-3xl border border-emerald-200 bg-gradient-to-br from-white via-emerald-50/20 to-lime-50/20 shadow-xl shadow-emerald-200/30 p-6 md:p-10 relative overflow-hidden">
          <div className="text-center mb-8 md:mb-10 relative z-10">
            <p className="text-[11px] uppercase tracking-[0.22em] text-emerald-600 font-black mb-2">Pipeline View</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">How It Works</h2>
            <p className="max-w-3xl mx-auto text-sm md:text-base text-gray-600 mt-3">
              From supermarket shelf to dashboard: smart sensors track every container in real-time
            </p>
          </div>

          <div className="space-y-3 md:space-y-4">
            {stages.map((stage, idx) => (
              <React.Fragment key={stage.step}>
                <ArchitectureCard stage={stage} />
                {idx < stages.length - 1 && <FlowArrow />}
              </React.Fragment>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 md:p-5">
            <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm font-semibold text-gray-700">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">Fresh</span>
              <span className="text-gray-400">|</span>
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700">Ripe</span>
              <span className="text-gray-400">|</span>
              <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700">Spoiled</span>
              <span className="md:ml-auto text-gray-500">Live classification updates on the dashboard.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-gradient-to-b from-red-50 to-orange-50 px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">The Supermarket Challenge</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div className="bg-white rounded-2xl p-6 border border-red-100">
              <p className="text-gray-600"><strong>Billions Lost</strong> to food spoilage every year—even in advanced supermarkets</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-orange-100">
              <p className="text-gray-600"><strong>Static Expiry Dates</strong> don't reflect actual freshness—especially with temperature fluctuations</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-red-100">
              <p className="text-gray-600"><strong>Customer Returns</strong> spike when they find spoiled produce in "Fresh" sections</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-orange-100">
              <p className="text-gray-600"><strong>Manual Checks</strong> are time-consuming and error-prone for busy store staff</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-center text-gray-900">Supermarket-Powered Features</h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">Built specifically for retail operations and produce management</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-emerald-50 to-lime-50 rounded-2xl p-6 border border-emerald-100 hover:shadow-lg transition">
              <h3 className="font-bold text-gray-900 mb-2">Container Tracking</h3>
              <p className="text-sm text-gray-600">Monitor unlimited containers across shelf, storage, and transit</p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition">
              <h3 className="font-bold text-gray-900 mb-2">Smart Alerts</h3>
              <p className="text-sm text-gray-600">Get notified before spoilage happens—markup or donate options</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100 hover:shadow-lg transition">
              <h3 className="font-bold text-gray-900 mb-2">Profit Analytics</h3>
              <p className="text-sm text-gray-600">Track waste reduction ROI and optimize shelf lifecycles</p>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100 hover:shadow-lg transition">
              <h3 className="font-bold text-gray-900 mb-2">Staff Dashboard</h3>
              <p className="text-sm text-gray-600">Mobile-friendly interface for quick shelf audits and actions</p>
            </div>
            
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-100 hover:shadow-lg transition">
              <h3 className="font-bold text-gray-900 mb-2">Dynamic Pricing</h3>
              <p className="text-sm text-gray-600">Integrated discount recommendations for quick sell-through</p>
            </div>
            
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-100 hover:shadow-lg transition">
              <h3 className="font-bold text-gray-900 mb-2">Predictive Insights</h3>
              <p className="text-sm text-gray-600">AI forecasts spoilage 48+ hours in advance for action</p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-lime-50 rounded-2xl p-6 border border-yellow-100 hover:shadow-lg transition">
              <h3 className="font-bold text-gray-900 mb-2">Compliance Ready</h3>
              <p className="text-sm text-gray-600">Full audit trail and health/safety documentation</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 hover:shadow-lg transition">
              <h3 className="font-bold text-gray-900 mb-2">Eco Impact</h3>
              <p className="text-sm text-gray-600">Track waste reduction and carbon savings over time</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const ArchitectureCard = ({ stage }) => (
  <div className={`relative rounded-2xl border bg-gradient-to-br ${stage.tone} p-4 md:p-5 shadow-sm`}>
    <div className="flex items-start justify-between gap-4 mb-3">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm">
        {stage.icon}
      </div>
      <span className="text-[10px] uppercase tracking-wider font-black text-gray-500 bg-white/70 border border-gray-200 px-2 py-1 rounded-md">
        {stage.step}
      </span>
    </div>
    <h4 className="text-sm md:text-base font-black text-gray-900">{stage.title}</h4>
    <p className="text-xs md:text-sm text-gray-600 mt-1">{stage.detail}</p>
    {stage.models && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {stage.models.map((model) => (
          <div key={model.name} className="rounded-xl border border-white/80 bg-white p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <ModelBadge label={model.label} color={model.color} />
              <p className="text-xs font-black text-gray-900">{model.name}</p>
            </div>
            <p className="text-xs text-gray-600">{model.desc}</p>
          </div>
        ))}
      </div>
    )}
  </div>
);

const FlowArrow = () => (
  <div className="flex items-center justify-center text-gray-300 font-black text-2xl leading-none py-1">↓</div>
);

const ModelBadge = ({ label, color }) => (
  <span className={`${color} text-white text-[10px] uppercase tracking-wider font-black px-2 py-1 rounded-md`}>{label}</span>
);

const FoodIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-emerald-600">
    <circle cx="12" cy="13" r="6" stroke="currentColor" strokeWidth="1.7" />
    <path d="M12 7V4M12 4c1.2 1 2.5 1 3.5 0M12 4c-1.2 1-2.5 1-3.5 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

const SensorsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-sky-600">
    <path d="M4 6h8v12H4V6Zm8 3h8v9h-8V9Zm2-3h4v2h-4V6Z" stroke="currentColor" strokeWidth="1.7" />
  </svg>
);

const ChipIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-indigo-600">
    <rect x="7" y="7" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.7" />
    <path d="M10 10h4v4h-4v-4Z" stroke="currentColor" strokeWidth="1.7" />
    <path d="M3 9h3M3 15h3M18 9h3M18 15h3M9 3v3M15 3v3M9 18v3M15 18v3" stroke="currentColor" strokeWidth="1.7" />
  </svg>
);

const ProcessingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-amber-600">
    <path d="M5 7h14M5 12h14M5 17h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    <circle cx="17" cy="17" r="2" stroke="currentColor" strokeWidth="1.7" />
  </svg>
);

const FusionIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-fuchsia-600">
    <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.7" />
    <circle cx="16" cy="8" r="3" stroke="currentColor" strokeWidth="1.7" />
    <circle cx="12" cy="16" r="3" stroke="currentColor" strokeWidth="1.7" />
    <path d="M10.5 10.5 11 13M13.5 10.5 13 13" stroke="currentColor" strokeWidth="1.7" />
  </svg>
);

const OutputIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-teal-600">
    <path d="M6 12h12M12 6v12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.7" />
  </svg>
);

const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-slate-600">
    <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.7" />
    <path d="M7 15v-3M12 15V9M17 15v-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

export default Landing;