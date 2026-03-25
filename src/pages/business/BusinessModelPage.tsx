import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Building2, Shield, Check, X, ArrowRight, Heart, DollarSign, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const competitors = [
  { feature: 'AI Personalized Reminders', medisync: true, medisafe: false, mytherapy: false, adheretech: false },
  { feature: 'Behavior Learning', medisync: true, medisafe: false, mytherapy: false, adheretech: false },
  { feature: 'Missed Dose Smart Rescheduling', medisync: true, medisafe: false, mytherapy: false, adheretech: false },
  { feature: 'Calendar Integration', medisync: true, medisafe: false, mytherapy: false, adheretech: false },
  { feature: 'Departure Reminders', medisync: true, medisafe: false, mytherapy: false, adheretech: false },
  { feature: 'EHR Integration (FHIR)', medisync: true, medisafe: 'limited', mytherapy: false, adheretech: 'limited' },
  { feature: 'Care Manager Dashboard', medisync: true, medisafe: true, mytherapy: false, adheretech: true },
  { feature: 'Hardware Required', medisync: false, medisafe: false, mytherapy: false, adheretech: true },
  { feature: 'Low Cost Barrier', medisync: true, medisafe: true, mytherapy: true, adheretech: false },
];

export function BusinessModelPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Model</h1>
            <p className="text-gray-500">Three-channel revenue structure for sustainable growth</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Core value proposition */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-medical-500 to-medical-600 rounded-2xl p-8 mb-8 text-white"
        >
          <h2 className="text-xl font-bold mb-3">Core Value Proposition</h2>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              <span>Better Adherence</span>
            </div>
            <ArrowRight className="w-4 h-4 text-medical-200" />
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5" />
              <span>Fewer Hospitalizations</span>
            </div>
            <ArrowRight className="w-4 h-4 text-medical-200" />
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              <span>Lower Healthcare Costs</span>
            </div>
          </div>
          <p className="text-sm text-medical-100 mt-4">
            MediSync sells <span className="font-semibold text-white">outcomes</span>, not data.
            Improved medication adherence generates measurable cost savings for the entire healthcare system.
          </p>
        </motion.div>

        {/* Three channels */}
        <h2 className="text-lg font-bold text-gray-900 mb-4">Revenue Channels</h2>
        <div className="grid grid-cols-3 gap-5 mb-10">
          {[
            {
              icon: User,
              title: 'B2C: Patient Subscription',
              price: '$5.99/mo',
              color: 'medical',
              features: [
                'Free basic reminders',
                'AI adaptive timing (premium)',
                'Calendar integration (premium)',
                'Adherence analytics (premium)',
              ],
              description: 'Users download from App Store. Basic features free, AI features require subscription.',
            },
            {
              icon: Building2,
              title: 'B2B: Hospital Procurement',
              price: 'Per-patient SaaS',
              color: 'health',
              features: [
                'Prescribed via EHR workflow',
                'Full features for patients',
                'Care manager dashboard',
                'FHIR bidirectional sync',
              ],
              description: 'Doctors "prescribe" MediSync like a digital therapeutic. Hospital pays per-patient fee.',
            },
            {
              icon: Shield,
              title: 'B2B: Insurance Purchase',
              price: 'Bulk license',
              color: 'amber',
              features: [
                'Member benefit program',
                'De-identified ROI reports',
                'Population health metrics',
                'Reduced claims cost',
              ],
              description: 'Insurers buy bulk licenses for members. Value: reduced hospitalizations and claims costs.',
            },
          ].map(({ icon: Icon, title, price, color, features, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow"
            >
              <div className={`w-12 h-12 rounded-xl bg-${color}-50 flex items-center justify-center mb-4`}
                style={{ backgroundColor: color === 'medical' ? '#EFF6FF' : color === 'health' ? '#ECFDF5' : '#FFFBEB' }}>
                <Icon className="w-6 h-6" style={{ color: color === 'medical' ? '#2563EB' : color === 'health' ? '#059669' : '#D97706' }} />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">{title}</h3>
              <Badge variant="outline" className="mb-3 text-xs">{price}</Badge>
              <p className="text-xs text-gray-500 mb-4">{description}</p>
              <ul className="space-y-2">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-gray-600">
                    <Check className="w-3.5 h-3.5 text-health-500 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Competitive comparison */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-8"
        >
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Competitive Comparison</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left p-4 text-xs font-semibold text-gray-600">Feature</th>
                <th className="text-center p-4 text-xs font-bold text-medical-600">MediSync</th>
                <th className="text-center p-4 text-xs font-medium text-gray-500">Medisafe</th>
                <th className="text-center p-4 text-xs font-medium text-gray-500">MyTherapy</th>
                <th className="text-center p-4 text-xs font-medium text-gray-500">AdhereTech</th>
              </tr>
            </thead>
            <tbody>
              {competitors.map((row) => (
                <tr key={row.feature} className="border-b border-gray-50">
                  <td className="p-4 text-sm text-gray-700">{row.feature}</td>
                  {(['medisync', 'medisafe', 'mytherapy', 'adheretech'] as const).map((key) => {
                    const val = row[key];
                    return (
                      <td key={key} className="p-4 text-center">
                        {val === true ? (
                          <Check className={`w-5 h-5 mx-auto ${key === 'medisync' ? 'text-medical-500' : 'text-health-500'}`} />
                        ) : val === false ? (
                          <X className="w-5 h-5 mx-auto text-gray-300" />
                        ) : (
                          <span className="text-xs text-amber-500">{val}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Go-to-market */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-50 rounded-2xl border border-gray-100 p-6"
        >
          <h3 className="text-base font-bold text-gray-900 mb-3">Go-to-Market Strategy</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <Badge className="bg-medical-100 text-medical-700 mb-2">Phase 1</Badge>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Launch</h4>
              <p className="text-xs text-gray-500">Patient self-subscription + direct hospital sales (no insurance reimbursement needed)</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <Badge className="bg-health-100 text-health-700 mb-2">Phase 2</Badge>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Scale</h4>
              <p className="text-xs text-gray-500">Insurance partnerships + population health programs. Build evidence base with pilot study data.</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <Badge className="bg-amber-100 text-amber-700 mb-2">Phase 3</Badge>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Expand</h4>
              <p className="text-xs text-gray-500">FDA certification / CPT code for insurance reimbursement. Full digital therapeutic pathway.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
