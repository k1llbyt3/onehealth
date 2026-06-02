import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Mock patient data aligned with TRD Firestore schema
const MOCK_PROFILE = {
  uid: 'mock-uid-001',
  name: 'Priya Sharma',
  email: 'priya@example.com',
  phone: '+91 98765 43210',
  role: 'patient',
  profile: {
    dob: '1990-08-15',
    gender: 'female',
    blood_group: 'O+',
    height_cm: 163,
    weight_kg: 58,
    photo_url: null,
    allergies: ['Penicillin', 'Shellfish'],
    chronic_diseases: ['Asthma', 'Mild Hypertension'],
    medical_notes: 'Takes Salbutamol inhaler as needed.',
    emergency_contacts: [
      { name: 'Rahul Sharma', relationship: 'Spouse', phone: '+91 98765 43211' },
      { name: 'Dr. Arjun Nair', relationship: 'Family Doctor', phone: '+91 98765 00001' },
    ],
  },
  settings: {
    notifications_enabled: true,
    reminder_times: { morning: '08:00', afternoon: '13:00', night: '21:00' },
    theme: 'system',
    language: 'en',
  },
}

const MOCK_HEALTH_METRICS = {
  health_score: 74,
  reports_count: 12,
  prescriptions_count: 5,
  consultations_count: 8,
  vaccinations_count: 4,
}

export const useUserStore = create(
  persist(
    (set, get) => ({
      profile: MOCK_PROFILE,
      healthMetrics: MOCK_HEALTH_METRICS,
      isProfileLoading: false,

      setProfile: (profile) => set({ profile }),
      setHealthMetrics: (metrics) => set({ healthMetrics: metrics }),
      updateProfile: (partial) => set((s) => ({
        profile: { ...s.profile, ...partial }
      })),
      setProfileLoading: (v) => set({ isProfileLoading: v }),
    }),
    { name: 'onehealth-user', partialize: (s) => ({ profile: s.profile }) }
  )
)
