import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../db/database';
import { useAnalyticsStore } from '../stores/useAnalyticsStore';
import { Card } from '../components/ui/Card';
import type { LockSession, UnlockAttempt } from '../types';

export function AnalyticsPage() {
  const { currentStreak, longestStreak, totalUnlocks } = useAnalyticsStore();
  const [recentSessions, setRecentSessions] = useState<LockSession[]>([]);
  const [recentAttempts, setRecentAttempts] = useState<UnlockAttempt[]>([]);

  useEffect(() => {
    const load = async () => {
      const sessions = await db.lockSessions.orderBy('startedAt').reverse().limit(10).toArray();
      const attempts = await db.unlockAttempts.orderBy('timestamp').reverse().limit(10).toArray();
      setRecentSessions(sessions);
      setRecentAttempts(attempts);
    };
    load();
  }, []);

  const totalFocusHours = recentSessions.reduce((acc, s) => {
    const end = s.endedAt ?? Date.now();
    return acc + (end - s.startedAt) / 3600000;
  }, 0);

  const abandonedCount = recentAttempts.filter((a) => !a.completed).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted text-sm mt-1">Your focus journey</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="text-center">
          <p className="text-3xl font-bold text-accent">{currentStreak}</p>
          <p className="text-xs text-muted mt-1">Current Streak</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold">{longestStreak}</p>
          <p className="text-xs text-muted mt-1">Longest Streak</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold">{totalFocusHours.toFixed(1)}h</p>
          <p className="text-xs text-muted mt-1">Focus Time</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-success">{abandonedCount}</p>
          <p className="text-xs text-muted mt-1">Resisted Urges</p>
        </Card>
      </div>

      <Card>
        <h2 className="font-semibold mb-3">Recent Sessions</h2>
        {recentSessions.length === 0 ? (
          <p className="text-muted text-sm">No sessions yet. Start your first focus session!</p>
        ) : (
          <div className="flex flex-col gap-2">
            {recentSessions.slice(0, 5).map((session) => {
              const duration = ((session.endedAt ?? Date.now()) - session.startedAt) / 60000;
              const date = new Date(session.startedAt);
              return (
                <div key={session.id} className="flex items-center justify-between py-2 border-b border-surface-border last:border-0">
                  <div>
                    <p className="text-sm font-medium">
                      {date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-xs text-muted">{session.mode}</p>
                  </div>
                  <p className="text-sm font-mono">
                    {duration >= 60 ? `${(duration / 60).toFixed(1)}h` : `${Math.round(duration)}m`}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Card>
        <h2 className="font-semibold mb-3">Unlock Attempts</h2>
        <div className="flex items-center gap-6">
          <div>
            <p className="text-2xl font-bold">{totalUnlocks}</p>
            <p className="text-xs text-muted">Completed</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-success">{abandonedCount}</p>
            <p className="text-xs text-muted">Abandoned</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-accent">
              {totalUnlocks + abandonedCount > 0
                ? Math.round((abandonedCount / (totalUnlocks + abandonedCount)) * 100)
                : 0}%
            </p>
            <p className="text-xs text-muted">Resist Rate</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
