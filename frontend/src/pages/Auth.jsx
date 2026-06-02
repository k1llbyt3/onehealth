import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HeartPulse, Mail, Phone, Lock, User, ArrowRight, Check } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuthStore } from '../store/authStore'

function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-primary)] via-purple-500 to-[var(--color-accent)]" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-purple-600 flex items-center justify-center shadow-lg">
              <HeartPulse size={24} className="text-white" />
            </div>
            <span className="text-2xl font-black text-[var(--color-text-primary)]">oneHealth</span>
          </Link>
        </div>

        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl p-8">
          <h1 className="text-2xl font-black text-[var(--color-text-primary)] mb-1">{title}</h1>
          {subtitle && <p className="text-[var(--color-text-secondary)] text-sm mb-6">{subtitle}</p>}
          {children}
        </div>
      </motion.div>
    </div>
  )
}

export function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const setUser = useAuthStore(s => s.setUser)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setUser({ uid: 'mock-uid', email: form.email, name: 'Priya Sharma' }, 'mock-token', 'patient')
    navigate('/dashboard')
  }

  return (
    <AuthLayout title="Welcome back 👋" subtitle="Sign in to access your Health Passport.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="login-email" label="Email or Mobile" required
          placeholder="priya@example.com or +91..."
          leftIcon={<Mail size={16} />}
          value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        />
        <Input
          id="login-password" label="Password" type="password" required
          placeholder="Your password"
          value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
        />
        <div className="flex justify-end">
          <Link to="#" className="text-sm text-[var(--color-primary)] hover:underline font-medium">Forgot password?</Link>
        </div>
        <Button type="submit" isLoading={loading} className="w-full h-11 mt-2" rightIcon={<ArrowRight size={16} />}>
          Sign In
        </Button>
        <p className="text-center text-sm text-[var(--color-text-muted)]">
          Don't have an account?{' '}
          <Link to="/register" className="text-[var(--color-primary)] font-semibold hover:underline">Create Account</Link>
        </p>
      </form>
    </AuthLayout>
  )
}

export function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    navigate('/onboarding')
  }

  return (
    <AuthLayout title="Create your account" subtitle="Start your lifelong health journey — free forever.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input id="reg-name" label="Full Name" required placeholder="Priya Sharma" leftIcon={<User size={16} />} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        <Input id="reg-email" label="Email Address" type="email" required placeholder="priya@example.com" leftIcon={<Mail size={16} />} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        <Input id="reg-phone" label="Mobile Number" type="tel" required placeholder="+91 98765 43210" leftIcon={<Phone size={16} />} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
        <Input id="reg-password" label="Password" type="password" required placeholder="Min 8 characters" leftIcon={<Lock size={16} />} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} hint="At least 8 characters" />

        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" required className="mt-1 accent-[var(--color-primary)]" />
          <span className="text-xs text-[var(--color-text-muted)]">
            I agree to the <a href="#" className="text-[var(--color-primary)] hover:underline">Terms of Service</a> and{' '}
            <a href="#" className="text-[var(--color-primary)] hover:underline">Privacy Policy</a>
          </span>
        </label>

        <Button type="submit" isLoading={loading} className="w-full h-11 mt-2" rightIcon={<ArrowRight size={16} />}>
          Create Account
        </Button>
        <p className="text-center text-sm text-[var(--color-text-muted)]">
          Already have an account?{' '}
          <Link to="/login" className="text-[var(--color-primary)] font-semibold hover:underline">Sign In</Link>
        </p>
      </form>
    </AuthLayout>
  )
}

export function OTP() {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(30)
  const navigate = useNavigate()

  const handleChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return
    const next = [...code]
    next[idx] = val
    setCode(next)
    if (val && idx < 5) document.getElementById(`otp-${idx + 1}`)?.focus()
  }

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !code[idx] && idx > 0) document.getElementById(`otp-${idx - 1}`)?.focus()
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    navigate('/onboarding')
  }

  return (
    <AuthLayout title="Verify your number" subtitle="We sent a 6-digit code to your mobile. Enter it below.">
      <form onSubmit={handleVerify} className="space-y-6">
        <div className="flex gap-2 justify-center">
          {code.map((c, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={c}
              onChange={e => handleChange(e.target.value, i)}
              onKeyDown={e => handleKeyDown(e, i)}
              className="w-12 h-14 text-center text-2xl font-black rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
            />
          ))}
        </div>
        <Button type="submit" isLoading={loading} className="w-full h-11" disabled={code.join('').length < 6}>
          Verify & Continue
        </Button>
        <p className="text-center text-sm text-[var(--color-text-muted)]">
          Didn't receive a code?{' '}
          <button type="button" className="text-[var(--color-primary)] font-semibold hover:underline">Resend (30s)</button>
        </p>
      </form>
    </AuthLayout>
  )
}
