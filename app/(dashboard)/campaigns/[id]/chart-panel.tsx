'use client'

import { useState, useMemo } from 'react'
import {
  ResponsiveContainer, ComposedChart, Bar, Area, AreaChart,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'

/* ─── Time-period data ──────────────────────────────────────────── */

type Point = { label: string; impressions: number; clicks: number; conv: number; spend: number }

const WEEK_DATA: Point[] = [
  { label: 'Mon',  impressions: 18200, clicks: 912,  conv: 46, spend: 170 },
  { label: 'Tue',  impressions: 19400, clicks: 982,  conv: 51, spend: 183 },
  { label: 'Wed',  impressions: 17800, clicks: 890,  conv: 44, spend: 161 },
  { label: 'Thu',  impressions: 21000, clicks: 1050, conv: 55, spend: 198 },
  { label: 'Fri',  impressions: 22600, clicks: 1134, conv: 59, spend: 214 },
  { label: 'Sat',  impressions: 14000, clicks: 700,  conv: 35, spend: 128 },
  { label: 'Sun',  impressions: 11000, clicks: 532,  conv: 22, spend: 98  },
]

const MONTH_DATA: Point[] = [
  { label: 'W1 Jun',  impressions: 98200,  clicks: 4910, conv: 247, spend: 820  },
  { label: 'W2 Jun',  impressions: 112400, clicks: 5620, conv: 283, spend: 941  },
  { label: 'W3 Jun',  impressions: 124000, clicks: 6200, conv: 312, spend: 1038 },
  { label: 'W4 Jun',  impressions: 108600, clicks: 5430, conv: 273, spend: 907  },
]

const QUARTER_DATA: Point[] = [
  { label: 'Apr',  impressions: 310000, clicks: 15500, conv: 775, spend: 2584 },
  { label: 'May',  impressions: 378000, clicks: 18900, conv: 945, spend: 3150 },
  { label: 'Jun',  impressions: 443200, clicks: 22160, conv: 1115, spend: 3706 },
]

const YEAR_DATA: Point[] = [
  { label: 'Jan', impressions: 180000, clicks: 9000,  conv: 450,  spend: 1500 },
  { label: 'Feb', impressions: 210000, clicks: 10500, conv: 525,  spend: 1750 },
  { label: 'Mar', impressions: 248000, clicks: 12400, conv: 620,  spend: 2066 },
  { label: 'Apr', impressions: 310000, clicks: 15500, conv: 775,  spend: 2583 },
  { label: 'May', impressions: 378000, clicks: 18900, conv: 945,  spend: 3150 },
  { label: 'Jun', impressions: 443200, clicks: 22160, conv: 1115, spend: 3706 },
  { label: 'Jul', impressions: 489000, clicks: 24450, conv: 1222, spend: 4075 },
  { label: 'Aug', impressions: 502000, clicks: 25100, conv: 1255, spend: 4183 },
  { label: 'Sep', impressions: 467000, clicks: 23350, conv: 1167, spend: 3891 },
  { label: 'Oct', impressions: 521000, clicks: 26050, conv: 1302, spend: 4341 },
  { label: 'Nov', impressions: 610000, clicks: 30500, conv: 1525, spend: 5083 },
  { label: 'Dec', impressions: 695000, clicks: 34750, conv: 1737, spend: 5791 },
]

const PERIODS = [
  { id: '7d',  label: '7 days',  sublabel: 'Last week',    data: WEEK_DATA    },
  { id: '1m',  label: '1 month', sublabel: 'By week',      data: MONTH_DATA   },
  { id: '3m',  label: '3 months',sublabel: 'By month',     data: QUARTER_DATA },
  { id: '1y',  label: '1 year',  sublabel: 'All months',   data: YEAR_DATA    },
] as const

type PeriodId = typeof PERIODS[number]['id']

/* ─── Metrics ───────────────────────────────────────────────────── */

const METRICS = {
  conv:        { label: 'Conversions', color: '#7C3AED', fmt: (v: number) => v.toLocaleString('en-US') },
  clicks:      { label: 'Clicks',      color: '#2563EB', fmt: (v: number) => v.toLocaleString('en-US') },
  impressions: { label: 'Impressions', color: '#059669', fmt: (v: number) => `${(v / 1000).toFixed(0)}k` },
  spend:       { label: 'Spend ($)',   color: '#F59E0B', fmt: (v: number) => `$${v.toLocaleString('en-US')}` },
} as const

type MetricKey = keyof typeof METRICS

/* ─── Custom tooltip ────────────────────────────────────────────── */

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass px-4 py-3 shadow-xl text-sm min-w-[170px]" style={{ zIndex: 50 }}>
      <p className="text-gray-900 dark:text-white font-bold mb-2.5">{label}</p>
      {payload.map((entry: any) => {
        const mk = Object.keys(METRICS).find(k => METRICS[k as MetricKey].label === entry.name) as MetricKey | undefined
        const fmt = mk ? METRICS[mk].fmt : (v: number) => String(v)
        return (
          <div key={entry.name} className="flex items-center justify-between gap-5 py-0.5">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: entry.color }} />
              <span className="text-gray-500 dark:text-slate-400 text-xs">{entry.name}</span>
            </div>
            <span className="font-bold text-gray-900 dark:text-white text-xs tabular-nums">
              {fmt(entry.value)}
            </span>
          </div>
        )
      })}
    </div>
  )
}

/* ─── Summary stats ─────────────────────────────────────────────── */

function calcSummary(data: Point[]) {
  const total = (key: keyof Point) => data.reduce((s, d) => s + (d[key] as number), 0)
  const prev = 0.82 // simulate previous period ratio for % change
  const conv   = total('conv')
  const clicks = total('clicks')
  const spend  = total('spend')
  const imps   = total('impressions')
  return [
    { label: 'Conversions', value: conv.toLocaleString('en-US'),        change: +18, color: '#7C3AED' },
    { label: 'Clicks',      value: clicks.toLocaleString('en-US'),       change: +12, color: '#2563EB' },
    { label: 'Impressions', value: `${(imps / 1000).toFixed(0)}k`,       change: +9,  color: '#059669' },
    { label: 'Total Spend', value: `$${spend.toLocaleString('en-US')}`,  change: +14, color: '#F59E0B' },
    { label: 'Avg CTR',     value: `${((clicks / imps) * 100).toFixed(1)}%`, change: +3, color: '#0891B2' },
    { label: 'Avg CPA',     value: `$${(spend / conv).toFixed(2)}`,      change: -5,  color: '#E11D48' },
  ]
}

/* ─── Main component ────────────────────────────────────────────── */

export function ChartPanel({ daily }: { daily?: unknown[] }) {
  const [period, setPeriod] = useState<PeriodId>('7d')
  const [metric, setMetric] = useState<MetricKey>('conv')

  const periodCfg = PERIODS.find(p => p.id === period)!
  const data = periodCfg.data
  const m = METRICS[metric]
  const summary = useMemo(() => calcSummary(data), [data])

  const yFmt = (v: number) => m.fmt(v)

  return (
    <div className="glass p-6 space-y-6">

      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Performance Analytics</h2>
          <p className="text-gray-400 dark:text-slate-500 text-sm mt-0.5">{periodCfg.sublabel} — hover for details</p>
        </div>

        {/* Period switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-widest hidden sm:block">Period:</span>
          <div className="flex p-1 rounded-xl bg-black/[0.04] dark:bg-white/[0.05] gap-0.5">
            {PERIODS.map(p => (
              <button key={p.id} onClick={() => setPeriod(p.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  period === p.id
                    ? 'bg-white dark:bg-white/[0.14] text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-white'
                }`}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Summary stats row ─────────────────────────────────────── */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {summary.map(s => (
          <div key={s.label} className="p-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] hover:bg-black/[0.05] dark:hover:bg-white/[0.06] transition-colors">
            <div className="w-6 h-1 rounded-full mb-2" style={{ background: s.color }} />
            <p className="text-gray-900 dark:text-white font-bold text-base leading-none mb-1">{s.value}</p>
            <p className="text-gray-400 dark:text-slate-500 text-[10px] font-medium leading-tight mb-1.5">{s.label}</p>
            <span className={`text-[10px] font-bold ${s.change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
              {s.change >= 0 ? '↑' : '↓'} {Math.abs(s.change)}% vs prev
            </span>
          </div>
        ))}
      </div>

      {/* ── Metric picker + main bar chart ───────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-gray-600 dark:text-slate-300">Primary metric</p>
          <div className="flex p-1 rounded-xl bg-black/[0.04] dark:bg-white/[0.05] gap-0.5">
            {(Object.keys(METRICS) as MetricKey[]).map(key => (
              <button key={key} onClick={() => setMetric(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  metric === key
                    ? 'bg-white dark:bg-white/[0.14] text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-white'
                }`}>
                {METRICS[key].label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 16, right: 4, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="barGradMain" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={m.color} stopOpacity={0.95} />
                  <stop offset="100%" stopColor={m.color} stopOpacity={0.55} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 6" vertical={false} stroke="rgba(0,0,0,0.06)" />
              <XAxis
                dataKey="label" tickLine={false} axisLine={false}
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                interval={period === '1y' ? 1 : 0}
              />
              <YAxis
                tickLine={false} axisLine={false}
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                tickFormatter={yFmt}
                width={period === 'spend' ? 50 : 42}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: `${m.color}10`, radius: 6 }} />
              <Bar
                dataKey={metric} name={m.label}
                fill="url(#barGradMain)"
                radius={[6, 6, 0, 0]}
                maxBarSize={period === '1y' ? 28 : period === '3m' ? 56 : period === '1m' ? 80 : 52}
                label={{
                  position: 'top', fontSize: 10, fill: '#9ca3af',
                  formatter: (v: number) => m.fmt(v),
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Trend area chart ─────────────────────────────────────── */}
      <div>
        <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-3">
          All metrics — trend
        </p>
        <div className="h-36 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
              <defs>
                {[['ta1','#7C3AED'],['ta2','#2563EB'],['ta3','#F59E0B']].map(([id, color]) => (
                  <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={color} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.01} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 6" vertical={false} stroke="rgba(0,0,0,0.05)" />
              <XAxis
                dataKey="label" tick={{ fontSize: 10, fill: '#9ca3af' }}
                tickLine={false} axisLine={false}
                interval={period === '1y' ? 1 : 0}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(124,58,237,0.3)', strokeWidth: 1.5 }} />
              <Legend
                iconType="circle" iconSize={7}
                wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                formatter={(v: string) => <span style={{ color: '#9ca3af' }}>{v}</span>}
              />
              <Area type="monotone" dataKey="conv"   name="Conversions" stroke="#7C3AED" fill="url(#ta1)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, strokeWidth: 0, fill: '#7C3AED' }} />
              <Area type="monotone" dataKey="clicks" name="Clicks"       stroke="#2563EB" fill="url(#ta2)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, strokeWidth: 0, fill: '#2563EB' }} />
              <Area type="monotone" dataKey="spend"  name="Spend ($)"    stroke="#F59E0B" fill="url(#ta3)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, strokeWidth: 0, fill: '#F59E0B' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Bottom data strip ────────────────────────────────────── */}
      <div className={`grid gap-1 pt-4 border-t border-black/[0.05] dark:border-white/[0.05]`}
        style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}>
        {data.map(d => (
          <div key={d.label} className="text-center p-2 rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors cursor-default">
            <p className="text-[9px] font-bold text-gray-400 dark:text-slate-500 mb-1 truncate">{d.label}</p>
            <p className="text-xs font-bold leading-none mb-0.5" style={{ color: m.color }}>
              {m.fmt(d[metric])}
            </p>
            <p className="text-[9px] text-gray-400 dark:text-slate-500">${d.spend}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
