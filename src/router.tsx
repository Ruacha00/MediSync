import { createHashRouter } from 'react-router-dom';
import { LandingPage } from '@/pages/LandingPage';
import { PatientLayout } from '@/components/layout/PatientLayout';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { HomePage } from '@/pages/patient/HomePage';
import { OnboardingPage } from '@/pages/patient/OnboardingPage';
import { MedicationsPage } from '@/pages/patient/MedicationsPage';
import { HistoryPage } from '@/pages/patient/HistoryPage';
import { SettingsPage } from '@/pages/patient/SettingsPage';
import { OverviewPage } from '@/pages/dashboard/OverviewPage';
import { PatientDetailPage } from '@/pages/dashboard/PatientDetailPage';
import { ReportsPage } from '@/pages/dashboard/ReportsPage';
import { IntegrationPage } from '@/pages/dashboard/IntegrationPage';
import { BusinessModelPage } from '@/pages/business/BusinessModelPage';

export const router = createHashRouter([
  { path: '/', element: <LandingPage /> },
  {
    path: '/patient',
    element: <PatientLayout />,
    children: [
      { path: 'onboarding', element: <OnboardingPage /> },
      { path: 'home', element: <HomePage /> },
      { path: 'medications', element: <MedicationsPage /> },
      { path: 'history', element: <HistoryPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <OverviewPage /> },
      { path: 'patient/:id', element: <PatientDetailPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'integration', element: <IntegrationPage /> },
    ],
  },
  { path: '/business', element: <BusinessModelPage /> },
]);
