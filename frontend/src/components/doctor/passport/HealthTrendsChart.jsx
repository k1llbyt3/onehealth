import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from 'recharts'
import {
  TrendingUp, TrendingDown, Minus, Activity,
  AlertTriangle, CheckCircle2, ChevronDown, Info
} from 'lucide-react'

// Parameters that are not meaningful to trend over time or shouldn't appear
const EXCLUDED_PARAMS = new Set([
  'Weight', 'BMI', 'Height', 'Body Weight', 'Body Mass Index',
  'Amlodipine Dosage', 'Lisinopril', 'Albuterol Inhaler', 'Dose Number',
])

const STATUS_COLORS = {
  normal:   { dot: '#10b981', line: '#10b981', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', bar: '#10b981' },
  high:     { dot: '#f59e0b', line: '#f59e0b', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', bar: '#f59e0b' },
  low:      { dot: '#3b82f6', line: '#3b82f6', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', bar: '#3b82f6' },
  critical: { dot: '#ef4444', line: '#ef4444', badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', bar: '#ef4444' },
}

const PARAM_COLORS = [
  '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#84cc16'
]

function toGradId(param) {
  return 'grad_' + param.replace(/[^a-zA-Z0-9]/g, '_')
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const p = payload[0]
  const status = p.payload?.status
  const color = STATUS_COLORS[status] || STATUS_COLORS.normal
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-4 min-w-[170px]">
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">
        {p.value}
        <span className="text-sm font-normal text-slate-400 ml-1">{p.payload?.unit}</span>
      </p>
      {status && (
        <span className={`mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${color.badge}`}>
          {status === 'normal' && <CheckCircle2 className="w-3 h-3" />}
          {(status === 'high' || status === 'critical') && <AlertTriangle className="w-3 h-3" />}
          {status}
        </span>
      )}
      {p.payload?.refRange && (
        <p className="text-[10px] text-slate-400 mt-1.5">Normal: {p.payload.refRange} {p.payload.unit}</p>
      )}
    </div>
  )
}

function StatusDot(props) {
  const { cx, cy, payload } = props
  if (cx == null || cy == null) return null
  const color = STATUS_COLORS[payload?.status]?.dot || '#6366f1'
  return <circle cx={cx} cy={cy} r={5} fill={color} stroke="#fff" strokeWidth={2.5} />
}

function TrendBadge({ data }) {
  if (!data || data.length < 2) return null
  const first = data[0]?.value
  const last = data[data.length - 1]?.value
  const diff = ((last - first) / (first || 1)) * 100
  if (Math.abs(diff) < 0.5) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-semibold">
        <Minus className="w-3 h-3" /> Stable
      </span>
    )
  }
  if (diff > 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-[11px] font-semibold">
        <TrendingUp className="w-3 h-3" /> +{diff.toFixed(1)}%
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold">
      <TrendingDown className="w-3 h-3" /> {diff.toFixed(1)}%
    </span>
  )
}

// Parse a reference range string like "12.0 - 16.0" into { min, max }
function parseRefRange(refRange) {
  if (!refRange) return null
  const match = refRange.match(/([0-9.]+)\s*[-–]\s*([0-9.]+)/)
  if (match) return { min: parseFloat(match[1]), max: parseFloat(match[2]) }
  const gtMatch = refRange.match(/[>≥]\s*([0-9.]+)/)
  if (gtMatch) return { min: parseFloat(gtMatch[1]), max: null }
  const ltMatch = refRange.match(/[<≤]\s*([0-9.]+)/)
  if (ltMatch) return { min: null, max: parseFloat(ltMatch[1]) }
  return null
}

export function HealthTrendsChart({ timeline }) {
  const { paramMap, paramList } = useMemo(() => {
    const map = {}
    if (!timeline?.length) return { paramMap: {}, paramList: [] }

    const sorted = [...timeline].sort((a, b) => new Date(a.date) - new Date(b.date))

    sorted.forEach(item => {
      if (item.type !== 'record') return
      const extracted = item.data?.ai_analysis?.extracted_values
      if (!Array.isArray(extracted) || extracted.length === 0) return

      const dateLabel = new Date(item.date).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: '2-digit'
      })

      extracted.forEach(({ parameter, value, unit, status, reference_range }) => {
        if (!parameter || EXCLUDED_PARAMS.has(parameter)) return
        const numVal = parseFloat(value)
        if (isNaN(numVal)) return

        if (!map[parameter]) {
          map[parameter] = { name: parameter, unit: unit || '', data: [], refRange: reference_range || '' }
        }
        // keep the most recent refRange
        if (reference_range) map[parameter].refRange = reference_range

        map[parameter].data.push({
          date: dateLabel,
          value: numVal,
          unit: unit || '',
          status: status || 'normal',
          refRange: reference_range || '',
        })
      })
    })

    // Sort: multi-reading params first, then alphabetical
    const keys = Object.keys(map).sort((a, b) => {
      const diff = map[b].data.length - map[a].data.length
      return diff !== 0 ? diff : a.localeCompare(b)
    })

    return { paramMap: map, paramList: keys }
  }, [timeline])

  const [activeParam, setActiveParam] = useState(null)
  const [showAll, setShowAll] = useState(false)

  const resolvedActive = activeParam && paramList.includes(activeParam)
    ? activeParam
    : paramList[0] || null

  if (paramList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Activity className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
        <h4 className="font-bold text-slate-600 dark:text-slate-400">No Lab Data Available</h4>
        <p className="text-slate-400 text-sm mt-1 max-w-xs">Lab reports with extracted values will show trends here.</p>
      </div>
    )
  }

  const displayedParams = showAll ? paramList : paramList.slice(0, 10)
  const activeData = resolvedActive ? paramMap[resolvedActive] : null
  const latest = activeData?.data?.[activeData.data.length - 1]
  const latestStatus = latest?.status || 'normal'
  const statusColor = STATUS_COLORS[latestStatus] || STATUS_COLORS.normal
  const colorIndex = paramList.indexOf(resolvedActive)
  const chartColor = PARAM_COLORS[colorIndex % PARAM_COLORS.length]
  const gradId = toGradId(resolvedActive || 'param')
  const parsed = parseRefRange(activeData?.refRange || latest?.refRange || '')

  return (
    <div className="space-y-5">

      {/* Parameter Selector Pills */}
      <div className="flex flex-wrap gap-2">
        {displayedParams.map(param => {
          const pd = paramMap[param]
          const last = pd.data[pd.data.length - 1]
          const pStatus = last?.status || 'normal'
          const dotColor = STATUS_COLORS[pStatus]?.dot || '#94a3b8'
          const isActive = resolvedActive === param
          return (
            <button
              key={param}
              onClick={() => setActiveParam(param)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200
                ${isActive
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500'
                }`}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: isActive ? 'rgba(255,255,255,0.75)' : dotColor }}
              />
              {param}
              {pd.data.length > 1 && (
                <span className={`text-[10px] font-bold ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>
                  ×{pd.data.length}
                </span>
              )}
            </button>
          )
        })}
        {paramList.length > 10 && (
          <button
            onClick={() => setShowAll(s => !s)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border border-dashed border-slate-300 dark:border-slate-600 text-slate-500 hover:border-indigo-400 hover:text-indigo-500 transition-all"
          >
            {showAll ? 'Show less' : `+${paramList.length - 10} more`}
            <ChevronDown className={`w-3 h-3 transition-transform ${showAll ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {/* Main Chart Area */}
      <AnimatePresence mode="wait">
        {activeData && (
          <motion.div
            key={resolvedActive}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden shadow-sm"
          >
            {/* Header row */}
            <div className="flex items-start justify-between px-5 pt-5 pb-3">
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                  {resolvedActive}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white leading-none">
                    {latest?.value ?? '—'}
                  </span>
                  <span className="text-base font-medium text-slate-400 dark:text-slate-500">
                    {activeData.unit}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${statusColor.badge}`}>
                  {latestStatus === 'normal' && <CheckCircle2 className="w-3 h-3" />}
                  {(latestStatus === 'high' || latestStatus === 'critical') && <AlertTriangle className="w-3 h-3" />}
                  {latestStatus === 'low' && <Info className="w-3 h-3" />}
                  {latestStatus}
                </span>
                <TrendBadge data={activeData.data} />
                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  {activeData.data.length} reading{activeData.data.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Chart */}
            {activeData.data.length < 2 ? (
              <div className="flex flex-col items-center py-10 text-center px-5 pb-5">
                <div
                  className="w-28 h-28 rounded-full flex flex-col items-center justify-center mb-3"
                  style={{ background: `${chartColor}12`, border: `3px solid ${chartColor}40` }}
                >
                  <span className="text-3xl font-extrabold" style={{ color: chartColor }}>
                    {activeData.data[0]?.value}
                  </span>
                  <span className="text-xs font-medium mt-0.5" style={{ color: `${chartColor}99` }}>
                    {activeData.unit}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Recorded on {activeData.data[0]?.date}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Upload more reports to see a trend</p>
              </div>
            ) : (
              <div style={{ width: '100%', height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activeData.data} margin={{ top: 8, right: 20, bottom: 4, left: -4 }}>
                    <defs>
                      <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={chartColor} stopOpacity={0.28} />
                        <stop offset="95%" stopColor={chartColor} stopOpacity={0.03} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: '#94a3b8' }}
                      axisLine={false}
                      tickLine={false}
                      dy={6}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: '#94a3b8' }}
                      axisLine={false}
                      tickLine={false}
                      domain={['auto', 'auto']}
                      width={44}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    {/* Reference range band lines */}
                    {parsed?.min != null && (
                      <ReferenceLine
                        y={parsed.min}
                        stroke="#10b981"
                        strokeDasharray="4 3"
                        strokeWidth={1.5}
                        strokeOpacity={0.6}
                        label={{ value: 'Min', position: 'insideTopRight', fontSize: 10, fill: '#10b981' }}
                      />
                    )}
                    {parsed?.max != null && (
                      <ReferenceLine
                        y={parsed.max}
                        stroke="#10b981"
                        strokeDasharray="4 3"
                        strokeWidth={1.5}
                        strokeOpacity={0.6}
                        label={{ value: 'Max', position: 'insideTopRight', fontSize: 10, fill: '#10b981' }}
                      />
                    )}
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={chartColor}
                      strokeWidth={2.5}
                      fill={`url(#${gradId})`}
                      dot={<StatusDot />}
                      activeDot={{ r: 7, strokeWidth: 2, stroke: '#fff', fill: chartColor }}
                      isAnimationActive={true}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* ── Stats bar below chart ── */}
            <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-800 border-t border-slate-100 dark:border-slate-800">
              <div className="px-4 py-3">
                <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Current</p>
                <p className="text-base font-extrabold text-slate-900 dark:text-white">
                  {latest?.value ?? '—'}
                  <span className="text-xs font-normal text-slate-400 ml-1">{activeData.unit}</span>
                </p>
              </div>
              <div className="px-4 py-3">
                <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Normal Range</p>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {activeData.refRange
                    ? `${activeData.refRange} ${activeData.unit}`
                    : <span className="text-slate-400 font-normal text-xs">Not specified</span>
                  }
                </p>
              </div>
              <div className="px-4 py-3">
                <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Last Tested</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {latest?.date ?? '—'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary grid — all params at a glance */}
      <div>
        <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
          All Parameters — Latest Reading
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {paramList.map(param => {
            const pd = paramMap[param]
            const entry = pd.data[pd.data.length - 1]
            const pStatus = entry?.status || 'normal'
            const dotColor = STATUS_COLORS[pStatus]?.dot || '#94a3b8'
            const isActive = resolvedActive === param
            return (
              <button
                key={param}
                onClick={() => setActiveParam(param)}
                className={`p-3 rounded-xl border text-left transition-all
                  ${isActive
                    ? 'border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/20 shadow-sm'
                    : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase truncate max-w-[80%] leading-tight">
                    {param}
                  </span>
                  <span className="w-2 h-2 rounded-full flex-shrink-0 ml-1" style={{ backgroundColor: dotColor }} />
                </div>
                <p className="text-lg font-extrabold text-slate-900 dark:text-white leading-none">
                  {entry?.value ?? '—'}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{pd.unit}</p>
                {/* Reference range under grid card */}
                {pd.refRange && (
                  <p className="text-[9px] text-slate-400 dark:text-slate-600 mt-1 leading-tight">
                    Ref: {pd.refRange}
                  </p>
                )}
                {pd.data.length > 1 && (
                  <p className="text-[10px] text-indigo-500 dark:text-indigo-400 font-semibold mt-1">
                    {pd.data.length} readings
                  </p>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
