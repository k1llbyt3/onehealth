import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HeartPulse, Shield, Zap, Brain, ArrowRight, Check,
  Stethoscope, FileSearch, AlertTriangle, BarChart3,
  BookHeart, Star, ChevronRight, User
} from 'lucide-react'
import { Button } from '../components/ui/Button'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: 'easeOut' }
})

const features = [
  { icon: BookHeart, title: 'Lifetime Health Passport', desc: 'All your medical records — reports, prescriptions, diagnoses, vaccinations — in one secure place.', color: 'from-blue-500 to-indigo-600' },
  { icon: Brain, title: 'AI Symptom Analyzer', desc: 'Describe your symptoms. Our AI provides possible conditions, OTC suggestions, and severity assessments.', color: 'from-purple-500 to-pink-600' },
  { icon: AlertTriangle, title: 'Emergency Assistant', desc: 'One-tap emergency card with blood group, allergies, and contacts — accessible without login via QR code.', color: 'from-red-500 to-rose-600' },
  { icon: FileSearch, title: 'AI Report Analyzer', desc: 'Upload lab reports and get plain-language summaries with abnormal value detection.', color: 'from-emerald-500 to-teal-600' },
  { icon: BarChart3, title: 'Feedback Analytics', desc: 'AI-powered sentiment analysis of patient feedback with executive-level dashboards.', color: 'from-amber-500 to-orange-600' },
  { icon: Shield, title: 'Enterprise Security', desc: 'Firebase Auth, TLS 1.3, AES-256 encryption. HIPAA-aligned. Your data stays yours.', color: 'from-slate-500 to-slate-700' },
]

const stats = [
  { value: '400M+', label: 'Health Records Unified' },
  { value: '85%',   label: 'AI Symptom Accuracy' },
  { value: '<1s',   label: 'Emergency Card Access' },
  { value: '99.9%', label: 'Platform Uptime' },
]

const testimonials = [
  { name: 'Priya S.', role: 'Patient, Bengaluru', text: '"I carry my entire medical history in my phone now. The emergency card feature alone is worth it."', rating: 5 },
  { name: 'Dr. Arjun N.', role: 'Cardiologist, Chennai', text: '"My patients come in with organized records. It saves 10 minutes per consultation. Exceptional."', rating: 5 },
  { name: 'Meena R.', role: 'Caregiver', text: '"Managing my father\'s medications and records used to be chaos. oneHealth changed everything."', rating: 5 },
]

export default function Landing() {
  const [authIntent, setAuthIntent] = useState(null) // 'login' | 'register' | null
  const navigate = useNavigate()

  const handleRoleSelect = (role) => {
    if (authIntent === 'login') {
      navigate(role === 'doctor' ? '/doctor/login' : '/login')
    } else {
      navigate(role === 'doctor' ? '/doctor/register' : '/register')
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <AnimatePresence>
        {authIntent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setAuthIntent(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--color-surface)] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-[var(--color-border)] p-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-black text-[var(--color-text-primary)] mb-2">
                  {authIntent === 'login' ? 'Welcome Back' : 'Join oneHealth'}
                </h2>
                <p className="text-[var(--color-text-secondary)]">Please select your account type to continue.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => handleRoleSelect('patient')}
                  className="flex flex-col items-center justify-center gap-4 p-6 rounded-2xl border-2 border-transparent bg-blue-50 hover:border-blue-500 hover:shadow-lg transition-all group"
                >
                  <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <User size={28} />
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-blue-900">Patient</h3>
                    <p className="text-xs text-blue-600/70 mt-1">Access my health passport</p>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleSelect('doctor')}
                  className="flex flex-col items-center justify-center gap-4 p-6 rounded-2xl border-2 border-transparent bg-emerald-50 hover:border-emerald-500 hover:shadow-lg transition-all group"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Stethoscope size={28} />
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-emerald-900">Doctor</h3>
                    <p className="text-xs text-emerald-600/70 mt-1">Manage my patients</p>
                  </div>
                </button>
              </div>

              <div className="mt-8 text-center">
                <Button variant="ghost" onClick={() => setAuthIntent(null)}>Cancel</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-[var(--color-surface)]/80 backdrop-blur-sm border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-purple-600 flex items-center justify-center">
              <HeartPulse size={18} className="text-white" />
            </div>
            <span className="font-black text-xl text-[var(--color-text-primary)]">oneHealth</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm text-[var(--color-text-secondary)]">
            <a href="#features" className="hover:text-[var(--color-primary)] transition-colors font-medium">Features</a>
            <a href="#how-it-works" className="hover:text-[var(--color-primary)] transition-colors font-medium">How it Works</a>
            <a href="#testimonials" className="hover:text-[var(--color-primary)] transition-colors font-medium">Testimonials</a>
            <Link to="/register" className="hover:text-[var(--color-primary)] transition-colors font-medium">For Doctors</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setAuthIntent('login')}>Log In</Button>
            <Button size="sm" onClick={() => setAuthIntent('register')}>Get Started Free</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-4 overflow-hidden">
        {/* Background gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--color-primary)] rounded-full opacity-10 blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl" />

        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-sm font-semibold text-[var(--color-primary)] mb-8"
          >
            <Zap size={14} />
            Powered by Google Gemini AI
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-5xl sm:text-7xl font-black text-[var(--color-text-primary)] leading-[1.08] mb-6"
          >
            Your Lifetime
            <span className="block gradient-text">Health Passport</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
            className="text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            oneHealth unifies your entire medical history, delivers AI-powered health guidance, and ensures critical information is available in every emergency — all in one secure platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="xl" className="shadow-lg shadow-[var(--color-primary)]/25" rightIcon={<ArrowRight size={20} />} onClick={() => setAuthIntent('register')}>
              Create Free Account
            </Button>
            <Link to="/emergency/demo">
              <Button size="xl" variant="outline">
                View Emergency Card Demo
              </Button>
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-6 mt-10 flex-wrap"
          >
            {['HIPAA Aligned', 'AES-256 Encrypted', 'Free Forever'].map(badge => (
              <div key={badge} className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] font-medium">
                <Check size={14} className="text-emerald-600" />
                {badge}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-[var(--color-surface)] border-y border-[var(--color-border)]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div key={s.label} {...fadeUp(i * 0.1)} className="text-center">
                <p className="text-4xl font-black gradient-text-health mb-1">{s.value}</p>
                <p className="text-sm text-[var(--color-text-secondary)] font-medium">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <h2 className="text-4xl font-black text-[var(--color-text-primary)] mb-4">Everything you need for your health</h2>
            <p className="text-xl text-[var(--color-text-secondary)] max-w-xl mx-auto">From daily medication tracking to AI-powered emergency guidance — oneHealth has you covered.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <motion.div
                  key={f.title}
                  {...fadeUp(i * 0.08)}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 hover:shadow-[var(--shadow-lg)] transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-md`}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-[var(--color-text-primary)] mb-2">{f.title}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{f.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-4 bg-[var(--color-surface)]">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <h2 className="text-4xl font-black text-[var(--color-text-primary)] mb-4">Set up in 5 minutes</h2>
          </motion.div>
          <div className="space-y-6">
            {[
              { step: '01', title: 'Create your free account', desc: 'Sign up with email or mobile. Verify via OTP. No credit card required.' },
              { step: '02', title: 'Complete your Health Profile', desc: 'Enter blood group, allergies, chronic conditions, and emergency contacts. This powers your Emergency Card.' },
              { step: '03', title: 'Upload your first report', desc: 'Drag and drop any PDF or image. Our AI analyzes it and adds it to your timeline.' },
              { step: '04', title: 'Your passport is ready', desc: 'Access your complete health history anywhere. Share with doctors. Prepare for emergencies.' },
            ].map((item, i) => (
              <motion.div key={item.step} {...fadeUp(i * 0.1)} className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-purple-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow-lg">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-[var(--color-text-primary)] mb-1">{item.title}</h3>
                  <p className="text-[var(--color-text-secondary)]">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <h2 className="text-4xl font-black text-[var(--color-text-primary)] mb-4">Loved by patients and doctors</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} {...fadeUp(i * 0.1)} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-[var(--color-text-primary)] leading-relaxed mb-4 italic">{t.text}</p>
                <div>
                  <p className="font-bold text-[var(--color-text-primary)]">{t.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div {...fadeUp()}>
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--color-primary)] to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-xl">
              <HeartPulse size={36} className="text-white" />
            </div>
            <h2 className="text-4xl font-black text-[var(--color-text-primary)] mb-4">Your health deserves better</h2>
            <p className="text-xl text-[var(--color-text-secondary)] mb-8">Join thousands who have already secured their lifelong health passport.</p>
            <Button size="xl" className="shadow-xl shadow-[var(--color-primary)]/25" rightIcon={<ArrowRight size={20} />} onClick={() => setAuthIntent('register')}>
              Start for Free Today
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[var(--color-primary)] to-purple-600 flex items-center justify-center">
              <HeartPulse size={12} className="text-white" />
            </div>
            <span className="font-black text-[var(--color-text-primary)]">oneHealth</span>
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">© 2026 oneHealth. All rights reserved. Built for Hachverse.</p>
          <div className="flex gap-4 text-sm text-[var(--color-text-muted)]">
            <a href="#" className="hover:text-[var(--color-primary)]">Privacy</a>
            <a href="#" className="hover:text-[var(--color-primary)]">Terms</a>
            <a href="#" className="hover:text-[var(--color-primary)]">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
