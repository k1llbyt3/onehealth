import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Phone, AlertCircle, Heart, Pill, ShieldAlert } from 'lucide-react'

export default function EmergencyCardView({ profile }) {
  const innerProfile = profile?.profile || {}
  const patient = {
    name: profile?.name || 'Unknown',
    age: innerProfile.age || '--',
    bloodGroup: innerProfile.blood_group || '--',
    allergies: innerProfile.allergies || [],
    chronicDiseases: innerProfile.chronic_diseases || [],
    medications: innerProfile.current_medications || [],
    contacts: innerProfile.emergency_contacts || []
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 pb-4">
        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
          <ShieldAlert className="w-6 h-6 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <CardTitle className="text-xl">Emergency Medical Card</CardTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400">Digital Health Passport</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{patient.name}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{patient.age !== '--' ? `${patient.age} Years Old • Verified Patient` : 'Unverified Patient'}</p>
          </div>
          <div className="text-center bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 p-3 rounded-xl">
            <div className="text-xl font-bold">{patient.bloodGroup}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider">Blood</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <h4 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100 mb-3 text-sm">
                <AlertCircle size={16} className="text-red-500" /> Known Allergies
              </h4>
              {patient.allergies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {patient.allergies.map(a => (
                    <span key={a} className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-2.5 py-1 rounded-md font-medium text-xs border border-red-200 dark:border-red-800/50">
                      {a}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 dark:text-slate-400 text-sm">No known allergies</p>
              )}
            </div>

            <div>
              <h4 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100 mb-3 text-sm">
                <Heart size={16} className="text-amber-500" /> Chronic Conditions
              </h4>
              {patient.chronicDiseases.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {patient.chronicDiseases.map(d => (
                    <span key={d} className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-2.5 py-1 rounded-md font-medium text-xs border border-amber-200 dark:border-amber-800/50">
                      {d}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 dark:text-slate-400 text-sm">No chronic conditions</p>
              )}
            </div>
          </div>

          <div>
            <h4 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100 mb-3 text-sm">
              <Pill size={16} className="text-sky-500" /> Active Medications
            </h4>
            {patient.medications.length > 0 ? (
              <div className="space-y-2">
                {patient.medications.map((m, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{m.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{m.dosage}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 dark:text-slate-400 text-sm">No active medications</p>
            )}
          </div>
        </div>

        <div>
          <h4 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100 mb-3 text-sm">
            <Phone size={16} className="text-emerald-500" /> Emergency Contacts
          </h4>
          {patient.contacts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {patient.contacts.map((c, idx) => (
                <a 
                  key={idx} 
                  href={`tel:${c.phone}`}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-emerald-400 dark:hover:border-emerald-500 transition-colors"
                >
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{c.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{c.relationship}</div>
                  </div>
                  <div className="text-emerald-600 dark:text-emerald-400">
                    <Phone size={16} />
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 dark:text-slate-400 text-sm">No emergency contacts listed</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
