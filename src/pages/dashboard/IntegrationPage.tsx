import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, RefreshCw, Cable, Clock, ArrowRight, Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const initialConnections = [
  {
    name: 'City General Hospital EHR',
    type: 'Epic (FHIR R4)',
    status: 'connected' as const,
    lastSync: '5 min ago',
    patients: 5,
  },
  {
    name: 'University Medical Center',
    type: 'Cerner (FHIR R4)',
    status: 'connected' as const,
    lastSync: '12 min ago',
    patients: 2,
  },
  {
    name: 'Community Health Center',
    type: 'Allscripts (FHIR STU3)',
    status: 'disconnected' as const,
    lastSync: 'Never',
    patients: 0,
  },
];

const apiLog = [
  { time: '10:32 AM', method: 'GET', endpoint: '/Patient/p-001/$everything', status: 200, duration: '245ms' },
  { time: '10:32 AM', method: 'GET', endpoint: '/MedicationRequest?patient=p-001', status: 200, duration: '189ms' },
  { time: '10:31 AM', method: 'PUT', endpoint: '/Observation (Adherence)', status: 201, duration: '312ms' },
  { time: '10:30 AM', method: 'GET', endpoint: '/Patient/p-003/$everything', status: 200, duration: '267ms' },
  { time: '10:28 AM', method: 'GET', endpoint: '/MedicationRequest?patient=p-005', status: 200, duration: '198ms' },
  { time: '10:25 AM', method: 'PUT', endpoint: '/Observation (Adherence)', status: 201, duration: '278ms' },
];

export function IntegrationPage() {
  const [connections, setConnections] = useState(initialConnections);
  const [retrying, setRetrying] = useState<string | null>(null);

  const handleRetry = (connName: string) => {
    setRetrying(connName);
    setTimeout(() => {
      setConnections((prev) =>
        prev.map((c) =>
          c.name === connName
            ? { ...c, status: 'connected' as const, lastSync: 'Just now', patients: 1 }
            : c,
        ),
      );
      setRetrying(null);
    }, 1500);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">EHR Integration</h1>
        <p className="text-sm text-gray-500">FHIR API connections and data synchronization status</p>
      </div>

      {/* Connection cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {connections.map((conn, i) => (
          <motion.div
            key={conn.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl border border-gray-100 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <Cable className={`w-5 h-5 ${conn.status === 'connected' ? 'text-health-500' : 'text-red-400'}`} />
              {conn.status === 'connected' ? (
                <Badge className="bg-health-100 text-health-700 text-[10px]">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Connected
                </Badge>
              ) : (
                <Badge className="bg-red-100 text-red-700 text-[10px]">
                  <XCircle className="w-3 h-3 mr-1" /> Disconnected
                </Badge>
              )}
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">{conn.name}</h3>
            <p className="text-xs text-gray-400 mb-3">{conn.type}</p>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {conn.lastSync}
              </span>
              <span className="text-gray-500">{conn.patients} patients</span>
            </div>
            {conn.status === 'disconnected' && (
              <Button
                size="sm"
                variant="outline"
                className="w-full mt-3 h-7 text-xs"
                disabled={retrying === conn.name}
                onClick={() => handleRetry(conn.name)}
              >
                {retrying === conn.name ? (
                  <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Connecting...</>
                ) : (
                  <><RefreshCw className="w-3 h-3 mr-1" /> Retry Connection</>
                )}
              </Button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Data flow diagram */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl border border-gray-100 p-6 mb-8"
      >
        <h3 className="text-sm font-semibold text-gray-700 mb-5">FHIR Data Flow</h3>
        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center mb-2">
              <span className="text-xs font-medium text-gray-600">EHR</span>
            </div>
            <p className="text-[10px] text-gray-400">Hospital Systems</p>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1 text-[10px] text-medical-500">
              <span>Prescriptions</span>
              <ArrowRight className="w-3 h-3" />
            </div>
            <div className="w-20 h-px bg-medical-300" />
            <div className="flex items-center gap-1 text-[10px] text-health-500">
              <ArrowRight className="w-3 h-3 rotate-180" />
              <span>Adherence Data</span>
            </div>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-medical-50 border border-medical-200 flex items-center justify-center mb-2">
              <span className="text-xs font-bold text-medical-600">MediSync</span>
            </div>
            <p className="text-[10px] text-gray-400">Platform</p>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1 text-[10px] text-amber-500">
              <span>Aggregated Reports</span>
              <ArrowRight className="w-3 h-3" />
            </div>
            <div className="w-20 h-px bg-amber-300" />
            <div className="flex items-center gap-1 text-[10px] text-gray-400">
              <Shield className="w-3 h-3" />
              <span>Data Firewall</span>
            </div>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-2">
              <span className="text-xs font-medium text-amber-600">Insurer</span>
            </div>
            <p className="text-[10px] text-gray-400">De-identified Only</p>
          </div>
        </div>
      </motion.div>

      {/* API log */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl border border-gray-100 overflow-hidden"
      >
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">Recent API Calls</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50 text-xs text-gray-400">
              <th className="text-left p-3 font-medium">Time</th>
              <th className="text-left p-3 font-medium">Method</th>
              <th className="text-left p-3 font-medium">Endpoint</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-left p-3 font-medium">Duration</th>
            </tr>
          </thead>
          <tbody>
            {apiLog.map((log, i) => (
              <tr key={i} className="border-b border-gray-50 text-xs">
                <td className="p-3 text-gray-500">{log.time}</td>
                <td className="p-3">
                  <Badge variant="outline" className={`text-[10px] ${
                    log.method === 'GET' ? 'text-medical-600 border-medical-200' :
                    'text-health-600 border-health-200'
                  }`}>
                    {log.method}
                  </Badge>
                </td>
                <td className="p-3 text-gray-700 font-mono text-[11px]">{log.endpoint}</td>
                <td className="p-3">
                  <Badge className={`text-[10px] ${log.status < 300 ? 'bg-health-100 text-health-700' : 'bg-red-100 text-red-700'}`}>
                    {log.status}
                  </Badge>
                </td>
                <td className="p-3 text-gray-400">{log.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
