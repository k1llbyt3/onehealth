import { create } from 'zustand';

// Store for doctor-specific UI and state (Dashboard, search, etc.)
export const useDoctorStore = create((set) => ({
  patients: [],
  appointments: [],
  stats: {
    totalPatients: 0,
    todaysConsultations: 0,
    pendingFollowUps: 0,
  },
  isLoading: false,

  setPatients: (patients) => set({ patients }),
  setAppointments: (appointments) => set({ appointments }),
  setStats: (stats) => set({ stats }),
  setLoading: (isLoading) => set({ isLoading }),
}));

// Store for the active consultation session
export const useConsultationStore = create((set, get) => ({
  activePatientId: null,
  diagnosis: '',
  severity: 'moderate',
  symptoms: [],
  treatmentPlan: '',
  doctorNotes: '',
  prescriptions: [],
  aiSummary: null,

  setActivePatient: (id) => set({ activePatientId: id }),
  
  updateDiagnosisField: (field, value) => set({ [field]: value }),
  
  addSymptom: (symptom) => set({ symptoms: [...get().symptoms, symptom] }),
  removeSymptom: (symptom) => set({ symptoms: get().symptoms.filter(s => s !== symptom) }),

  addPrescription: (med) => set({ prescriptions: [...get().prescriptions, med] }),
  removePrescription: (index) => set({ prescriptions: get().prescriptions.filter((_, i) => i !== index) }),
  
  setAiSummary: (summary) => set({ aiSummary: summary }),

  resetConsultation: () => set({
    activePatientId: null,
    diagnosis: '',
    severity: 'moderate',
    symptoms: [],
    treatmentPlan: '',
    doctorNotes: '',
    prescriptions: [],
    aiSummary: null,
  })
}));
