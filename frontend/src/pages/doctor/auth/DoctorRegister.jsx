import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Stethoscope, ArrowRight, ArrowLeft, Upload, CheckCircle2 } from 'lucide-react'
import { Button, Input } from '../../../components/ui'

const STEPS = [
  { id: 1, title: 'Personal Info' },
  { id: 2, title: 'Professional Details' },
  { id: 3, title: 'Verification' }
]

export function DoctorRegister() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    medicalCouncilNumber: '',
    specialization: '',
    hospital: '',
    experience: '',
  })

  const handleNext = () => setStep(s => Math.min(s + 1, 3))
  const handlePrev = () => setStep(s => Math.max(s - 1, 1))

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      navigate('/doctor/login')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 px-8 py-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 font-bold text-xl mb-4 text-blue-400">
                <Stethoscope className="w-6 h-6" />
                oneHealth Pro
              </div>
              <h1 className="text-3xl font-bold">Join the network</h1>
              <p className="text-slate-400 mt-2">Create your professional doctor account.</p>
            </div>
            
            {/* Stepper */}
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              {STEPS.map((s, i) => (
                <React.Fragment key={s.id}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300
                    ${step === s.id ? 'bg-blue-600 text-white ring-4 ring-blue-600/30' : 
                      step > s.id ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'}`}
                  >
                    {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : s.id}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`w-8 h-1 rounded-full transition-colors duration-300
                      ${step > s.id ? 'bg-emerald-500' : 'bg-slate-800'}`} 
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-8 md:p-12">
          <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
            <AnimatePresence mode="wait">
              
              {/* Step 1: Personal Info */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Personal Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                      <Input name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="Jane" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                      <Input name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Doe" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <Input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="dr.jane@hospital.com" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <Input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                    <Input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+1 (555) 000-0000" />
                  </div>
                </motion.div>
              )}

              {/* Step 2: Professional Details */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Professional Details</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Medical Council Reg. Number</label>
                    <Input name="medicalCouncilNumber" value={formData.medicalCouncilNumber} onChange={handleChange} required placeholder="MCR-12345678" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Specialization</label>
                    <select 
                      name="specialization" 
                      value={formData.specialization} 
                      onChange={handleChange} 
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    >
                      <option value="">Select a specialization</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="General Practice">General Practice</option>
                      <option value="Orthopedics">Orthopedics</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Primary Hospital / Clinic</label>
                    <Input name="hospital" value={formData.hospital} onChange={handleChange} required placeholder="City General Hospital" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Years of Experience</label>
                    <Input type="number" name="experience" value={formData.experience} onChange={handleChange} required placeholder="10" min="0" />
                  </div>
                </motion.div>
              )}

              {/* Step 3: Verification */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Document Verification</h2>
                  
                  <p className="text-slate-600 mb-4">Please upload a scanned copy of your Medical License or Council Registration Certificate.</p>
                  
                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-10 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-blue-500 transition-colors cursor-pointer group">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">Upload Document</h3>
                    <p className="text-slate-500 text-sm mb-4">PDF, JPG, or PNG (Max. 5MB)</p>
                    <Button type="button" variant="outline" className="border-slate-300">Browse Files</Button>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-sm flex gap-3 items-start">
                    <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <p>Your account will remain in "Pending Verification" status until our team reviews your documents. You can still access limited features.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Actions */}
            <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
              {step > 1 ? (
                <Button type="button" variant="ghost" onClick={handlePrev} className="text-slate-600">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
              ) : (
                <div /> // Placeholder for spacing
              )}
              
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
                isLoading={isLoading}
              >
                {step === 3 ? 'Submit Application' : 'Continue'}
                {step < 3 && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </form>
          
          {step === 1 && (
            <div className="mt-8 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/doctor/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in instead
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
