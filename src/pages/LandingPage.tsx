import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Smartphone, Monitor, Heart, Brain, Shield } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 via-white to-health-50 flex flex-col">
      {/* Header */}
      <header className="pt-12 pb-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-medical-500 flex items-center justify-center shadow-lg shadow-medical-500/30">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">MediSync</h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg text-gray-500 max-w-md mx-auto"
        >
          Behavior-Adaptive Medication Reminder System
        </motion.p>
      </header>

      {/* Feature badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="flex justify-center gap-3 mb-12 flex-wrap px-4"
      >
        {[
          { icon: Brain, label: 'AI-Powered' },
          { icon: Heart, label: 'Patient-Centered' },
          { icon: Shield, label: 'HIPAA Compliant' },
        ].map(({ icon: Icon, label }) => (
          <span
            key={label}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-xs font-medium text-gray-600 shadow-sm border border-gray-100"
          >
            <Icon className="w-3.5 h-3.5 text-medical-500" />
            {label}
          </span>
        ))}
      </motion.div>

      {/* Cards */}
      <div className="flex-1 flex items-start justify-center px-6 pb-12">
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Link
              to="/patient/home"
              className="block group bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-medical-200 transition-all duration-300 h-full"
            >
              <div className="w-14 h-14 rounded-2xl bg-medical-50 flex items-center justify-center mb-5 group-hover:bg-medical-100 transition-colors">
                <Smartphone className="w-7 h-7 text-medical-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Patient App</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                AI-powered medication reminders, smart rescheduling, and adherence tracking in a
                mobile-first experience.
              </p>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
          >
            <Link
              to="/dashboard"
              className="block group bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-health-200 transition-all duration-300 h-full"
            >
              <div className="w-14 h-14 rounded-2xl bg-health-50 flex items-center justify-center mb-5 group-hover:bg-health-100 transition-colors">
                <Monitor className="w-7 h-7 text-health-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Care Dashboard</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Care manager overview with patient monitoring, risk alerts, population reports, and
                EHR integration status.
              </p>
            </Link>
          </motion.div>

        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-gray-400">
        MediSync Prototype — Group 9 | Clinical Informatics
      </footer>
    </div>
  );
}
