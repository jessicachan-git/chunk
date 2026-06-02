import { motion } from 'framer-motion';
import { useSettingsStore } from '../stores/useSettingsStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export function SettingsPage() {
  const navigate = useNavigate();
  const {
    passcodeLength,
    passcodeRevealDuration,
    frictionLayers,
    emergencyWaitMinutes,
    updateSettings,
    toggleFrictionLayer,
  } = useSettingsStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted text-sm mt-1">Configure your focus vault</p>
      </div>

      <Card>
        <h2 className="font-semibold mb-4">Passcode</h2>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">Length</span>
            <div className="flex gap-2">
              {([4, 6] as const).map((len) => (
                <button
                  key={len}
                  onClick={() => updateSettings({ passcodeLength: len })}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    passcodeLength === len
                      ? 'bg-accent text-white'
                      : 'bg-surface border border-surface-border text-muted'
                  }`}
                >
                  {len} digits
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">Reveal duration</span>
            <select
              value={passcodeRevealDuration}
              onChange={(e) => updateSettings({ passcodeRevealDuration: Number(e.target.value) })}
              className="bg-surface border border-surface-border rounded-lg px-3 py-1 text-sm text-white"
            >
              <option value={30}>30s</option>
              <option value={45}>45s</option>
              <option value={60}>60s</option>
              <option value={90}>90s</option>
            </select>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold mb-4">Friction Layers</h2>
        <div className="flex flex-col gap-3">
          {frictionLayers.map((layer) => (
            <div key={layer.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium capitalize">{layer.id}</p>
                <p className="text-xs text-muted">
                  {layer.settings.type === 'delay' && `${layer.settings.durationSeconds}s wait`}
                  {layer.settings.type === 'breathing' && `${layer.settings.durationSeconds}s exercise`}
                  {layer.settings.type === 'reflection' && `Min ${layer.settings.minLength} chars`}
                  {layer.settings.type === 'typing' && 'Type a phrase'}
                  {layer.settings.type === 'math' && `${layer.settings.problemCount} problems`}
                </p>
              </div>
              <button
                onClick={() => toggleFrictionLayer(layer.id, !layer.enabled)}
                className={`w-12 h-7 rounded-full transition-all relative ${
                  layer.enabled ? 'bg-accent' : 'bg-surface-border'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${
                    layer.enabled ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold mb-4">Emergency Unlock</h2>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted">Wait time</span>
          <select
            value={emergencyWaitMinutes}
            onChange={(e) => updateSettings({ emergencyWaitMinutes: Number(e.target.value) })}
            className="bg-surface border border-surface-border rounded-lg px-3 py-1 text-sm text-white"
          >
            <option value={5}>5 min</option>
            <option value={10}>10 min</option>
            <option value={15}>15 min</option>
            <option value={30}>30 min</option>
          </select>
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold mb-4">Data</h2>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/onboarding')}
          className="w-full"
        >
          Restart Setup
        </Button>
      </Card>
    </motion.div>
  );
}
