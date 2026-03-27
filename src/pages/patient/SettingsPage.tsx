import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Link2, Bell, Shield, ChevronRight, X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/store/useAppStore';
import { PhoneFramePortal } from '@/lib/phoneFramePortal';

export function SettingsPage() {
  const {
    currentPatient,
    calendarConnected,
    pushNotificationsEnabled,
    departureRemindersEnabled,
    aiTimingEnabled,
    setPushNotificationsEnabled,
    setDepartureRemindersEnabled,
    setAiTimingEnabled,
  } = useAppStore();

  const [policyDialog, setPolicyDialog] = useState<'privacy' | 'hipaa' | null>(null);

  return (
    <div className="px-5 pt-6">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Settings</h1>

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 shadow-sm"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-medical-100 flex items-center justify-center">
            <span className="text-medical-600 font-bold text-lg">{currentPatient.avatar}</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{currentPatient.name}</h3>
            <p className="text-xs text-gray-400">Age {currentPatient.age} &middot; {currentPatient.conditions.join(', ')}</p>
          </div>
        </div>
      </motion.div>

      {/* Connections */}
      <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">Connections</h2>
      <div className="bg-white rounded-2xl border border-gray-100 mb-6 overflow-hidden">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-amber-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Calendar</p>
              <p className="text-xs text-gray-400">Used for departure reminders</p>
            </div>
          </div>
          <Badge className={calendarConnected ? 'bg-health-500' : 'bg-gray-400'}>
            {calendarConnected ? 'Connected' : 'Disconnected'}
          </Badge>
        </div>
        <Separator />
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Link2 className="w-5 h-5 text-medical-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">EHR (FHIR)</p>
              <p className="text-xs text-gray-400">City General Hospital</p>
            </div>
          </div>
          <Badge className="bg-health-500">Connected</Badge>
        </div>
      </div>

      {/* Preferences */}
      <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">Preferences</h2>
      <div className="bg-white rounded-2xl border border-gray-100 mb-6 overflow-hidden">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Push Notifications</p>
              {!pushNotificationsEnabled && (
                <p className="text-[10px] text-red-400">Reminders will not appear</p>
              )}
            </div>
          </div>
          <Switch
            checked={pushNotificationsEnabled}
            onCheckedChange={setPushNotificationsEnabled}
          />
        </div>
        <Separator />
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Departure Reminders</p>
              {!departureRemindersEnabled && (
                <p className="text-[10px] text-amber-400">Calendar-based reminders off</p>
              )}
            </div>
          </div>
          <Switch
            checked={departureRemindersEnabled}
            onCheckedChange={setDepartureRemindersEnabled}
          />
        </div>
        <Separator />
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">AI Adaptive Timing</p>
              {!aiTimingEnabled && (
                <p className="text-[10px] text-gray-400">Using fixed prescribed times</p>
              )}
            </div>
          </div>
          <Switch
            checked={aiTimingEnabled}
            onCheckedChange={setAiTimingEnabled}
          />
        </div>
      </div>

      {/* About */}
      <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">About</h2>
      <div className="bg-white rounded-2xl border border-gray-100 mb-6 overflow-hidden">
        <button
          className="flex items-center justify-between p-4 w-full text-left hover:bg-gray-50 transition-colors"
          onClick={() => setPolicyDialog('privacy')}
        >
          <p className="text-sm font-medium text-gray-900">Privacy Policy</p>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
        <Separator />
        <button
          className="flex items-center justify-between p-4 w-full text-left hover:bg-gray-50 transition-colors"
          onClick={() => setPolicyDialog('hipaa')}
        >
          <p className="text-sm font-medium text-gray-900">HIPAA Compliance</p>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
        <Separator />
        <div className="flex items-center justify-between p-4">
          <p className="text-sm font-medium text-gray-900">Version</p>
          <p className="text-sm text-gray-400">1.0.0 (Prototype)</p>
        </div>
      </div>

      {/* Policy dialog */}
      <PhoneFramePortal>
        <AnimatePresence>
          {policyDialog && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/30 z-[60]"
                onClick={() => setPolicyDialog(null)}
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="absolute bottom-0 left-0 right-0 z-[70] bg-white rounded-t-3xl max-h-[70%] overflow-y-auto"
              >
                <div className="flex justify-center pt-3 pb-1">
                  <div className="w-10 h-1 rounded-full bg-gray-300" />
                </div>
                <div className="px-5 pb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">
                      {policyDialog === 'privacy' ? 'Privacy Policy' : 'HIPAA Compliance'}
                    </h2>
                    <button
                      onClick={() => setPolicyDialog(null)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                  {policyDialog === 'privacy' ? (
                    <div className="space-y-3 text-xs text-gray-600 leading-relaxed">
                      <p className="font-semibold text-gray-900">MediSync Privacy Policy</p>
                      <p>MediSync collects medication schedules, adherence data, and calendar information solely to provide personalized medication reminders.</p>
                      <p><strong>Data Collection:</strong> We collect medication names, dosages, prescribed times, and your response history (taken, skipped, snoozed) to optimize reminder timing.</p>
                      <p><strong>Calendar Access:</strong> Calendar data is read-only and used exclusively for departure reminders. Event content is never stored on our servers.</p>
                      <p><strong>Data Sharing:</strong> Individual health data is never shared with insurance companies. Only aggregated, de-identified population metrics are shared under strict BAA agreements.</p>
                      <p><strong>Data Retention:</strong> You can request full data deletion at any time. Adherence history is retained for 12 months unless otherwise requested.</p>
                      <p><strong>Encryption:</strong> All data is encrypted at rest (AES-256) and in transit (TLS 1.3).</p>
                    </div>
                  ) : (
                    <div className="space-y-3 text-xs text-gray-600 leading-relaxed">
                      <p className="font-semibold text-gray-900">HIPAA Compliance Statement</p>
                      <p>MediSync is designed to comply with the Health Insurance Portability and Accountability Act (HIPAA).</p>
                      <p><strong>PHI Protection:</strong> All Protected Health Information is handled according to HIPAA Privacy and Security Rules. Access is limited to authorized personnel only.</p>
                      <p><strong>BAA Agreements:</strong> Business Associate Agreements are in place with all EHR partners and cloud infrastructure providers.</p>
                      <p><strong>Audit Trail:</strong> All access to patient data is logged with timestamps and user identification for compliance auditing.</p>
                      <p><strong>Data Firewall:</strong> Insurance company integrations use a data firewall that strictly prevents individual PHI from reaching insurance partners. Only aggregated population-level metrics pass through.</p>
                      <p><strong>Breach Protocol:</strong> In the event of a data breach, affected patients and HHS will be notified within 60 days as required by the HITECH Act.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </PhoneFramePortal>
    </div>
  );
}
