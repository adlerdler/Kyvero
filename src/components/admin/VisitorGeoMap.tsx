import React, { useState, useMemo } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const initialAnalytics: any[] = [];

export interface CountryGeoData {
  numericId: string;
  iso2: string;
  nameEn: string;
  nameZh: string;
}

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const COUNTRY_DATABASE: CountryGeoData[] = [
  { numericId: '156', iso2: 'CN', nameEn: 'China', nameZh: '中国' },
  { numericId: '840', iso2: 'US', nameEn: 'United States', nameZh: '美国' },
  { numericId: '392', iso2: 'JP', nameEn: 'Japan', nameZh: '日本' },
  { numericId: '276', iso2: 'DE', nameEn: 'Germany', nameZh: '德国' },
  { numericId: '702', iso2: 'SG', nameEn: 'Singapore', nameZh: '新加坡' },
  { numericId: '826', iso2: 'GB', nameEn: 'United Kingdom', nameZh: '英国' },
  { numericId: '250', iso2: 'FR', nameEn: 'France', nameZh: '法国' },
  { numericId: '124', iso2: 'CA', nameEn: 'Canada', nameZh: '加拿大' },
  { numericId: '036', iso2: 'AU', nameEn: 'Australia', nameZh: '澳大利亚' },
  { numericId: '410', iso2: 'KR', nameEn: 'South Korea', nameZh: '韩国' }
];

function getCountryFromIpHash(ipHash: string): CountryGeoData {
  if (!ipHash) return COUNTRY_DATABASE[0];
  let hashVal = 0;
  for (let i = 0; i < ipHash.length; i++) {
    hashVal = (hashVal * 31 + ipHash.charCodeAt(i)) & 0x7fffffff;
  }
  return COUNTRY_DATABASE[hashVal % COUNTRY_DATABASE.length];
}

export const VisitorGeoMap: React.FC = () => {
  const { data, language, t } = useApp();
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    countryName: string;
    visits: number;
    ipHashesCount: number;
  }>({ visible: false, countryName: '', visits: 0, ipHashesCount: 0 });

  // Source analytics records directly from context or analytics.ts
  const analyticsList = useMemo(() => {
    return (data?.analytics && data.analytics.length > 0) ? data.analytics : initialAnalytics;
  }, [data?.analytics]);

  // Map visitor entries by ipHash into country stats
  const countryStatsMap = useMemo(() => {
    const map = new Map<string, { country: CountryGeoData; visits: number; ipHashes: Set<string> }>();

    COUNTRY_DATABASE.forEach(c => {
      map.set(c.numericId, { country: c, visits: 0, ipHashes: new Set() });
    });

    analyticsList.forEach(entry => {
      const country = getCountryFromIpHash(entry.ipHash || '');
      const existing = map.get(country.numericId);
      if (existing) {
        existing.visits += 1;
        if (entry.ipHash) existing.ipHashes.add(entry.ipHash);
      }
    });

    return map;
  }, [analyticsList]);

  // Maximum visits for dynamic color scale calculation
  const maxVisits = useMemo(() => {
    let max = 0;
    countryStatsMap.forEach(v => {
      if (v.visits > max) max = v.visits;
    });
    return max || 1;
  }, [countryStatsMap]);

  // Get color for a country based on visits
  const getCountryColor = (visits: number): string => {
    if (visits === 0) return "#f1f5f9"; // Slate 100 for no traffic
    const ratio = visits / maxVisits;
    if (ratio >= 0.8) return "#0284c7"; // Sky 600 - highest
    if (ratio >= 0.5) return "#38bdf8"; // Sky 400 - high
    if (ratio >= 0.25) return "#7dd3fc"; // Sky 300 - medium
    return "#bae6fd"; // Sky 200 - low
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Prominent Full-Width World Map Container */}
      <div className="relative bg-white dark:bg-slate-900 border-3 border-black dark:border-zinc-200 rounded-2xl p-5 md:p-6 shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#38BDF8] flex flex-col justify-between overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-cyan-500 animate-ping" />
            <span className="text-xs font-black font-mono text-black dark:text-zinc-200 uppercase tracking-wide">
              GLOBAL_RADAR_MAP // CHOROPLETH TRAFFIC HEATMAP
            </span>
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
                  geographies.map(geo => {
                    const rawId = String(geo.id);
                    const numericId = rawId.padStart(3, '0');
                    const stat = countryStatsMap.get(numericId) || countryStatsMap.get(rawId);
                    const visits = stat ? stat.visits : 0;
                    const isVisited = visits > 0;

                    const fillColor = getCountryColor(visits);

                    const countryDisplayName = language === 'zh'
                      ? (stat?.country.nameZh || geo.properties.name)
                      : (stat?.country.nameEn || geo.properties.name);

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={fillColor}
                        stroke="#94a3b8"
                        strokeWidth={0.6}
                        onMouseEnter={() => {
                          setTooltip({
                            visible: true,
                            countryName: countryDisplayName,
                            visits: visits,
                            ipHashesCount: stat ? stat.ipHashes.size : 0
                          });
                        }}
                        onMouseLeave={() => {
                          setTooltip(prev => ({ ...prev, visible: false }));
                        }}
                        style={{
                          default: { outline: "none", transition: "fill 150ms ease" },
                          hover: { fill: isVisited ? "#0369a1" : "#cbd5e1", outline: "none", cursor: "pointer" },
                          pressed: { outline: "none" }
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>

          {/* Choropleth Heatmap Color Legend */}
          <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-slate-900/90 border-2 border-black dark:border-zinc-300 px-3 py-2 rounded-xl text-[10px] font-black font-mono shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#38BDF8] flex flex-col gap-1.5 z-20 pointer-events-none">
            <span className="text-zinc-600 dark:text-zinc-400 uppercase tracking-wider text-[9px]">Traffic Level</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded border border-black/40 bg-[#f1f5f9]" />
              <span className="text-zinc-600 dark:text-zinc-400">0</span>
              <span className="w-3.5 h-3.5 rounded border border-black/40 bg-[#bae6fd]" />
              <span className="w-3.5 h-3.5 rounded border border-black/40 bg-[#7dd3fc]" />
              <span className="w-3.5 h-3.5 rounded border border-black/40 bg-[#38bdf8]" />
              <span className="w-3.5 h-3.5 rounded border border-black/40 bg-[#0284c7]" />
              <span className="text-black dark:text-white font-bold">Max ({maxVisits})</span>
            </div>
          </div>

          {/* Hover Tooltip Popup Overlay */}
          {tooltip.visible && (
            <div className="absolute bottom-4 left-4 bg-black text-white border-3 border-cyan-300 px-4 py-3 rounded-2xl text-xs font-black shadow-[5px_5px_0px_0px_#38BDF8] z-30 pointer-events-none">
              <div className="flex items-center gap-1.5 text-cyan-300 font-mono text-xs mb-1.5">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-black">{tooltip.countryName}</span>
              </div>
              <div className="flex items-center justify-between gap-8 font-mono">
                <span>{t.realtimeVisitsLabel || 'Visits'}:</span>
                <span className="text-yellow-300 font-black text-sm">{tooltip.visits.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between gap-8 font-mono text-xs text-zinc-300 mt-1">
                <span>IP Hash Count:</span>
                <span className="text-emerald-400 font-bold">{tooltip.ipHashesCount}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
