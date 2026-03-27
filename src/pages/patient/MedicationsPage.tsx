import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Clock, Shield, X, Check, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/store/useAppStore';
import { PhoneFramePortal } from '@/lib/phoneFramePortal';
import { medicationDatabase } from '@/data/medications';
import type { Medication } from '@/types';

const categoryOptions = [
  'Antihypertensive',
  'Antidiabetic',
  'Anticoagulant',
  'Statin',
  'ACE Inhibitor',
  'Asthma Controller',
  'Antibiotic',
  'Analgesic',
  'Other',
];

const frequencyOptions = ['Once daily', 'Twice daily', 'Three times daily', 'As needed'];
const timeOptions: { label: string; value: Medication['prescribedTime'] }[] = [
  { label: 'Morning', value: 'morning' },
  { label: 'Evening', value: 'evening' },
  { label: 'Twice daily', value: 'twice_daily' },
];

const colorPalette = ['#3B82F6', '#10B981', '#EF4444', '#8B5CF6', '#0EA5E9', '#F97316', '#EC4899', '#14B8A6'];

let medCounter = 100;

export function MedicationsPage() {
  const { currentPatient, addMedication } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncDone, setSyncDone] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [category, setCategory] = useState('');
  const [frequency, setFrequency] = useState('Once daily');
  const [prescribedTime, setPrescribedTime] = useState<Medication['prescribedTime']>('morning');
  const [safetyWindow, setSafetyWindow] = useState('4');

  const resetForm = () => {
    setName('');
    setDosage('');
    setCategory('');
    setFrequency('Once daily');
    setPrescribedTime('morning');
    setSafetyWindow('4');
    setSaved(false);
  };

  const handleSubmit = () => {
    if (!name.trim() || !dosage.trim()) return;

    setSaving(true);
    // Simulate a brief save delay
    setTimeout(() => {
      const newMed: Medication = {
        id: `med-manual-${++medCounter}`,
        name: name.trim(),
        dosage: dosage.trim(),
        frequency,
        prescribedTime,
        safetyWindowHours: parseInt(safetyWindow) || 4,
        category: category || 'Other',
        source: 'manual',
        color: colorPalette[currentPatient.medications.length % colorPalette.length],
      };
      addMedication(newMed);
      setSaving(false);
      setSaved(true);
      setTimeout(() => {
        setShowForm(false);
        resetForm();
      }, 800);
    }, 600);
  };

  return (
    <div className="px-5 pt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Medications</h1>
          <p className="text-xs text-gray-400">{currentPatient.medications.length} active medications</p>
        </div>
        <Button
          size="sm"
          className="bg-medical-500 hover:bg-medical-600 h-8"
          onClick={() => setShowForm(true)}
        >
          <Plus className="w-3.5 h-3.5 mr-1" /> Add
        </Button>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {currentPatient.medications.map((med, i) => (
            <motion.div
              key={med.id}
              layout
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
        </AnimatePresence>
      </div>

      {/* FHIR sync button */}
      <div className="mt-6 mb-6">
        <Button
          variant="outline"
          className="w-full h-11 border-dashed border-gray-300 text-gray-400 hover:text-medical-500 hover:border-medical-300"
          disabled={syncing || syncDone}
          onClick={() => {
            setSyncing(true);
            setTimeout(() => {
              // Find FHIR meds not already in patient's list
              const existingIds = new Set(currentPatient.medications.map((m) => m.id));
              const newFhirMeds = medicationDatabase.filter((m) => m.source === 'fhir' && !existingIds.has(m.id));
              newFhirMeds.forEach((med) => addMedication(med));
              setSyncing(false);
              setSyncDone(true);
            }, 1200);
          }}
        >
          {syncing ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
          ) : syncDone ? (
            <><Check className="w-4 h-4 mr-2" /> Synced from EHR</>
          ) : (
            <><RefreshCw className="w-4 h-4 mr-2" /> Sync from EHR (FHIR)</>
          )}
        </Button>
      </div>

      {/* Add Medication bottom sheet — portaled into phone frame */}
      <PhoneFramePortal>
        <AnimatePresence>
          {showForm && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/30 z-[60]"
                onClick={() => { setShowForm(false); resetForm(); }}
              />
              {/* Sheet */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="absolute bottom-0 left-0 right-0 z-[70] bg-white rounded-t-3xl max-h-[85%] overflow-y-auto"
              >
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-1">
                  <div className="w-10 h-1 rounded-full bg-gray-300" />
                </div>

                <div className="px-5 pb-8">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold text-gray-900">Add Medication</h2>
                    <button
                      onClick={() => { setShowForm(false); resetForm(); }}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>

                  {/* Form */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs font-medium text-gray-600">Medication Name *</Label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Aspirin"
                        className="mt-1 h-10"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs font-medium text-gray-600">Dosage *</Label>
                        <Input
                          value={dosage}
                          onChange={(e) => setDosage(e.target.value)}
                          placeholder="e.g. 100mg"
                          className="mt-1 h-10"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-gray-600">Safety Window (h)</Label>
                        <Input
                          type="number"
                          value={safetyWindow}
                          onChange={(e) => setSafetyWindow(e.target.value)}
                          min={1}
                          max={24}
                          className="mt-1 h-10"
                        />
                      </div>
                    </div>

                    {/* Category chips */}
                    <div>
                      <Label className="text-xs font-medium text-gray-600">Category</Label>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {categoryOptions.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                              category === cat
                                ? 'bg-medical-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Frequency chips */}
                    <div>
                      <Label className="text-xs font-medium text-gray-600">Frequency</Label>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {frequencyOptions.map((f) => (
                          <button
                            key={f}
                            onClick={() => setFrequency(f)}
                            className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                              frequency === f
                                ? 'bg-medical-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Prescribed time chips */}
                    <div>
                      <Label className="text-xs font-medium text-gray-600">Prescribed Time</Label>
                      <div className="flex gap-2 mt-2">
                        {timeOptions.map((t) => (
                          <button
                            key={t.value}
                            onClick={() => setPrescribedTime(t.value)}
                            className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors ${
                              prescribedTime === t.value
                                ? 'bg-medical-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Submit */}
                    <Button
                      className="w-full h-11 bg-medical-500 hover:bg-medical-600 mt-2"
                      disabled={!name.trim() || !dosage.trim() || saving}
                      onClick={handleSubmit}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                        </>
                      ) : saved ? (
                        <>
                          <Check className="w-4 h-4 mr-2" /> Added!
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" /> Add Medication
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </PhoneFramePortal>
    </div>
  );
}
