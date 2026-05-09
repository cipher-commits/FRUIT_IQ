import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  LayoutDashboard, 
  Scan, 
  Database, 
  TrendingUp, 
  MessageSquare, 
  History, 
  ShieldCheck, 
  Leaf, 
  Menu, 
  X,
  Camera,
  Upload,
  AlertCircle,
  FileText,
  Search,
  ChevronRight,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { cn } from './lib/utils';
import { VARIETIES, DISEASES } from './constants';
import { AnalysisResult, MandiRate } from './types';

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick, ...props }: { icon: any, label: string, active: boolean, onClick: () => void, [key: string]: any }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group w-full text-left",
      active 
        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20" 
        : "text-slate-400 hover:bg-slate-800 hover:text-emerald-400"
    )}
  >
    <Icon size={20} className={cn("transition-transform duration-200", active ? "scale-110" : "group-hover:scale-110")} />
    <span className="font-medium">{label}</span>
  </button>
);

const StatCard = ({ label, value, trend, icon: Icon }: { label: string, value: string, trend?: string, icon: any }) => (
  <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
        <Icon size={24} />
      </div>
      {trend && (
        <span className={cn(
          "text-xs font-bold px-2 py-1 rounded-full",
          trend.startsWith('+') ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
        )}>
          {trend}
        </span>
      )}
    </div>
    <div className="text-slate-400 text-sm font-medium">{label}</div>
    <div className="text-2xl font-bold text-white mt-1">{value}</div>
  </div>
);

// --- Views ---

const DashboardView = () => {
  const data = [
    { name: 'Mon', price: 240 },
    { name: 'Tue', price: 290 },
    { name: 'Wed', price: 270 },
    { name: 'Thu', price: 340 },
    { name: 'Fri', price: 320 },
    { name: 'Sat', price: 380 },
    { name: 'Sun', price: 410 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Active Cultivars" value="14" icon={Leaf} />
        <StatCard label="Live Scans" value="1,240" trend="+12%" icon={Scan} />
        <StatCard label="Market Avg" value="342 PKR" trend="+5.4%" icon={TrendingUp} />
        <StatCard label="System Health" value="Optimal" icon={ShieldCheck} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-white font-bold mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-emerald-500" />
            Market Price Index (Weekly)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Line type="monotone" dataKey="price" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-white font-bold mb-6 flex items-center gap-2">
            <Database size={20} className="text-emerald-500" />
            Stock Inventory Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Bar dataKey="price" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const ScannerView = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showCamera, setShowCamera] = useState(false);

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError("Unable to access camera");
      setShowCamera(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setImage(dataUrl);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;
    setAnalyzing(true);
    setError(null);
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("Gemini API Key missing. Please configure it in the secrets panel.");
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const prompt = "Analyze this fruit image. Identify the variety (is it Sindhri, Chaunsa, Anwar Ratool, Langra, Ajwa, or Aseel?), give a confidence percentage, a quality score (0-100), ripeness stage, any defects found, and a market recommendation. Return as JSON: {variety, confidence, quality_score, ripeness, defects[], recommendation}";

      const imagePart = {
        inlineData: {
          mimeType: "image/jpeg",
          data: image.split(",")[1],
        },
      };

      const result = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: { parts: [imagePart, { text: prompt }] },
      });

      const text = result.text;
      if (!text) throw new Error("No response from AI");

      // Attempt to parse JSON
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          setResult(JSON.parse(jsonMatch[0]));
        } else {
          setError("AI response was not in the expected format.");
        }
      } catch (e) {
        setError("Failed to parse AI response.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-white mb-2">Neural Scanner</h2>
          <p className="text-slate-400 mb-8">AI-powered quality assessment and variety identification</p>

          {!image && !showCamera && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button 
                onClick={startCamera}
                className="flex flex-col items-center justify-center gap-4 p-12 border-2 border-dashed border-slate-700 rounded-2xl hover:border-emerald-500 hover:bg-emerald-500/5 transition-all group"
              >
                <Camera size={48} className="text-slate-500 group-hover:text-emerald-500 transition-colors" />
                <span className="text-slate-400 font-medium group-hover:text-emerald-400">Use Live Camera</span>
              </button>
              <label className="flex flex-col items-center justify-center gap-4 p-12 border-2 border-dashed border-slate-700 rounded-2xl hover:border-emerald-500 hover:bg-emerald-500/5 transition-all cursor-pointer group">
                <Upload size={48} className="text-slate-500 group-hover:text-emerald-500 transition-colors" />
                <span className="text-slate-400 font-medium group-hover:text-emerald-400">Upload Image</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              </label>
            </div>
          )}

          {showCamera && (
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
                <button onClick={captureImage} className="bg-white text-black px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-emerald-400 transition-colors">
                  <Camera size={20} /> Capture
                </button>
                <button onClick={stopCamera} className="bg-slate-800 text-white px-6 py-2 rounded-full font-bold hover:bg-rose-600 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {image && !analyzing && !result && (
            <div className="space-y-6">
              <div className="relative rounded-2xl overflow-hidden aspect-video">
                <img src={image} className="w-full h-full object-cover" alt="To analyze" />
                <button 
                  onClick={() => setImage(null)} 
                  className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-rose-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <button 
                onClick={analyzeImage}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-900/20 transition-all"
              >
                Start Neural Analysis
              </button>
            </div>
          )}

          {analyzing && (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-emerald-500 font-bold animate-pulse">Running AI Vision Models...</p>
            </div>
          )}

          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-1">{result.variety}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-500 font-bold">{result.confidence}% Confidence</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400">{result.ripeness}</span>
                  </div>
                </div>
                <div className={cn(
                  "h-20 w-20 rounded-full border-4 flex items-center justify-center text-xl font-bold",
                  result.quality_score > 80 ? "border-emerald-500 text-emerald-500" : "border-amber-500 text-amber-500"
                )}>
                  {result.quality_score}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/50 p-4 rounded-xl">
                  <h4 className="text-slate-400 text-sm mb-2 flex items-center gap-1"><AlertCircle size={14} /> Detected Defects</h4>
                  <ul className="text-white space-y-1">
                    {result.defects.length > 0 ? (
                      result.defects.map((d, i) => <li key={i} className="flex items-center gap-2">• {d}</li>)
                    ) : (
                      <li className="text-emerald-500">None detected</li>
                    )}
                  </ul>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-xl">
                  <h4 className="text-slate-400 text-sm mb-2 flex items-center gap-1"><ChevronRight size={14} /> Recommendation</h4>
                  <p className="text-white font-medium">{result.recommendation}</p>
                </div>
              </div>

              <button 
                onClick={() => {setResult(null); setImage(null);}} 
                className="w-full border border-slate-700 text-slate-400 py-3 rounded-xl hover:bg-slate-800 transition-all font-bold"
              >
                Scan Another Fruit
              </button>
            </motion.div>
          )}

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/50 p-4 rounded-xl text-rose-500 flex items-center gap-3">
              <AlertCircle />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

const MarketView = () => {
  const [rates, setRates] = useState<MandiRate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/mandi-rates')
      .then(res => res.json())
      .then(data => {
        setRates(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rates.map((rate, i) => (
          <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp size={64} className="text-emerald-500" />
            </div>
            <div className="text-xs font-bold text-emerald-500 mb-1">{rate.city}</div>
            <h4 className="text-xl font-bold text-white">{rate.variety}</h4>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">{rate.price}</span>
              <span className="text-slate-500 text-sm">PKR/kg</span>
            </div>
            <div className={cn(
              "mt-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1",
              rate.trend === 'up' ? "text-emerald-500" : rate.trend === 'down' ? "text-rose-500" : "text-amber-500"
            )}>
              {rate.trend === 'up' && "▲ Increasing Demand"}
              {rate.trend === 'down' && "▼ Supply Surplus"}
              {rate.trend === 'stable' && "● Market Stable"}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-800/50 text-slate-400 text-sm uppercase tracking-wider font-bold">
              <th className="px-6 py-4">Crop Variety</th>
              <th className="px-6 py-4">Mandi Location</th>
              <th className="px-6 py-4 text-right">Current Price</th>
              <th className="px-6 py-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {rates.map((rate, i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-white font-bold">{rate.variety}</td>
                <td className="px-6 py-4 text-slate-400">{rate.city}</td>
                <td className="px-6 py-4 text-white font-black text-right">{rate.price} PKR</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase",
                      rate.trend === 'up' ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-700 text-slate-400"
                    )}>
                      {rate.trend === 'up' ? "Trend High" : "Normal"}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const VaultView = () => {
  const [filter, setFilter] = useState<'All' | 'Mango' | 'Date'>('All');
  
  const filtered = filter === 'All' ? VARIETIES : VARIETIES.filter(v => v.category === filter);

  return (
    <div className="space-y-8">
      <div className="flex gap-2 bg-slate-900 p-1 rounded-xl w-fit border border-slate-800">
        {(['All', 'Mango', 'Date'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-6 py-2 rounded-lg font-bold text-sm transition-all",
              filter === f ? "bg-emerald-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(variety => (
          <div key={variety.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all group">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-emerald-500 text-black text-[10px] font-black rounded-lg uppercase tracking-wider">
                  {variety.category}
                </span>
                <span className="text-slate-600 text-xs font-mono">{variety.id}</span>
              </div>
              <h4 className="text-2xl font-bold text-white mb-2">{variety.name}</h4>
              <p className="text-slate-400 text-sm line-clamp-2 mb-6">{variety.description}</p>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Origin</span>
                  <span className="text-white font-medium">{variety.origin}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Season</span>
                  <span className="text-white font-medium">{variety.season}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Avg Market Price</span>
                  <span className="text-emerald-500 font-bold">{variety.avg_price}</span>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-800/50 border-t border-slate-800 flex justify-between items-center group-hover:bg-emerald-500/5 transition-colors">
              <span className="text-xs text-slate-500 font-medium">Click for agronomy data</span>
              <ChevronRight size={18} className="text-slate-500 group-hover:text-emerald-500" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdvisoryView = () => {
  const sections = [
    {
      title: "Seasonal Calendar (Pakistan)",
      icon: Leaf,
      items: [
        { label: "Mango Peak", value: "May – July", detail: "Sindhri begins mid-May; Chaunsa peaks late June." },
        { label: "Date Harvest", value: "August – September", detail: "Khairpur region Aseel dates harvest begins." },
        { label: "Pruning Phase", value: "Oct – Dec", detail: "Orchard sanitation and structural pruning." }
      ]
    },
    {
      title: "Fertilizer Schedule",
      icon: ShieldCheck,
      items: [
        { label: "Post-Harvest", value: "DAP / Urea", detail: "Apply 1.5kg mixed fertilizer per tree post-harvest." },
        { label: "Pre-Flowering", value: "Potassium", detail: "Boosts fruit quality and sugar content (Brix)." }
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-in">
      <div className="bg-emerald-600/10 border border-emerald-500/20 p-6 rounded-2xl flex items-center gap-4">
        <div className="p-3 bg-emerald-500 rounded-xl text-black">
          <Info size={24} />
        </div>
        <div>
          <h4 className="text-emerald-500 font-bold">Active Climatic Alert</h4>
          <p className="text-emerald-500/80 text-sm">Heatwave warning for Multan/Sukkur regions. Ensure interval irrigation for young orchards.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {sections.map((sec, i) => (
          <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
              <sec.icon size={20} className="text-emerald-500" />
              {sec.title}
            </h3>
            <div className="space-y-4">
              {sec.items.map((item, j) => (
                <div key={j} className="p-4 bg-slate-800/30 rounded-xl group hover:bg-slate-800/50 transition-colors">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-emerald-400 font-bold text-sm tracking-wide uppercase">{item.label}</span>
                    <span className="text-white font-black">{item.value}</span>
                  </div>
                  <p className="text-slate-500 text-sm">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
        <h3 className="text-white font-bold mb-6 flex items-center gap-2">
          <AlertCircle size={20} className="text-rose-500" />
          Active Pest Alerts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-rose-500/20 bg-rose-500/5 rounded-xl">
            <h5 className="text-rose-500 font-bold mb-1">Fruit Fly (Mango)</h5>
            <p className="text-slate-400 text-sm">High activity detected. Deploy pheromone traps immediately.</p>
          </div>
          <div className="p-4 border border-amber-500/20 bg-amber-500/5 rounded-xl">
            <h5 className="text-amber-500 font-bold mb-1">Red Palm Weevil (Dates)</h5>
            <p className="text-slate-400 text-sm">Monitor trunk health. Inject systemic insecticide if holes found.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const HistoryView = () => {
  const [history] = useState([
    { date: '2 hours ago', variety: 'Sindhri', quality: 92, status: 'Export Grade', city: 'Mirpur Khas' },
    { date: '5 hours ago', variety: 'Chaunsa', quality: 78, status: 'Local Market', city: 'Multan' },
    { date: 'Yesterday', variety: 'Aseel', quality: 85, status: 'Processing', city: 'Khairpur' },
    { date: 'Yesterday', variety: 'Anwar Ratool', quality: 95, status: 'Premium Retail', city: 'Lahore' },
  ]);

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-in">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-800/50 text-slate-400 text-sm uppercase tracking-wider font-bold">
            <th className="px-8 py-5">Time Frame</th>
            <th className="px-8 py-5">Identified Variety</th>
            <th className="px-8 py-5 text-center">Quality Score</th>
            <th className="px-8 py-5">Recommendation</th>
            <th className="px-8 py-5 text-right">Mandi Logic</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {history.map((item, i) => (
            <tr key={i} className="hover:bg-emerald-500/5 transition-colors group">
              <td className="px-8 py-5 text-slate-500 font-medium">{item.date}</td>
              <td className="px-8 py-5">
                <div className="text-white font-bold">{item.variety}</div>
                <div className="text-xs text-slate-600 font-mono tracking-widest">{item.city}</div>
              </td>
              <td className="px-8 py-5">
                <div className="flex justify-center">
                  <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm border-2",
                    item.quality > 90 ? "border-emerald-500 text-emerald-500" : "border-amber-500 text-amber-500"
                  )}>
                    {item.quality}
                  </div>
                </div>
              </td>
              <td className="px-8 py-5">
                <span className={cn(
                  "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter",
                  item.quality > 90 ? "bg-emerald-500 text-black" : "bg-slate-800 text-slate-400"
                )}>
                  {item.status}
                </span>
              </td>
              <td className="px-8 py-5 text-right">
                <button className="text-slate-600 group-hover:text-emerald-500 transition-colors">
                  <FileText size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// --- App Shell ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Command Center' },
    { id: 'scanner', icon: Scan, label: 'Neural Scanner' },
    { id: 'market', icon: TrendingUp, label: 'Market Analytics' },
    { id: 'vault', icon: Database, label: 'Variety Vault' },
    { id: 'advisor', icon: Leaf, label: 'Agri Advisory' },
    { id: 'history', icon: History, label: 'Scan History' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex font-sans selection:bg-emerald-500/30 selection:text-emerald-500">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed lg:static h-full bg-slate-900 border-r border-slate-800 flex flex-col z-50 transition-all duration-300",
          isSidebarOpen ? "w-72" : "w-0 -translate-x-full lg:translate-x-0 lg:w-20"
        )}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Leaf className="text-white shrink-0" size={24} />
          </div>
          {isSidebarOpen && (
            <span className="text-xl font-black tracking-tighter text-white">MANGO<span className="text-emerald-500">PALM</span></span>
          )}
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          {menuItems.map(item => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={isSidebarOpen ? item.label : ''}
              active={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
            />
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-slate-800/50 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-emerald-400">
              UM
            </div>
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <div className="text-sm font-bold truncate">Umair Mustafa</div>
                <div className="text-xs text-slate-500 truncate">Platform Admin</div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="h-20 bg-slate-950/50 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-40 px-8 flex items-center justify-between">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex-1 max-w-md mx-8 hidden sm:block">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search market varieties, mandi rates..." 
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-white relative transition-colors">
              <TrendingUp size={20} />
              <div className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-950"></div>
            </button>
            <div className="h-6 w-px bg-slate-800"></div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">PRO BUNDLE</span>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8">
              <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
                {menuItems.find(i => i.id === activeTab)?.label}
              </h1>
              <p className="text-slate-400 font-medium">Agricultural intelligence for peak operational performance.</p>
            </div>

            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'scanner' && <ScannerView />}
            {activeTab === 'market' && <MarketView />}
            {activeTab === 'vault' && <VaultView />}
            {activeTab === 'advisor' && <AdvisoryView />}
            {activeTab === 'history' && <HistoryView />}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

