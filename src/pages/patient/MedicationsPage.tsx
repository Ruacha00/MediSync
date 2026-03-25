import { motion } from 'framer-motion';
import { Plus, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/appStore';

export function MedicationsPage() {
  const { currentPatient } = useAppStore();

  return (
    <div className="px-5 pt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Medications</h1>
          <p className="text-xs text-gray-400">{currentPatient.medications.length} active medications</p>
        </div>
        <Button size="sm" className="bg-medical-500 hover:bg-medical-600 h-8">
          <Plus className="w-3.5 h-3.5 mr-1" /> Add
        </Button>
      </div>

      <div className="space-y-3">
        {currentPatient.medications.map((med, i) => (
          <motion.div
            key={med.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${med.color}15` }}
              >
                <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: med.color }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-sm text-gray-900">{med.name}</h3>
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${
                      med.source === 'fhir'
                        ? 'text-medical-600 border-medical-200 bg-medical-50'
                        : 'text-gray-500'
                    }`}
                  >
                    {med.source === 'fhir' ? 'EHR Imported' : 'Manual'}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  {med.dosage} &middot; {med.frequency} &middot; {med.category}
                </p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-[11px] text-gray-400">
                      {med.prescribedTime === 'morning' ? 'Morning' : med.prescribedTime === 'evening' ? 'Evening' : 'Morning & Evening'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-gray-400" />
                    <span className="text-[11px] text-gray-400">
                      {med.safetyWindowHours}h catch-up window
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* FHIR sync button */}
      <div className="mt-6">
        <Button variant="outline" className="w-full h-11 border-dashed border-gray-300 text-gray-400 hover:text-medical-500 hover:border-medical-300">
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 12h8m8 0h-8m0 0V4m0 8v8" />
          </svg>
          Sync from EHR (FHIR)
        </Button>
      </div>
    </div>
  );
}
