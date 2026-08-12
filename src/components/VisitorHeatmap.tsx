import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { motion } from 'motion/react';
import {
  Activity,
  Calendar,
  TrendingUp,
  Users,
  Zap,
  BarChart2,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { initialAnalytics } from '../data/analytics';

export interface AnnualDayData {
  dateStr: string; // YYYY-MM-DD
  dayOfWeek: number; // 0 = Mon, 6 = Sun
  weekIndex: number; // 0 .. 25
  visits: number;
  monthName: string;
  isFuture?: boolean;
  isToday?: boolean;
}

export const VisitorHeatmap: React.FC = () => {
  const { data, language, t } = useApp();
  const ht = t;
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [selectedCell, setSelectedCell] = useState<AnnualDayData | null>(null);
  const [tooltipData, setTooltipData] = useState<{
    visible: boolean;
    x: number;
    y: number;
    cell: AnnualDayData | null;
  }>({ visible: false, x: 0, y: 0, cell: null });

  const analyticsList = useMemo(() => {
    return (data?.analytics && data.analytics.length > 0) ? data.analytics : initialAnalytics;
  }, [data?.analytics]);

  // Process real analytics data
  const realVisitsMap = useMemo(() => {
    const map = new Map<string, number>();
    analyticsList.forEach(entry => {
      const date = entry.timestamp.split('T')[0];
      map.set(date, (map.get(date) || 0) + 1);
    });
    return map;
  }, [analyticsList]);

  // Generate 26 weeks of contribution data, ending with current week (including today)
  const annualData = useMemo(() => {
    const data: AnnualDayData[] = [];
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();

    const todayNorm = new Date(todayYear, todayMonth, todayDay);
    const todayStr = `${todayYear}-${String(todayMonth + 1).padStart(2, '0')}-${String(todayDay).padStart(2, '0')}`;

    // Current day of week (0 = Monday, 6 = Sunday)
    const todayDayOfWeek = (today.getDay() + 6) % 7;

    // Monday of current week (weekIndex 25)
    const currentWeekMonday = new Date(todayYear, todayMonth, todayDay - todayDayOfWeek);

    // Start Monday (25 weeks before current week -> total 26 weeks, weekIndex 0..25)
    const startMonday = new Date(currentWeekMonday);
    startMonday.setDate(currentWeekMonday.getDate() - (25 * 7));

    const monthNames = t.monthsList.split(',');

    for (let w = 0; w < 26; w++) {
      for (let d = 0; d < 7; d++) {
        const currentDate = new Date(startMonday);
        currentDate.setDate(startMonday.getDate() + w * 7 + d);

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const day = currentDate.getDate();
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        const isFuture = currentDate > todayNorm;
        const isToday = dateStr === todayStr;

        const realVisits = isFuture ? 0 : (realVisitsMap.get(dateStr) || 0);

        data.push({
          dateStr,
          dayOfWeek: d,
          weekIndex: w,
          visits: realVisits,
          monthName: monthNames[month] || '',
          isFuture,
          isToday
        });
      }
    }

    return data;
  }, [t.monthsList, realVisitsMap]);

  // Statistics calculation for annual data
  const stats = useMemo(() => {
    const validDays = annualData.filter(d => !d.isFuture);
    const totalVisits = validDays.reduce((acc, curr) => acc + curr.visits, 0);
    const avgVisits = validDays.length ? Math.round(totalVisits / validDays.length) : 0;
    
    let peakDay: AnnualDayData = validDays[0] || { dateStr: '', dayOfWeek: 0, weekIndex: 0, visits: 0, monthName: '' };
    validDays.forEach(cell => {
      if (cell.visits > peakDay.visits) {
        peakDay = cell;
      }
    });

    const activeDaysCount = validDays.filter(c => c.visits > avgVisits * 1.1 && c.visits > 0).length;

    return {
      totalVisits,
      avgVisits,
      peakDay,
      activeDaysCount,
      validDaysCount: validDays.length
    };
  }, [annualData]);

  // Render D3 Annual Contribution Heatmap
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svgElement = d3.select(svgRef.current);
    svgElement.selectAll('*').remove();

    const containerWidth = containerRef.current.clientWidth || 800;
    const margin = { top: 30, right: 20, bottom: 25, left: 40 };
    const width = containerWidth - margin.left - margin.right;

    const weeksCount = 26;
    const cellSize = Math.max(10, Math.floor((width - 40) / weeksCount));
    const cellGap = 3;
    const gridHeight = 7 * (cellSize + cellGap);
    const totalHeight = gridHeight + margin.top + margin.bottom;

    svgElement
      .attr('width', containerWidth)
      .attr('height', totalHeight)
      .attr('viewBox', `0 0 ${containerWidth} ${totalHeight}`);

    const g = svgElement
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Month labels (X Axis)
    const monthNames = t.monthsList.split(',');
    let lastMonth = -1;

    const today = new Date();
    const todayDayOfWeek = (today.getDay() + 6) % 7;
    const currentWeekMonday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - todayDayOfWeek);
    const startMonday = new Date(currentWeekMonday);
    startMonday.setDate(currentWeekMonday.getDate() - (25 * 7));

    for (let w = 0; w < 26; w++) {
      const weekMonday = new Date(startMonday);
      weekMonday.setDate(startMonday.getDate() + w * 7);
      const m = weekMonday.getMonth();

      if (m !== lastMonth) {
        lastMonth = m;
        g.append('text')
          .attr('x', w * (cellSize + cellGap))
          .attr('y', -8)
          .style('font-size', '10px')
          .style('font-weight', '900')
          .style('font-family', 'monospace')
          .style('fill', '#18181b')
          .text(monthNames[m] || '');
      }
    }

    // Color Scale: GitHub-like amber-to-rose Neo-brutalist gradient
    const maxVisits = d3.max(annualData, (d: AnnualDayData) => d.visits) || 10;
    const colorScale = d3
      .scaleSequential<string>()
      .domain([0, Math.max(1, maxVisits)])
      .interpolator(d3.interpolateYlOrRd);

    // Days labels (Y Axis)
    const days = t.daysList.split(',');
    // Show Mon, Wed, Fri
    const showDayIndices = [0, 2, 4]; 

    showDayIndices.forEach(dayIdx => {
      g.append('text')
        .attr('x', -8)
        .attr('y', dayIdx * (cellSize + cellGap) + cellSize / 2 + 4)
        .style('font-size', '10px')
        .style('font-weight', '900')
        .style('font-family', 'monospace')
        .style('fill', '#18181b')
        .attr('text-anchor', 'end')
        .text(days[dayIdx] || '');
    });

    // Draw Contribution Rectangles
    g.selectAll('rect.contrib-cell')
      .data(annualData)
      .enter()
      .append('rect')
      .attr('class', 'contrib-cell')
      .attr('x', (d: AnnualDayData) => d.weekIndex * (cellSize + cellGap))
      .attr('y', (d: AnnualDayData) => d.dayOfWeek * (cellSize + cellGap))
      .attr('width', cellSize)
      .attr('height', cellSize)
      .attr('rx', 3)
      .attr('ry', 3)
      .style('fill', (d: AnnualDayData) => {
        if (d.isFuture) return '#f4f4f5';
        if (d.visits === 0) return '#e4e4e7';
        return colorScale(d.visits);
      })
      .style('stroke', (d: AnnualDayData) => {
        if (d.isToday) return '#f43f5e';
        if (d.isFuture) return '#d4d4d8';
        return '#000000';
      })
      .style('stroke-width', (d: AnnualDayData) => (d.isToday ? '2.5px' : '1px'))
      .style('stroke-dasharray', (d: AnnualDayData) => (d.isFuture ? '2 2' : 'none'))
      .style('cursor', (d: AnnualDayData) => (d.isFuture ? 'default' : 'pointer'))
      .on('mouseover', (event: MouseEvent, d: AnnualDayData) => {
        if (d.isFuture) return;

        d3.select(event.currentTarget as SVGRectElement)
          .transition()
          .duration(100)
          .style('stroke-width', '2px')
          .style('stroke', '#000000')
          .attr('transform', 'scale(1.15)')
          .attr('transform-origin', `${d.weekIndex * (cellSize + cellGap) + cellSize / 2} ${d.dayOfWeek * (cellSize + cellGap) + cellSize / 2}`);

        const [mouseX, mouseY] = d3.pointer(event, containerRef.current);
        setTooltipData({
          visible: true,
          x: mouseX,
          y: mouseY,
          cell: d
        });
      })
      .on('mousemove', (event: MouseEvent) => {
        const [mouseX, mouseY] = d3.pointer(event, containerRef.current);
        setTooltipData(prev => ({
          ...prev,
          x: mouseX,
          y: mouseY
        }));
      })
      .on('mouseout', (event: MouseEvent, d: AnnualDayData) => {
        d3.select(event.currentTarget as SVGRectElement)
          .transition()
          .duration(150)
          .style('stroke-width', d.isToday ? '2.5px' : '1px')
          .style('stroke', d.isToday ? '#f43f5e' : '#000000')
          .attr('transform', 'scale(1)');

        setTooltipData(prev => ({ ...prev, visible: false }));
      })
      .on('click', (_: MouseEvent, d: AnnualDayData) => {
        if (!d.isFuture) {
          setSelectedCell(d);
        }
      });

  }, [annualData, t.daysList, t.monthsList]);

  return (
    <div className="flex flex-col gap-5">
      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-cyan-100 border-2 border-black p-4 rounded-2xl shadow-[3px_3px_0px_0px_#000] flex items-center justify-between">
          <div>
            <p className="text-[11px] font-black uppercase text-zinc-700">{ht.totalVisitsTitle}</p>
            <p className="text-2xl font-black text-black font-mono mt-0.5">
              {stats.totalVisits.toLocaleString()}
            </p>
            <p className="text-[10px] font-bold text-emerald-700 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 stroke-[3]" />
              <span>{ht.comparePeriod}</span>
            </p>
          </div>
          <div className="w-10 h-10 bg-cyan-300 border-2 border-black rounded-xl flex items-center justify-center text-black font-black shadow-[1.5px_1.5px_0px_0px_#000]">
            <Users className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>

        <div className="bg-rose-100 border-2 border-black p-4 rounded-2xl shadow-[3px_3px_0px_0px_#000] flex items-center justify-between">
          <div>
            <p className="text-[11px] font-black uppercase text-zinc-700">{ht.peakVisitsTitle}</p>
            <p className="text-xl font-black text-black font-mono mt-0.5">
              {stats.peakDay.dateStr}
            </p>
            <p className="text-[10px] font-bold text-rose-800 mt-1">
              {ht.peakTrafficLabel}: <span className="font-mono font-black">{stats.peakDay.visits}</span> {ht.visitsUnit}
            </p>
          </div>
          <div className="w-10 h-10 bg-rose-300 border-2 border-black rounded-xl flex items-center justify-center text-black font-black shadow-[1.5px_1.5px_0px_0px_#000]">
            <Zap className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>

        <div className="bg-emerald-100 border-2 border-black p-4 rounded-2xl shadow-[3px_3px_0px_0px_#000] flex items-center justify-between">
          <div>
            <p className="text-[11px] font-black uppercase text-zinc-700">{ht.avgVisitsTitle}</p>
            <p className="text-2xl font-black text-black font-mono mt-0.5">
              {stats.avgVisits} <span className="text-xs">{ht.visitsUnit}</span>
            </p>
            <p className="text-[10px] font-bold text-emerald-800 mt-1">
              {ht.highActiveDaysLabel}: <span className="font-mono font-black">{stats.activeDaysCount}</span> {ht.daysUnit}
            </p>
          </div>
          <div className="w-10 h-10 bg-emerald-300 border-2 border-black rounded-xl flex items-center justify-center text-black font-black shadow-[1.5px_1.5px_0px_0px_#000]">
            <Calendar className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>

        <div className="bg-violet-100 border-2 border-black p-4 rounded-2xl shadow-[3px_3px_0px_0px_#000] flex items-center justify-between">
          <div>
            <p className="text-[11px] font-black uppercase text-zinc-700">{ht.sampleSpanTitle}</p>
            <p className="text-2xl font-black text-black font-mono mt-0.5">
              {stats.validDaysCount} <span className="text-xs">DAYS</span>
            </p>
            <p className="text-[10px] font-bold text-violet-800 mt-1">
              {ht.sampleSpanSubtitle}
            </p>
          </div>
          <div className="w-10 h-10 bg-violet-300 border-2 border-black rounded-xl flex items-center justify-center text-black font-black shadow-[1.5px_1.5px_0px_0px_#000]">
            <BarChart2 className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>
      </div>

      {/* Main D3 Heatmap Canvas Container */}
      <div
        ref={containerRef}
        className="relative bg-white dark:bg-slate-900 border-3 border-black dark:border-zinc-200 rounded-2xl p-4 md:p-6 shadow-[5px_5px_0px_0px_#000] dark:shadow-[5px_5px_0px_0px_#38BDF8] overflow-x-auto"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-black font-mono text-black dark:text-zinc-200 uppercase tracking-wide">
              {ht.chartHeading}
            </span>
          </div>

          {/* Color Legend */}
          <div className="flex items-center gap-1.5 text-[10px] font-black font-mono text-black dark:text-zinc-300">
            <span>{ht.less}</span>
            <div className="flex items-center gap-0.5 border border-black p-0.5 rounded bg-white shadow-[1px_1px_0px_0px_#000]">
              <span className="w-3.5 h-3.5 rounded-xs bg-[#ffffcc] border border-black/30" />
              <span className="w-3.5 h-3.5 rounded-xs bg-[#ffc44d] border border-black/30" />
              <span className="w-3.5 h-3.5 rounded-xs bg-[#ff5226] border border-black/30" />
              <span className="w-3.5 h-3.5 rounded-xs bg-[#b30000] border border-black/30" />
              <span className="w-3.5 h-3.5 rounded-xs bg-[#5a0000] border border-black/30" />
            </div>
            <span>{ht.more}</span>
          </div>
        </div>

        {/* SVG Element */}
        <div className="min-w-[720px]">
          <svg ref={svgRef} className="w-full h-auto overflow-visible" />
        </div>

        {/* Hover Floating Tooltip */}
        {tooltipData.visible && tooltipData.cell && (
          <div
            className="absolute pointer-events-none bg-black text-white border-2 border-yellow-300 px-3 py-2 rounded-xl text-xs font-black shadow-[4px_4px_0px_0px_#FFD700] z-50 transform -translate-x-1/2 -translate-y-full mb-3 transition-all duration-75"
            style={{
              left: `${tooltipData.x}px`,
              top: `${tooltipData.y}px`
            }}
          >
            <div className="flex items-center gap-1.5 text-yellow-300 font-mono text-[11px] mb-0.5">
              <Calendar className="w-3 h-3 text-yellow-300" />
              <span>{tooltipData.cell.dateStr}</span>
            </div>
            <div className="text-sm font-black text-white flex items-center justify-between gap-3">
              <span>{ht.tooltipVisitsLabel}:</span>
              <span className="text-amber-300 font-mono font-black text-base">{tooltipData.cell.visits} {ht.visitsUnit}</span>
            </div>
          </div>
        )}
      </div>

      {/* Selected Day Detail Panel */}
      {selectedCell && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-100 border-2 border-black p-4 rounded-2xl shadow-[3px_3px_0px_0px_#000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-black text-yellow-300 rounded-xl flex items-center justify-center font-black shadow-[1.5px_1.5px_0px_0px_#000]">
              <Info className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <p className="font-black text-xs text-black">
                {ht.selectedDetailHeading}: <span className="font-mono text-amber-900 bg-amber-200 px-2 py-0.5 rounded border border-black">{selectedCell.dateStr}</span>
              </p>
              <p className="text-[11px] font-bold text-zinc-800 mt-0.5">
                {t.heatmapDetailPrefix} <span className="font-mono font-black">{selectedCell.visits}</span> {t.visitsUnit}{t.heatmapDetailSuffix}{selectedCell.visits > stats.avgVisits * 1.3 ? `🔥 ${t.highTrafficDesc}` : selectedCell.visits > stats.avgVisits ? `⚡ ${t.aboveAverageDesc}` : `🌱 ${t.stableTrafficDesc}`}{t.heatmapDetailEnd}
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedCell(null)}
            className="text-xs font-black bg-white text-black border border-black px-3 py-1 rounded-xl shadow-[1px_1px_0px_0px_#000] hover:bg-zinc-100 self-end sm:self-auto font-sans"
          >
            {ht.closeBtn}
          </button>
        </motion.div>
      )}
    </div>
  );
};
