import React, { useState, useMemo } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { motion } from 'motion/react';
import {
  Globe,
  MapPin,
  RefreshCw,
  Server,
  Activity,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface GeoRegionData {
  id: string;
  nameZh: string;
  nameEn: string;
  country: string;
  flag: string;
  coordinates: [number, number]; // [longitude, latitude]
  visitors: number;
  sharePercent: number;
  topCities: string[];
  latencyMs: number;
  growth: string;
}

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const INITIAL_REGIONS: GeoRegionData[] = [
  {
    id: 'cn-east',
    nameZh: '中国 - 华东地区',
    nameEn: 'China - East Region',
    country: 'CN',
    flag: 'cn',
    coordinates: [121.47, 31.23], // Shanghai
    visitors: 14280,
    sharePercent: 38.5,
    topCities: ['上海', '杭州', '南京', '苏州'],
    latencyMs: 18,
    growth: '+22.4%'
  },
  {
    id: 'cn-south',
    nameZh: '中国 - 华南地区',
    nameEn: 'China - South Region',
    country: 'CN',
    flag: 'cn',
    coordinates: [113.26, 23.13], // Guangzhou
    visitors: 9850,
    sharePercent: 26.5,
    topCities: ['深圳', '广州', '东莞', '佛山'],
    latencyMs: 24,
    growth: '+18.1%'
  },
  {
    id: 'cn-north',
    nameZh: '中国 - 华北地区',
    nameEn: 'China - North Region',
    country: 'CN',
    flag: 'cn',
    coordinates: [116.40, 39.90], // Beijing
    visitors: 6200,
    sharePercent: 16.7,
    topCities: ['北京', '天津', '济南', '青岛'],
    latencyMs: 28,
    growth: '+11.5%'
  },
  {
    id: 'us-west',
    nameZh: '北美 - 美西 (加州)',
    nameEn: 'US West (California)',
    country: 'US',
    flag: 'us',
    coordinates: [-122.41, 37.77], // San Francisco
    visitors: 3410,
    sharePercent: 9.2,
    topCities: ['San Francisco', 'Los Angeles', 'Seattle'],
    latencyMs: 145,
    growth: '+34.8%'
  },
  {
    id: 'eu-central',
    nameZh: '欧洲 - 中欧 (德国)',
    nameEn: 'Europe Central (Germany)',
    country: 'DE',
    flag: 'de',
    coordinates: [8.68, 50.11], // Frankfurt
    visitors: 1650,
    sharePercent: 4.4,
    topCities: ['Frankfurt', 'Berlin', 'Munich'],
    latencyMs: 195,
    growth: '+8.3%'
  },
  {
    id: 'ap-singapore',
    nameZh: '东南亚 - 新加坡',
    nameEn: 'SE Asia - Singapore',
    country: 'SG',
    flag: 'sg',
    coordinates: [103.81, 1.35], // Singapore
    visitors: 1120,
    sharePercent: 3.0,
    topCities: ['Singapore', 'Jurong'],
    latencyMs: 52,
    growth: '+15.2%'
  },
  {
    id: 'jp-tokyo',
    nameZh: '东亚 - 日本东京',
    nameEn: 'East Asia - Japan Tokyo',
    country: 'JP',
    flag: 'jp',
    coordinates: [139.69, 35.68], // Tokyo
    visitors: 820,
    sharePercent: 2.2,
    topCities: ['Tokyo', 'Osaka', 'Yokohama'],
    latencyMs: 68,
    growth: '+19.6%'
  }
];

export const VisitorGeoMap: React.FC = () => {
  const { language } = useApp();
  const [selectedRegion, setSelectedRegion] = useState<GeoRegionData | null>(null);
  const [activeScope, setActiveScope] = useState<'all' | 'domestic' | 'overseas'>('all');
  const [mapSeed, setMapSeed] = useState<number>(0);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    data: GeoRegionData | null;
  }>({ visible: false, data: null });

  // Filtered dataset
  const displayRegions = useMemo(() => {
    let list = INITIAL_REGIONS.map(r => ({
      ...r,
      visitors: Math.max(100, Math.floor(r.visitors + Math.sin(mapSeed * 13 + r.visitors) * 450))
    }));

    if (activeScope === 'domestic') {
      list = list.filter(r => r.country === 'CN');
    } else if (activeScope === 'overseas') {
      list = list.filter(r => r.country !== 'CN');
    }

    const total = list.reduce((sum, r) => sum + r.visitors, 0);
    return list.map(r => ({
      ...r,
      sharePercent: Number(((r.visitors / (total || 1)) * 100).toFixed(1))
    })).sort((a, b) => b.visitors - a.visitors);
  }, [activeScope, mapSeed]);

  const totalScopeVisitors = useMemo(() => {
    return displayRegions.reduce((sum, r) => sum + r.visitors, 0);
  }, [displayRegions]);

  return (
    <div className="flex flex-col gap-6">
      {/* Prominent Full-Width World Map Container */}
      <div className="relative bg-white dark:bg-slate-900 border-3 border-black dark:border-zinc-200 rounded-2xl p-5 md:p-6 shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#38BDF8] flex flex-col justify-between overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-cyan-500 animate-ping" />
            <span className="text-xs font-black font-mono text-black dark:text-zinc-200 uppercase tracking-wide">
              GLOBAL_RADAR_MAP // REAL-TIME GEOLOCATION & TRAFFIC NODES
            </span>
          </div>

          {/* Scope Controls on the right */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white dark:bg-slate-800 border-2 border-black dark:border-zinc-200 rounded-xl p-0.5 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#38BDF8]">
              <button
                onClick={() => setActiveScope('all')}
                className={`px-3 py-1 text-xs font-black rounded-lg transition-colors ${
                  activeScope === 'all'
                    ? 'bg-black text-cyan-300'
                    : 'text-black dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-slate-700'
                }`}
              >
                全部区域
              </button>
              <button
                onClick={() => setActiveScope('domestic')}
                className={`px-3 py-1 text-xs font-black rounded-lg transition-colors ${
                  activeScope === 'domestic'
                    ? 'bg-black text-cyan-300'
                    : 'text-black dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-slate-700'
                }`}
              >
                国内大区
              </button>
              <button
                onClick={() => setActiveScope('overseas')}
                className={`px-3 py-1 text-xs font-black rounded-lg transition-colors ${
                  activeScope === 'overseas'
                    ? 'bg-black text-cyan-300'
                    : 'text-black dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-slate-700'
                }`}
              >
                海外节点
              </button>
            </div>
          </div>
        </div>

        {/* Large Prominent Map Viewport */}
        <div className="w-full h-[500px] md:h-[560px] bg-cyan-50/70 dark:bg-slate-950/80 border-2 border-black dark:border-zinc-700 rounded-xl overflow-hidden relative flex items-center justify-center shadow-inner">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 145,
              center: [15, 32]
            }}
            style={{ width: "100%", height: "100%" }}
          >
            <ZoomableGroup zoom={1} maxZoom={5}>
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map(geo => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#e2e8f0"
                      stroke="#cbd5e1"
                      strokeWidth={0.6}
                      style={{
                        default: { fill: "#f1f5f9", outline: "none" },
                        hover: { fill: "#cbd5e1", outline: "none" },
                        pressed: { fill: "#94a3b8", outline: "none" }
                      }}
                    />
                  ))
                }
              </Geographies>

              {/* Render Markers for each region with enhanced styling */}
              {displayRegions.map(region => {
                const isCN = region.country === 'CN';
                const markerColor = isCN ? '#ff4d4d' : '#38bdf8';
                const scaleRadius = Math.max(10, Math.min(26, Math.sqrt(region.visitors) / 8));

                return (
                  <Marker
                    key={region.id}
                    coordinates={region.coordinates}
                    onClick={() => setSelectedRegion(region)}
                    onMouseEnter={() => setTooltip({ visible: true, data: region })}
                    onMouseLeave={() => setTooltip({ visible: false, data: null })}
                    style={{
                      default: { cursor: 'pointer' },
                      hover: { cursor: 'pointer' },
                      pressed: { cursor: 'pointer' }
                    }}
                  >
                    {/* Outer Pulse ring */}
                    <circle
                      r={scaleRadius + 8}
                      fill={markerColor}
                      opacity={0.3}
                      stroke="#000"
                      strokeWidth={1.2}
                    />
                    {/* Main Node Bubble */}
                    <circle
                      r={scaleRadius}
                      fill={markerColor}
                      stroke="#000"
                      strokeWidth={2.5}
                    />
                    <circle
                      r={3.5}
                      fill="#000"
                    />
                    {/* Prominent Label */}
                    <text
                      textAnchor="middle"
                      y={scaleRadius + 16}
                      style={{
                        fontFamily: 'sans-serif',
                        fontSize: '11px',
                        fontWeight: '900',
                        fill: '#000000',
                        paintOrder: 'stroke',
                        stroke: '#ffffff',
                        strokeWidth: '3.5px',
                        strokeLinecap: 'butt',
                        strokeLinejoin: 'miter'
                      }}
                    >
                      {language === 'zh' ? region.nameZh.split(' - ')[1] || region.nameZh : region.nameEn} ({region.sharePercent}%)
                    </text>
                  </Marker>
                );
              })}
            </ZoomableGroup>
          </ComposableMap>

          {/* Hover Tooltip Popup Overlay */}
          {tooltip.visible && tooltip.data && (
            <div className="absolute bottom-4 left-4 bg-black text-white border-3 border-cyan-300 px-4 py-3 rounded-2xl text-xs font-black shadow-[5px_5px_0px_0px_#38BDF8] z-30 pointer-events-none">
              <div className="flex items-center gap-1.5 text-cyan-300 font-mono text-xs mb-1.5">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-black">{tooltip.data.nameZh}</span>
              </div>
              <div className="flex items-center justify-between gap-8 font-mono">
                <span>实时访客量:</span>
                <span className="text-yellow-300 font-black text-sm">{tooltip.data.visitors.toLocaleString()} 次</span>
              </div>
              <div className="flex items-center justify-between gap-8 font-mono text-xs text-zinc-300 mt-1">
                <span>全球流量占比:</span>
                <span className="text-emerald-400 font-bold">{tooltip.data.sharePercent}%</span>
              </div>
              <div className="flex items-center justify-between gap-8 font-mono text-xs text-zinc-300 mt-1">
                <span>边缘节点延迟:</span>
                <span className="text-rose-400 font-bold">{tooltip.data.latencyMs} ms</span>
              </div>
              <div className="flex items-center justify-between gap-8 font-mono text-xs text-zinc-300 mt-1">
                <span>核心活跃城市:</span>
                <span className="text-cyan-200 font-bold">{tooltip.data.topCities.join(', ')}</span>
              </div>
            </div>
          )}
        </div>

        {/* Map Footer Metrics & Quick Selector Cards */}
        <div className="mt-4 pt-4 border-t-2 border-dashed border-zinc-300 dark:border-zinc-700 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300">
            <span>当前筛选区域总访客: <strong className="text-black dark:text-white font-black text-sm">{totalScopeVisitors.toLocaleString()}</strong></span>
            <span className="hidden md:inline">|</span>
            <span>CDN 节点状态: <strong className="text-emerald-600 font-black">100% ONLINE</strong></span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {displayRegions.map(reg => (
              <button
                key={reg.id}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3 py-1.5 rounded-xl border-2 border-black text-xs font-black transition-all flex items-center gap-1.5 ${
                  selectedRegion?.id === reg.id
                    ? 'bg-amber-300 text-black shadow-[2px_2px_0px_0px_#000]'
                    : 'bg-white dark:bg-slate-800 text-black dark:text-white hover:bg-cyan-100 shadow-[2px_2px_0px_0px_#000]'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: reg.country === 'CN' ? '#ff4d4d' : '#38bdf8' }} />
                <span>{language === 'zh' ? reg.nameZh.split(' - ')[1] || reg.nameZh : reg.nameEn}</span>
                <span className="font-mono text-[10px] opacity-80">({reg.sharePercent}%)</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Region Details Modal / Panel */}
      {selectedRegion && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-cyan-100 dark:bg-cyan-950 border-3 border-black p-5 rounded-2xl shadow-[5px_5px_0px_0px_#000] flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-black text-cyan-300 rounded-xl flex items-center justify-center font-black shadow-[2px_2px_0px_0px_#000]">
              <Server className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h5 className="font-black text-sm text-black dark:text-white flex items-center gap-2">
                <span>{selectedRegion.nameZh} 详细数据深度诊断</span>
                <span className="bg-black text-yellow-300 text-[10px] font-mono px-2 py-0.5 rounded border border-black">
                  LATENCY {selectedRegion.latencyMs}MS
                </span>
              </h5>
              <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-1">
                主要来源城市: <span className="font-mono font-black text-black dark:text-cyan-300">{selectedRegion.topCities.join(' · ')}</span>
                {' | '}
                近7日增长率: <span className="font-mono font-black text-emerald-700 dark:text-emerald-400">{selectedRegion.growth}</span>
                {' | '}
                访客总数: <span className="font-mono font-black text-black dark:text-white">{selectedRegion.visitors.toLocaleString()}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedRegion(null)}
            className="text-xs font-black bg-white text-black border-2 border-black px-4 py-2 rounded-xl shadow-[2px_2px_0px_0px_#000] hover:bg-zinc-100 self-end md:self-auto"
          >
            关闭分析
          </button>
        </motion.div>
      )}
    </div>
  );
};
