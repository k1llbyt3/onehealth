import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Calendar, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  FileText,
  Activity,
  Star,
  MessageSquare,
  Inbox,
  ArrowUpRight,
  Zap,
  Heart,
  ChevronRight
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, Button } from '../../components/ui'
import api from '../../services/api'

const CHART_DATA = [
  { day: 'Mon', reports: 4 },
  { day: 'Tue', reports: 7 },
  { day: 'Wed', reports: 5 },
  { day: 'Thu', reports: 9 },
  { day: 'Fri', reports: 6 },
  { day: 'Sat', reports: 3 },
  { day: 'Sun', reports: 8 },
]

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg px-3 py-2">
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-base font-bold text-slate-900 dark:text-white">{payload[0].value} reports</p>
    </div>
  )
}

export function Dashboard() {
  const [stats, setStats] = useState({ totalPatients: 0, avgHealth: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const res = await api.get('/doctors/patients')
        const pts = res.data.patients || []
        let avg = 0
        if (pts.length > 0) {
          const sum = pts.reduce((acc, p) => acc + (p.profile?.health_score || 85), 0)
          avg = Math.round(sum / pts.length)
        }
        setStats({ totalPatients: pts.length, avgHealth: avg })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const statCards = [
    {
      title: 'Total Patients',
      value: loading ? '—' : stats.totalPatients.toString(),
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
      light: 'bg-blue-50 dark:bg-blue-500/10',
      iconColor: 'text-blue-600 dark:text-blue-400',
      trend: '+2 this week',
    },
    {
      title: "Today's Consults",
      value: '0',
      icon: Calendar,
      gradient: 'from-emerald-500 to-teal-600',
      light: 'bg-emerald-50 dark:bg-emerald-500/10',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      trend: 'No sessions yet',
    },
    {
      title: 'Pending Follow-ups',
      value: '0',
      icon: Clock,
      gradient: 'from-amber-500 to-orange-500',
      light: 'bg-amber-50 dark:bg-amber-500/10',
      iconColor: 'text-amber-600 dark:text-amber-400',
      trend: 'All clear',
    },
    {
      title: 'Avg Health Score',
      value: loading ? '—' : `${stats.avgHealth}%`,
      icon: Heart,
      gradient: 'from-indigo-500 to-purple-600',
      light: 'bg-indigo-50 dark:bg-indigo-500/10',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      trend: 'Across all patients',
    },
  ]

  return (
    <div className="space-y-6">

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="p-5 border-0 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white dark:bg-slate-900 overflow-hidden relative group">
              {/* Subtle top accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${stat.gradient} opacity-60 group-hover:opacity-100 transition-opacity`} />
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{stat.trend}</p>
                </div>
                <div className={`p-3 rounded-2xl ${stat.light} flex-shrink-0 ml-3`}>
                  <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Chart + Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Weekly Reports Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="p-6 border-0 shadow-sm bg-white dark:bg-slate-900 h-full">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Reports Reviewed</h3>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">AI-analyzed reports — this week</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" />
                <span>+12%</span>
              </div>
            </div>
            <div style={{ width: '100%', height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_DATA} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700/60" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="reports"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    fill="url(#chartGrad)"
                    dot={{ r: 4, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
                    activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2, fill: '#6366f1' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* AI Alerts Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card className="p-6 border-0 shadow-sm bg-white dark:bg-slate-900 h-full flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">AI Health Alerts</h3>
              <span className="px-2 py-0.5 bg-red-100 dark:bg-red-400/15 text-red-600 dark:text-red-400 text-[11px] font-bold rounded-full border border-red-200 dark:border-red-400/20">
                3 New
              </span>
            </div>

            <div className="flex-1 space-y-3">
              {[
                {
                  type: 'Critical',
                  patient: 'David Warner',
                  desc: 'Abnormal ECG detected in recent report.',
                  time: '10m ago',
                  icon: Activity,
                  dot: 'bg-red-500',
                  badge: 'bg-red-100 dark:bg-red-400/15 text-red-700 dark:text-red-400',
                },
                {
                  type: 'Warning',
                  patient: 'Susan Clarke',
                  desc: 'Missed 3 consecutive medication doses.',
                  time: '1h ago',
                  icon: AlertCircle,
                  dot: 'bg-amber-500',
                  badge: 'bg-amber-100 dark:bg-amber-400/15 text-amber-700 dark:text-amber-400',
                },
                {
                  type: 'Info',
                  patient: 'James Smith',
                  desc: 'Blood pressure returned to normal range.',
                  time: '2h ago',
                  icon: FileText,
                  dot: 'bg-blue-500',
                  badge: 'bg-blue-100 dark:bg-blue-400/15 text-blue-700 dark:text-blue-400',
                },
              ].map((alert, i) => (
                <div
                  key={i}
                  className="flex gap-3 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all cursor-pointer group"
                >
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${alert.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <h4 className="font-semibold text-slate-900 dark:text-white text-sm truncate">{alert.patient}</h4>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 flex-shrink-0">{alert.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">{alert.desc}</p>
                    <span className={`mt-1.5 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${alert.badge}`}>
                      {alert.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="ghost" className="w-full mt-4 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 font-semibold text-sm">
              View All Alerts
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Card>
        </motion.div>
      </div>

      {/* Feedback + Appointments Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Recent Feedback */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-1"
        >
          <Card className="p-6 border-0 shadow-sm bg-white dark:bg-slate-900 h-full flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Patient Feedback</h3>
              <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 dark:bg-amber-400/10 px-2.5 py-1 rounded-full text-xs border border-amber-100 dark:border-amber-400/20">
                <Star size={11} className="fill-amber-500" />
                <span>9.8</span>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              {[
                { patient: 'Priya Sharma', rating: 10, time: '2h ago', comment: 'Very patient and explained everything clearly!' },
                { patient: 'Michael Chang', rating: 9, time: '5h ago', comment: 'Excellent consultation, felt very heard.' },
                { patient: 'Sarah Jenkins', rating: 8, time: '1d ago', comment: 'Good visit, slight delay in start time.' },
              ].map((fb, i) => (
                <div key={i} className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{fb.patient}</h4>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">{fb.time}</span>
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {[1,2,3,4,5,6,7,8,9,10].map(s => (
                      <Star key={s} size={9} className={s <= fb.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 dark:text-slate-700 fill-current'} />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic leading-snug">"{fb.comment}"</p>
                </div>
              ))}
            </div>

            <Button variant="ghost" className="w-full mt-4 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 font-semibold text-sm">
              <MessageSquare size={14} className="mr-1.5" />
              View All Reviews
            </Button>
          </Card>
        </motion.div>

        {/* Upcoming Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="lg:col-span-2"
        >
          <Card className="border-0 shadow-sm bg-white dark:bg-slate-900 h-full flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Upcoming Appointments</h3>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">Today's schedule</p>
              </div>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4">
                + Schedule
              </Button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center py-14 text-center px-6">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <Inbox className="w-8 h-8 text-slate-400 dark:text-slate-500" />
              </div>
              <p className="font-semibold text-slate-700 dark:text-slate-300">No appointments scheduled</p>
              <p className="text-slate-400 dark:text-slate-500 text-sm max-w-sm mt-1.5 leading-relaxed">
                When patients book consultations with you, they'll appear here.
              </p>
              <Button variant="outline" size="sm" className="mt-5 text-sm border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                <Zap className="w-3.5 h-3.5 mr-1.5" />
                Quick Invite
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

    </div>
  )
}
