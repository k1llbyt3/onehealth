import React from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Calendar, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  FileText,
  Activity,
  ArrowRight,
  Star,
  MessageSquare
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, Button } from '../../components/ui'

const DATA = [
  { name: 'Mon', reports: 4 },
  { name: 'Tue', reports: 7 },
  { name: 'Wed', reports: 5 },
  { name: 'Thu', reports: 11 },
  { name: 'Fri', reports: 8 },
  { name: 'Sat', reports: 3 },
  { name: 'Sun', reports: 2 },
]

const UPCOMING = [
  { id: 1, patient: 'Michael Chang', time: '09:00 AM', type: 'Follow-up', status: 'Waiting' },
  { id: 2, patient: 'Sarah Jenkins', time: '09:45 AM', type: 'Consultation', status: 'Confirmed' },
  { id: 3, patient: 'Robert Fox', time: '10:30 AM', type: 'Report Review', status: 'Confirmed' },
  { id: 4, patient: 'Emily Davis', time: '11:15 AM', type: 'Consultation', status: 'Delayed' },
]

export function Dashboard() {
  return (
    <div className="space-y-6">
      
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Patients', value: '1,248', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/10' },
          { title: "Today's Consults", value: '14', icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
          { title: 'Pending Follow-ups', value: '8', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-500/10' },
          { title: 'Health Score Avg', value: '82%', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{ perspective: 1000 }}
          >
            <motion.div whileHover={{ y: -8, scale: 1.05, rotateX: 10, rotateY: -10, z: 40 }} style={{ transformStyle: 'preserve-3d' }}>
              <Card className="p-6 border-0 shadow-lg hover:shadow-2xl hover:shadow-[var(--color-primary)]/20 transition-all duration-500 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 pointer-events-none" />
                <div className="flex items-center justify-between relative z-10" style={{ transform: 'translateZ(20px)' }}>
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{stat.title}</p>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white" style={{ transform: 'translateZ(10px)' }}>{stat.value}</h3>
                  </div>
                  <div className={`p-4 rounded-2xl ${stat.bg} group-hover:scale-110 transition-transform duration-500`} style={{ transform: 'translateZ(30px)' }}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="p-6 h-full border-0 shadow-sm bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Health Reports Reviewed</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Weekly trend of AI-analyzed reports</p>
              </div>
              <Button variant="outline" size="sm" className="hidden sm:flex">View Details</Button>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                    <filter id="glowDr">
                      <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area type="monotone" dataKey="reports" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorReports)" activeDot={{ r: 8, strokeWidth: 2, stroke: 'white', style: { filter: 'url(#glowDr)' } }} dot={{ r: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* AI Alerts Panel */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 h-full border-0 shadow-sm bg-white dark:bg-slate-900 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Health Alerts</h3>
              <div className="px-2 py-1 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-full">3 New</div>
            </div>
            
            <div className="flex-1 space-y-4">
              {[
                { type: 'Critical', patient: 'David Warner', desc: 'Abnormal ECG detected in recent report upload.', time: '10m ago', icon: Activity, color: 'text-red-600', bg: 'bg-red-50' },
                { type: 'Warning', patient: 'Susan Clarke', desc: 'Missed 3 consecutive medication doses.', time: '1h ago', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
                { type: 'Info', patient: 'James Smith', desc: 'Blood pressure returned to normal range.', time: '2h ago', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
              ].map((alert, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-colors cursor-pointer group">
                  <div className={`p-2 rounded-xl h-fit shrink-0 ${alert.bg} dark:bg-opacity-10`}>
                    <alert.icon className={`w-5 h-5 ${alert.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{alert.patient}</h4>
                      <span className="text-[10px] text-slate-400">{alert.time}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-snug">{alert.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="ghost" className="w-full mt-4 text-blue-600 dark:text-blue-400">View All Alerts</Button>
          </Card>
        </motion.div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Patient Feedback */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="lg:col-span-1"
        >
          <Card className="p-6 h-full border-0 shadow-sm bg-white dark:bg-slate-900 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Feedback</h3>
              <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded-full text-xs">
                <Star size={12} className="fill-amber-500" /> 9.8 / 10
              </div>
            </div>
            
            <div className="flex-1 space-y-4">
              {[
                { patient: 'Priya Sharma', rating: 10, time: '2h ago', comment: 'Very patient and explained everything clearly. Highly recommend!' },
                { patient: 'Michael Chang', rating: 9, time: '5h ago', comment: 'Excellent consultation, felt very heard.' },
                { patient: 'Sarah Jenkins', rating: 8, time: '1d ago', comment: 'Good visit, slight delay in start time.' },
              ].map((fb, i) => (
                <div key={i} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/20">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{fb.patient}</h4>
                    <span className="text-[10px] text-slate-400">{fb.time}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
                      <Star key={star} size={10} className={star <= fb.rating ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_2px_rgba(251,191,36,0.5)]' : 'text-slate-300 dark:text-slate-700'} />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 italic">"{fb.comment}"</p>
                </div>
              ))}
            </div>
            
            <Button variant="ghost" className="w-full mt-4 text-blue-600 dark:text-blue-400" leftIcon={<MessageSquare size={16} />}>View All Reviews</Button>
          </Card>
        </motion.div>

        {/* Upcoming Appointments */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="h-full border-0 shadow-sm bg-white dark:bg-slate-900 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Upcoming Appointments</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Today's schedule</p>
            </div>
            <Button>Schedule New</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-500 dark:text-slate-400">
                  <th className="px-6 py-4 font-medium">Patient Name</th>
                  <th className="px-6 py-4 font-medium">Time</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {UPCOMING.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
                          {apt.patient.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white">{apt.patient}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{apt.time}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{apt.type}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium
                        ${apt.status === 'Waiting' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' : 
                          apt.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 
                          'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'}`}
                      >
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        Start Consult <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
      </div>

    </div>
  )
}
