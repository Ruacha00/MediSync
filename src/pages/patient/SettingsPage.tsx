import { motion } from 'framer-motion';
import { Calendar, Link2, Bell, Shield, ChevronRight } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/store/appStore';

export function SettingsPage() {
  const { currentPatient, calendarConnected } = useAppStore();

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
            <p className="text-sm font-medium text-gray-900">Push Notifications</p>
          </div>
          <Switch defaultChecked />
        </div>
        <Separator />
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-gray-500" />
            <p className="text-sm font-medium text-gray-900">Departure Reminders</p>
          </div>
          <Switch defaultChecked />
        </div>
        <Separator />
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-gray-500" />
            <p className="text-sm font-medium text-gray-900">AI Adaptive Timing</p>
          </div>
          <Switch defaultChecked />
        </div>
      </div>

      {/* About */}
      <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">About</h2>
      <div className="bg-white rounded-2xl border border-gray-100 mb-6 overflow-hidden">
        <button className="flex items-center justify-between p-4 w-full text-left hover:bg-gray-50 transition-colors">
          <p className="text-sm font-medium text-gray-900">Privacy Policy</p>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
        <Separator />
        <button className="flex items-center justify-between p-4 w-full text-left hover:bg-gray-50 transition-colors">
          <p className="text-sm font-medium text-gray-900">HIPAA Compliance</p>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
        <Separator />
        <div className="flex items-center justify-between p-4">
          <p className="text-sm font-medium text-gray-900">Version</p>
          <p className="text-sm text-gray-400">1.0.0 (Prototype)</p>
        </div>
      </div>
    </div>
  );
}
