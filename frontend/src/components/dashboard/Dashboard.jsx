import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import {
  FileText, Pill, Stethoscope, Syringe, Activity,
  AlertTriangle, Upload, TrendingUp, TrendingDown,
  ChevronRight, Lightbulb, X, ArrowRight, Clock,
  BarChart3, Sparkles, Star, Check
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area
} from 'recharts'
import { useUserStore } from '../../store/userStore'
import { useRecordsStore } from '../../store/recordsStore'
import { StatCard, Avatar, ProgressBar, Alert, EmptyState } from '../ui/index'
import { Button } from '../ui/Button'
import { RecordTypeBadge } from '../ui/Badge'
import { formatDate, formatRelative, getRecordTypeLabel, getHealthScoreConfig } from '../../utils/formatters'

// Animated count-up number
function CountUp({ value, duration = 1000 }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const step = value / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= value) { setCount(value); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [value, duration])
  return <span>{count}</span>
}

// Health Score Ring
function HealthScoreRing({ score }) {
  const cfg = getHealthScoreConfig(score)
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="relative w-40 h-40 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
        {/* Track */}
        <circle cx="70" cy="70" r={radius} fill="none" strokeWidth="12" stroke="var(--color-surface-2)" />
        {/* Progress */}
        <motion.circle
          cx="70" cy="70" r={radius} fill="none" strokeWidth="12"
          stroke={cfg.color} strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="text-4xl font-bold text-[var(--color-text-primary)] font-data"
        >
          {score}
        </motion.span>
        <span className="text-xs font-semibold" style={{ color: cfg.color }}>{cfg.label}</span>
      </div>
    </div>
  )
}

// Quick Action Card
function QuickAction({ icon: Icon, label, desc, to, color = 'primary', danger = false }) {
  const colorMap = {
    primary: 'bg-blue-50 text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white',
    success: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
    warning: 'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white',
    danger:  'bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white',
  }
  return (
    <Link to={to} style={{ perspective: 1000, display: 'block' }}>
      <motion.div
        whileHover={{ y: -8, scale: 1.05, rotateX: 10, rotateY: -10, z: 40 }}
        whileTap={{ scale: 0.95 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="group relative rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-xl p-4 cursor-pointer hover:shadow-2xl transition-all duration-300 hover:border-[var(--color-primary)]/50 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 dark:from-white/10 dark:to-transparent pointer-events-none" />
        <div className={`absolute -inset-1 bg-gradient-to-r from-transparent via-[var(--color-primary)]/20 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500`} />
        <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center transition-all duration-300 shadow-md ${colorMap[color]}`} style={{ transform: 'translateZ(30px)' }}>
          <Icon size={20} />
        </div>
        <h3 className="font-semibold text-sm text-[var(--color-text-primary)]" style={{ transform: 'translateZ(10px)' }}>{label}</h3>
        <p className="text-xs text-[var(--color-text-muted)] mt-0.5" style={{ transform: 'translateZ(5px)' }}>{desc}</p>
      </motion.div>
    </Link>
  )
}

// Recent Activity Item
function ActivityItem({ record, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.01, x: 5 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-start gap-3 p-3 rounded-xl hover:bg-[var(--color-surface-2)] transition-all cursor-pointer group shadow-sm hover:shadow-md"
    >
      <div className="w-8 h-8 rounded-lg bg-[var(--color-surface-2)] flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all duration-300">
        <FileText size={14} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--color-text-primary)] truncate group-hover:text-[var(--color-primary)] transition-colors">{record.title}</p>
        <p className="text-xs text-[var(--color-text-muted)]">
          {record.metadata?.doctor_name && `${record.metadata.doctor_name} · `}
          {formatDate(record.date)}
        </p>
      </div>
      <div className="flex-shrink-0">
        <RecordTypeBadge type={record.type} />
      </div>
    </motion.div>
  )
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[var(--color-surface)]/90 backdrop-blur-md border border-[var(--color-border)] rounded-xl p-3 shadow-xl"
    >
      <p className="text-xs font-medium text-[var(--color-text-muted)] mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-bold flex items-center gap-2" style={{ color: p.color }}>
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color, boxShadow: `0 0 8px ${p.color}` }} />
          {p.name}: {p.value}{p.unit || ''}
        </p>
      ))}
    </motion.div>
  )
}

function FeedbackSection() {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [hoveredStar, setHoveredStar] = useState(0)

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 flex flex-col items-center justify-center text-center shadow-lg shadow-emerald-500/10">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1, rotate: 360 }} 
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-3 shadow-inner"
        >
          <Check size={24} className="text-emerald-600" />
        </motion.div>
        <h3 className="font-bold text-emerald-900 text-lg">Feedback Sent!</h3>
        <p className="text-sm text-emerald-700 mt-1">Thank you for reviewing Dr. Sarah Smith.</p>
      </motion.div>
    )
  }

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow group" style={{ perspective: 1000 }}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--color-primary)]/10 to-transparent rounded-full -mr-10 -mt-10 blur-xl group-hover:scale-150 transition-transform duration-700" />
      <div className="flex items-center gap-2 mb-1">
        <Star size={16} className="text-[var(--color-primary)]" />
        <h3 className="text-base font-bold text-[var(--color-text-primary)]">Rate your recent visit</h3>
      </div>
      <p className="text-xs text-[var(--color-text-muted)] mb-4">Dr. Sarah Smith • General Consultation (Yesterday)</p>
      
      <div className="flex flex-wrap gap-1 mb-4" style={{ transform: 'translateZ(15px)' }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
          <motion.button
            key={star}
            whileHover={{ scale: 1.3, rotate: 15 }}
            whileTap={{ scale: 0.8 }}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            onClick={() => setRating(star)}
            className="focus:outline-none"
          >
            <Star size={20} className={`transition-all duration-200 ${star <= (hoveredStar || rating) ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]' : 'text-gray-200 dark:text-gray-700'}`} />
          </motion.button>
        ))}
      </div>
      
      <AnimatePresence>
        {rating > 0 && (
          <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: 12 }} exit={{ opacity: 0, height: 0, marginTop: 0 }} className="space-y-3 overflow-hidden">
            <textarea
              className="w-full text-sm p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all outline-none resize-none"
              placeholder="Tell us what you liked or how we can improve..."
              rows={2}
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
            <Button onClick={() => setSubmitted(true)} size="sm" className="w-full shadow-md shadow-[var(--color-primary)]/20 hover:shadow-[var(--color-primary)]/40 transition-shadow">
              Submit Feedback
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Onboarding tooltip overlay
function OnboardingOverlay({ onDismiss }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-[var(--color-surface)] rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-purple-600 flex items-center justify-center mx-auto mb-4">
          <Sparkles size={28} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Welcome to oneHealth! 🎉</h2>
        <p className="text-[var(--color-text-secondary)] mb-6">Your AI-powered health passport is ready. Here's what you can do:</p>
        <div className="space-y-3 text-left mb-8">
          {[
            { emoji: '📁', text: 'This is your Health Passport — store all your records here' },
            { emoji: '⬆️', text: 'Upload your first report using the Add Record button' },
            { emoji: '🚨', text: 'Your Emergency Card is pre-loaded with your critical data' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--color-surface-2)]">
              <span className="text-xl">{item.emoji}</span>
              <p className="text-sm text-[var(--color-text-primary)]">{item.text}</p>
            </div>
          ))}
        </div>
        <Button onClick={onDismiss} className="w-full">
          Got it, let's go! <ArrowRight size={16} />
        </Button>
      </motion.div>
    </motion.div>
  )
}

export default function Dashboard() {
  const profile = useUserStore(s => s.profile)
  const healthMetrics = useUserStore(s => s.healthMetrics)
  const records = useRecordsStore(s => s.records)
  const trends = useRecordsStore(s => s.trends)
  const [trendType, setTrendType] = useState('weight')
  const [trendRange, setTrendRange] = useState('all')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const navigate = useNavigate()

  const name = profile?.name?.split(' ')[0] || 'there'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const statCards = [
    { label: 'Reports Uploaded',   value: healthMetrics?.reports_count || 0,        color: 'primary', icon: <FileText size={20} />,   to: '/passport' },
    { label: 'Prescriptions',      value: healthMetrics?.prescriptions_count || 0,   color: 'success', icon: <Pill size={20} />,        to: '/medications' },
    { label: 'Consultations',      value: healthMetrics?.consultations_count || 0,   color: 'purple',  icon: <Stethoscope size={20} />, to: '/passport' },
    { label: 'Vaccinations',       value: healthMetrics?.vaccinations_count || 0,    color: 'orange',  icon: <Syringe size={20} />,    to: '/passport' },
  ]

  const trendChartData = trends[trendType] || []
  const trendConfig = {
    weight:      { key: 'value',   name: 'Weight (kg)',  color: '#1A56DB', unit: 'kg' },
    bloodSugar:  { key: 'fasting', name: 'Fasting (mg/dL)', color: '#0E9F6E', unit: '' },
    cholesterol: { key: 'total',   name: 'Total Cholesterol', color: '#d97706', unit: '' },
  }
  const tc = trendConfig[trendType]

  const recentRecords = records.slice(0, 5)

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } }
  }
  const itemVariant = {
    hidden: { opacity: 0, y: 16 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
  }

  return (
    <>
      <AnimatePresence>
        {showOnboarding && <OnboardingOverlay onDismiss={() => setShowOnboarding(false)} />}
      </AnimatePresence>

      <div className="page-container py-6 space-y-6">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
              {greeting}, {name}! 👋
            </h1>
            <p className="text-[var(--color-text-secondary)] mt-0.5">
              Here's your health overview for today.
            </p>
          </div>
          <Button
            leftIcon={<Upload size={16} />}
            onClick={() => navigate('/passport')}
          >
            Add Record
          </Button>
        </motion.div>

        {/* Health Score + Stats Row */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-4 gap-4"
        >
          {/* Health Score Card */}
          <motion.div variants={itemVariant} className="lg:col-span-1" style={{ perspective: 1000 }}>
            <motion.div 
              whileHover={{ scale: 1.03, rotateX: 5, rotateY: -5 }}
              style={{ transformStyle: 'preserve-3d' }}
              className="rounded-xl border border-[var(--color-border)] bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 p-5 h-full flex flex-col items-center justify-center gap-3 shadow-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-shadow duration-500 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent dark:from-white/5 pointer-events-none" />
              <div style={{ transform: 'translateZ(30px)' }}>
                <HealthScoreRing score={healthMetrics?.health_score || 0} />
              </div>
              <div className="text-center" style={{ transform: 'translateZ(20px)' }}>
                <p className="text-sm font-bold text-[var(--color-text-primary)]">Health Score</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  Based on records, vaccinations & risk
                </p>
              </div>
              <Button variant="ghost" size="xs" className="text-[var(--color-primary)]" style={{ transform: 'translateZ(15px)' }}>
                How is this calculated?
              </Button>
            </motion.div>
          </motion.div>

          {/* Stat Cards */}
          {statCards.map((s, i) => (
            <motion.div key={s.label} variants={itemVariant}>
              <StatCard
                label={s.label}
                value={<CountUp value={s.value} />}
                icon={s.icon}
                color={s.color}
                className="h-full"
                onClick={() => navigate(s.to)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <QuickAction icon={Stethoscope} label="Check Symptoms"    desc="AI-powered triage" to="/symptoms"  color="primary" />
            <QuickAction icon={Upload}      label="Upload Report"     desc="Add to passport"   to="/passport"  color="success" />
            <QuickAction icon={AlertTriangle} label="Emergency Card"  desc="Critical info"     to="/emergency" color="danger"  />
            <QuickAction icon={Pill}        label="Medications"       desc="Today's schedule"  to="/medications" color="warning" />
          </div>
        </motion.div>

        {/* Main Content: Charts + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Health Trends Chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Health Trends</h2>
                <div className="flex gap-2 flex-wrap">
                  {/* Metric selector */}
                  <div className="flex gap-1 p-1 bg-[var(--color-surface-2)] rounded-lg">
                    {[
                      { id: 'weight', label: 'Weight' },
                      { id: 'bloodSugar', label: 'Blood Sugar' },
                      { id: 'cholesterol', label: 'Cholesterol' },
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => setTrendType(t.id)}
                        className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                          trendType === t.id
                            ? 'bg-[var(--color-surface)] text-[var(--color-primary)] shadow-sm'
                            : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {trendChartData.length >= 2 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={trendChartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                    <defs>
                      <linearGradient id="colorGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={tc.color} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={tc.color} stopOpacity={0} />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} dx={-10} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-primary)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    <Area
                      type="monotone"
                      dataKey={tc.key}
                      name={tc.name}
                      unit={tc.unit}
                      stroke={tc.color}
                      strokeWidth={3}
                      fill="url(#colorGrad)"
                      activeDot={{ r: 8, fill: tc.color, stroke: 'white', strokeWidth: 2, style: { filter: 'url(#glow)' } }}
                      dot={{ r: 0 }} // Hide dots unless active for cleaner look
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-center">
                  <BarChart3 size={32} className="text-[var(--color-text-muted)] mb-2" />
                  <p className="text-sm font-medium text-[var(--color-text-secondary)]">Not enough data yet</p>
                  <p className="text-xs text-[var(--color-text-muted)]">Upload more reports to see trends</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Panel: AI Insights + Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="space-y-4"
          >
            {/* AI Insights */}
            <div className="rounded-xl border border-[var(--color-border)] bg-gradient-to-br from-purple-50 to-blue-50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-purple-100">
                  <Sparkles size={14} className="text-purple-600" />
                </div>
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">AI Insights</h3>
              </div>
              <div className="space-y-2">
                {[
                  { text: 'Haemoglobin slightly low — consider iron-rich diet', severity: 'warning' },
                  { text: 'Blood pressure trending down — great progress!', severity: 'success' },
                  { text: 'Annual cholesterol check recommended', severity: 'info' },
                ].map((insight, i) => (
                  <div key={i} className={`p-2.5 rounded-lg text-xs font-medium ${
                    insight.severity === 'warning' ? 'bg-amber-100 text-amber-800' :
                    insight.severity === 'success' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {insight.text}
                  </div>
                ))}
              </div>
              <Link to="/risk" className="mt-3 flex items-center gap-1 text-xs text-[var(--color-primary)] font-medium">
                View full risk analysis <ChevronRight size={12} />
              </Link>
            </div>

            {/* Medication Reminders */}
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={14} className="text-[var(--color-primary)]" />
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Today's Medications</h3>
              </div>
              <div className="space-y-2">
                {[
                  { name: 'Salbutamol 100mcg', time: '08:00 AM', taken: true },
                  { name: 'Amlodipine 5mg',    time: '09:00 AM', taken: false },
                ].map((med, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-[var(--color-surface-2)]">
                    <div>
                      <p className="text-xs font-medium text-[var(--color-text-primary)]">{med.name}</p>
                      <p className="text-[10px] text-[var(--color-text-muted)]">{med.time}</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      med.taken ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {med.taken ? 'Taken' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
              <Link to="/medications" className="mt-2 flex items-center gap-1 text-xs text-[var(--color-primary)] font-medium hover:underline">
                Manage all medications <ChevronRight size={12} />
              </Link>
            </div>

            {/* Feedback Section */}
            <FeedbackSection />
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Recent Activity</h2>
            <Link to="/passport" className="flex items-center gap-1 text-sm text-[var(--color-primary)] font-medium hover:underline">
              View all <ChevronRight size={14} />
            </Link>
          </div>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] divide-y divide-[var(--color-border)]">
            {recentRecords.map((record, i) => (
              <ActivityItem key={record.id} record={record} index={i} />
            ))}
          </div>
        </motion.div>
      </div>
    </>
  )
}
