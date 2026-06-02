import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { useSettingsStore } from '../../stores/useSettingsStore';

export function AppShell() {
  const onboardingComplete = useSettingsStore((s) => s.onboardingComplete);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-surface">
      <main className="flex-1 pb-20 px-4 pt-12 max-w-lg mx-auto w-full">
        <Outlet />
      </main>
      {onboardingComplete && <BottomNav />}
    </div>
  );
}
