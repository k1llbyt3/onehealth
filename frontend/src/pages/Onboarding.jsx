import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import BasicInfo from '../components/onboarding/BasicInfo'
import MedicalBackground from '../components/onboarding/MedicalBackground'
import EmergencyContacts from '../components/onboarding/EmergencyContacts'
import VaccinationRecords from '../components/onboarding/VaccinationRecords'
import { HeartPulse } from 'lucide-react'

const steps = [
  { id: 1, title: 'Basic Info', description: 'Let\'s start with some personal details.' },
  { id: 2, title: 'Medical Background', description: 'Important for emergency situations.' },
  { id: 3, title: 'Emergency Contacts', description: 'Who should we contact in an emergency?' },
  { id: 4, title: 'Vaccinations', description: 'Keep track of your immunizations.' },
]

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1)

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 4))
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-10">
      <div className="w-full max-w-2xl">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 text-primary">
            <HeartPulse size={32} />
            <h1 className="text-2xl font-bold tracking-tight">Profile Setup</h1>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map(step => (
              <div 
                key={step.id} 
                className={`text-xs font-semibold ${currentStep >= step.id ? 'text-primary' : 'text-gray-400'}`}
              >
                Step {step.id}
              </div>
            ))}
          </div>
          <div className="h-2 flex bg-gray-200 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / 4) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <Card className="overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardHeader className="bg-gray-50 border-b border-gray-100">
                <CardTitle>{steps[currentStep - 1].title}</CardTitle>
                <CardDescription>{steps[currentStep - 1].description}</CardDescription>
              </CardHeader>
              
              {currentStep === 1 && <BasicInfo onNext={handleNext} />}
              {currentStep === 2 && <MedicalBackground onNext={handleNext} onBack={handleBack} />}
              {currentStep === 3 && <EmergencyContacts onNext={handleNext} onBack={handleBack} />}
              {currentStep === 4 && <VaccinationRecords onBack={handleBack} />}
            </motion.div>
          </AnimatePresence>
        </Card>
      </div>
    </div>
  )
}
