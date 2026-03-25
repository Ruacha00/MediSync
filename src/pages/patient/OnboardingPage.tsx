import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, Download, Calendar, Loader2, Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { medicationDatabase } from '@/data/medications';

const steps = ['Welcome', 'Profile', 'Medications', 'Calendar', 'Complete'];

export function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [fhirLoading, setFhirLoading] = useState(false);
  const [fhirStep, setFhirStep] = useState(0);
  const [fhirDone, setFhirDone] = useState(false);
  const [, setImportedMeds] = useState<string[]>([]);

  const handleFHIRImport = () => {
    setFhirLoading(true);
    setFhirStep(0);
    const steps = [
      () => setFhirStep(1),
      () => setFhirStep(2),
      () => setFhirStep(3),
      () => {
        setFhirLoading(false);
        setFhirDone(true);
        setImportedMeds(['med-001', 'med-002', 'med-003']);
      },
    ];
    steps.forEach((fn, i) => setTimeout(fn, (i + 1) * 1000));
  };

  const fhirMessages = [
    'Connecting to EHR system...',
    'Authenticating...',
    'Fetching prescriptions...',
    '3 medications found!',
  ];

  return (
    <div className="px-5 pt-8 min-h-full flex flex-col">
      {/* Progress */}
      <div className="flex gap-1.5 mb-8">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= step ? 'bg-medical-500' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 0: Welcome */}
        {step === 0 && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-medical-500 flex items-center justify-center mb-6 shadow-lg shadow-medical-500/30">
              <span className="text-white text-3xl font-bold">M</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Welcome to MediSync</h1>
            <p className="text-sm text-gray-500 mb-8 max-w-xs">
              Your AI-powered medication companion that learns your routine and reminds you at the right moment.
            </p>
            <Button className="bg-medical-500 hover:bg-medical-600" onClick={() => setStep(1)}>
              Get Started <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>
        )}

        {/* Step 1: Profile */}
        {step === 1 && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex-1"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-1">Your Profile</h2>
            <p className="text-sm text-gray-500 mb-6">Tell us about yourself</p>
            <div className="space-y-4">
              <div>
                <Label>Full Name</Label>
                <Input defaultValue="Sarah Chen" className="mt-1" />
              </div>
              <div>
                <Label>Age</Label>
                <Input type="number" defaultValue="52" className="mt-1" />
              </div>
              <div>
                <Label>Conditions</Label>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {['Hypertension', 'Type 2 Diabetes', 'Asthma', 'Atrial Fibrillation'].map((c) => (
                    <Badge
                      key={c}
                      variant={['Hypertension', 'Type 2 Diabetes'].includes(c) ? 'default' : 'outline'}
                      className={
                        ['Hypertension', 'Type 2 Diabetes'].includes(c)
                          ? 'bg-medical-500 cursor-pointer'
                          : 'cursor-pointer hover:bg-gray-100'
                      }
                    >
                      {c}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <Button className="w-full mt-8 bg-medical-500 hover:bg-medical-600" onClick={() => setStep(2)}>
              Continue <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>
        )}

        {/* Step 2: Medications */}
        {step === 2 && (
          <motion.div
            key="meds"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex-1"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-1">Your Medications</h2>
            <p className="text-sm text-gray-500 mb-6">Add your medications or import from EHR</p>

            <div className="flex gap-3 mb-6">
              <Button variant="outline" className="flex-1 h-12" onClick={() => setFhirDone(true)}>
                <Pill className="w-4 h-4 mr-2" /> Add Manually
              </Button>
              <Button className="flex-1 h-12 bg-medical-500 hover:bg-medical-600" onClick={handleFHIRImport} disabled={fhirLoading || fhirDone}>
                <Download className="w-4 h-4 mr-2" /> Import from EHR
              </Button>
            </div>

            {/* FHIR loading */}
            {fhirLoading && (
              <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2">
                {fhirMessages.slice(0, fhirStep + 1).map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-sm"
                  >
                    {i < fhirStep ? (
                      <Check className="w-4 h-4 text-health-500" />
                    ) : (
                      <Loader2 className="w-4 h-4 text-medical-500 animate-spin" />
                    )}
                    <span className={i < fhirStep ? 'text-gray-500' : 'text-gray-700'}>{msg}</span>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Imported medications */}
            {fhirDone && (
              <div className="space-y-2">
                {medicationDatabase.slice(0, 3).map((med, i) => (
                  <motion.div
                    key={med.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-3"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${med.color}15` }}>
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: med.color }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{med.name}</p>
                      <p className="text-xs text-gray-400">{med.dosage} &middot; {med.frequency}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      {med.source === 'fhir' ? 'EHR' : 'Manual'}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            )}

            <Button
              className="w-full mt-6 bg-medical-500 hover:bg-medical-600"
              onClick={() => setStep(3)}
              disabled={!fhirDone}
            >
              Continue <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>
        )}

        {/* Step 3: Calendar */}
        {step === 3 && (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-5">
              <Calendar className="w-8 h-8 text-amber-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Connect Calendar</h2>
            <p className="text-sm text-gray-500 mb-6 max-w-xs">
              Allow MediSync to read your calendar to avoid reminding during busy times and send departure reminders.
            </p>
            <Button className="bg-medical-500 hover:bg-medical-600 mb-3" onClick={() => setStep(4)}>
              <Calendar className="w-4 h-4 mr-2" /> Allow Calendar Access
            </Button>
            <button className="text-xs text-gray-400 hover:text-gray-600" onClick={() => setStep(4)}>
              Skip for now
            </button>
          </motion.div>
        )}

        {/* Step 4: Complete */}
        {step === 4 && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="w-20 h-20 rounded-full bg-health-500 flex items-center justify-center mb-6"
            >
              <Check className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">You're All Set!</h2>
            <p className="text-sm text-gray-500 mb-8 max-w-xs">
              MediSync will learn your routine and send smart reminders at the best times for you.
            </p>
            <Button className="bg-medical-500 hover:bg-medical-600" onClick={() => navigate('/patient/home')}>
              Start Using MediSync <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
