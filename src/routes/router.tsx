import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';

const HomePage = lazy(() => import('../pages/HomePage').then((m) => ({ default: m.HomePage })));
const LockPage = lazy(() => import('../pages/LockPage').then((m) => ({ default: m.LockPage })));
const UnlockPage = lazy(() => import('../pages/UnlockPage').then((m) => ({ default: m.UnlockPage })));
const StationsPage = lazy(() => import('../pages/StationsPage').then((m) => ({ default: m.StationsPage })));
const AnalyticsPage = lazy(() => import('../pages/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage })));
const SettingsPage = lazy(() => import('../pages/SettingsPage').then((m) => ({ default: m.SettingsPage })));
const OnboardingPage = lazy(() => import('../pages/OnboardingPage').then((m) => ({ default: m.OnboardingPage })));

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function SuspensePage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <SuspensePage><HomePage /></SuspensePage> },
      { path: 'lock', element: <SuspensePage><LockPage /></SuspensePage> },
      { path: 'unlock', element: <SuspensePage><UnlockPage /></SuspensePage> },
      { path: 'stations', element: <SuspensePage><StationsPage /></SuspensePage> },
      { path: 'analytics', element: <SuspensePage><AnalyticsPage /></SuspensePage> },
      { path: 'settings', element: <SuspensePage><SettingsPage /></SuspensePage> },
      { path: 'onboarding', element: <SuspensePage><OnboardingPage /></SuspensePage> },
    ],
  },
]);
